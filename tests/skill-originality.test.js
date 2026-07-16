#!/usr/bin/env node

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const {
  auditRepository,
  buildAuditPlan,
  buildRawUrl,
  fetchPinnedText,
  firstOverlap,
} = require('../scripts/audit-skill-originality');
const { computeReferenceLock } = require('../scripts/verify-skill-sources');

const SHA = '1111111111111111111111111111111111111111';
const TEMP_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'autoverse-skill-originality-'));
let passed = 0;

async function test(name, callback) {
  await callback();
  passed += 1;
  console.log(`PASS ${name}`);
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function createFixture(name, options = {}) {
  const root = path.join(TEMP_ROOT, name);
  const skillName = 'fixture-skill';
  const upstreamPath = options.upstreamPath || 'skills/fixture-skill/SKILL.md';
  writeJson(path.join(root, 'skills.json'), {
    version: '1.0.0',
    total: 1,
    skills: [{
      name: skillName,
      description: 'Fixture',
      category: 'testing',
      author: 'HsinPu',
      source: 'HsinPu/Autoverse-Ai-Agent-Skills',
      license: 'Apache-2.0',
      tags: ['testing', 'originality'],
      reference: {
        source: 'example/reference',
        license: 'MIT',
        revision: SHA,
      },
    }],
  });
  const upstreamEvidence = options.upstreamEvidence || [{
    path: upstreamPath,
    blob: '4444444444444444444444444444444444444444',
  }];
  const manifest = {
    schema_version: 1,
    repositories: [{
      repo: 'example/reference',
      commit: options.commit || SHA,
      tree: '2222222222222222222222222222222222222222',
      license: 'MIT',
      licenseEvidence: {
        kind: 'license-file',
        path: 'LICENSE',
        blob: '3333333333333333333333333333333333333333',
      },
      skills: {
        [skillName]: upstreamEvidence,
      },
    }],
  };
  writeJson(path.join(root, 'scripts', 'data', 'skill-reference-sources.json'), manifest);
  writeJson(
    path.join(root, 'scripts', 'data', 'skill-reference-lock.json'),
    computeReferenceLock(manifest)
  );
  const skillDirectory = path.join(root, 'skills', skillName);
  fs.mkdirSync(path.join(skillDirectory, 'references'), { recursive: true });
  fs.writeFileSync(
    path.join(skillDirectory, 'SKILL.md'),
    options.localText || '# Fixture\n\nCanonical instructions use distinct wording.\n',
    'utf8'
  );
  fs.writeFileSync(
    path.join(skillDirectory, 'references', 'guide.md'),
    '# Guide\n\nAdditional first-party guidance uses separate language.\n',
    'utf8'
  );
  return root;
}

function safeCleanup() {
  const resolvedTemp = path.resolve(os.tmpdir());
  const resolvedTarget = path.resolve(TEMP_ROOT);
  const relative = path.relative(resolvedTemp, resolvedTarget);
  if (
    relative === ''
    || relative.startsWith(`..${path.sep}`)
    || path.isAbsolute(relative)
    || !path.basename(resolvedTarget).startsWith('autoverse-skill-originality-')
  ) {
    throw new Error(`Refusing to clean unexpected test path: ${resolvedTarget}`);
  }
  fs.rmSync(resolvedTarget, { recursive: true, force: true });
}

async function main() {
  try {
    await test('detects an exact normalized line of at least 60 characters', () => {
      const copied = 'Capture this unusually specific sentence exactly so the originality audit must reject the duplicated instruction.';
      const overlap = firstOverlap(copied, copied);
      assert.equal(overlap.kind, 'line');
      assert.equal(overlap.localEvidence, copied);
      assert.equal(overlap.upstreamEvidence, copied);
    });

    await test('detects an exact 12-word phrase inside otherwise different lines', () => {
      const phrase = 'alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu';
      const overlap = firstOverlap(
        `Canonical preface ${phrase} with a local conclusion.`,
        `External introduction ${phrase} with a different conclusion.`
      );
      assert.equal(overlap.kind, '12-word phrase');
      assert.equal(overlap.matchedText, phrase);
    });

    await test('detects a 12-word phrase across different soft line wraps in one paragraph', () => {
      const overlap = firstOverlap(
        [
          'Canonical preface alpha beta gamma delta epsilon zeta',
          'eta theta iota kappa lambda mu with a local conclusion.',
        ].join('\n'),
        [
          'External introduction alpha beta gamma',
          'delta epsilon zeta eta theta iota',
          'kappa lambda mu with a different conclusion.',
        ].join('\n')
      );
      assert.equal(overlap.kind, '12-word phrase');
      assert.equal(
        overlap.matchedText,
        'alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu'
      );
    });

    await test('detects copied CJK text across different soft line wraps', () => {
      const overlap = firstOverlap(
        [
          '在開始實作之前先確認使用者目標與現有介面',
          '限制並保留可驗證的設計決策紀錄以便後續審查',
        ].join('\n'),
        [
          '在開始實作之前先確認使用者目標',
          '與現有介面限制並保留可驗證的設計',
          '決策紀錄以便後續審查',
        ].join('\n')
      );
      assert.equal(overlap.kind, '32-CJK-character phrase');
      assert.equal(overlap.matchedText.length, 32);
    });

    await test('accepts unrelated CJK paragraphs longer than the conservative threshold', () => {
      assert.equal(
        firstOverlap(
          '先訪談主要使用者並整理工作流程中的阻礙再依照研究證據調整導覽層級與介面文字內容',
          '發生服務中斷時立即建立事件時間軸並保存監控證據同時指定溝通窗口與後續修復負責人'
        ),
        null
      );
    });

    await test('ignores short generic phrases', () => {
      assert.equal(firstOverlap('Run the tests before release.', 'Run the tests before release.'), null);
    });

    await test('accepts unrelated texts', () => {
      assert.equal(
        firstOverlap(
          'Measure canonical behavior with a bounded release-specific regression suite.',
          'Interview upstream participants before changing the product navigation model.'
        ),
        null
      );
    });

    await test('ignores only identical structural YAML frontmatter metadata', () => {
      const metadata = [
        '---',
        'name: fixture-skill',
        'license: Apache-2.0',
        'metadata:',
        '  author: HsinPu',
        '  source: HsinPu/Autoverse-Ai-Agent-Skills',
        'reference:',
        '  source: example/reference',
        '  license: MIT',
        `  revision: ${SHA}`,
        'tags:',
        '  - testing',
        '  - originality',
        '---',
      ].join('\n');
      assert.equal(
        firstOverlap(`${metadata}\nCanonical body wording.`, `${metadata}\nUpstream body wording.`),
        null
      );
    });

    await test('includes frontmatter descriptions in originality comparison', () => {
      const description = 'This intentionally specific shared description explains exactly how the workflow validates evidence before any implementation begins.';
      const overlap = firstOverlap(
        `---\nname: local-skill\ndescription: ${description}\n---\nCanonical body wording.`,
        `---\nname: upstream-skill\ndescription: ${description}\n---\nUpstream body wording.`
      );
      assert.equal(overlap.kind, 'line');
      assert.match(overlap.matchedText, /intentionally specific shared description/);
    });

    await test('builds a complete manifest-to-package audit plan', () => {
      const root = createFixture('valid-plan');
      const plan = buildAuditPlan(root);
      assert.equal(plan.referencedSkillCount, 1);
      assert.equal(plan.sourceCount, 1);
      assert.equal(plan.localFileCount, 2);
      assert.equal(plan.upstreamPathCount, 1);
      assert.deepEqual(
        plan.items[0].localFiles.map((entry) => entry.path),
        [
          'skills/fixture-skill/references/guide.md',
          'skills/fixture-skill/SKILL.md',
        ]
      );
      assert.equal(plan.items[0].upstreamFiles[0].commit, SHA);
    });

    await test('rejects a missing provenance lock before auditing package text', () => {
      const root = createFixture('missing-reference-lock');
      fs.rmSync(path.join(root, 'scripts', 'data', 'skill-reference-lock.json'));
      assert.throws(
        () => buildAuditPlan(root),
        /Unable to read scripts\/data\/skill-reference-lock\.json/
      );
    });

    await test('rejects an invalid provenance lock schema', () => {
      const root = createFixture('invalid-reference-lock-schema');
      const lockPath = path.join(root, 'scripts', 'data', 'skill-reference-lock.json');
      const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
      lock.schema_version = 2;
      writeJson(lockPath, lock);
      assert.throws(
        () => buildAuditPlan(root),
        /skill-reference-lock\.json must use schema_version 1 with integer counts/
      );
    });

    await test('rejects a stale lock after a manifest evidence mapping is shrunk', () => {
      const root = createFixture('stale-reference-lock', {
        upstreamEvidence: [
          {
            path: 'skills/fixture-skill/SKILL.md',
            blob: '4444444444444444444444444444444444444444',
          },
          {
            path: 'skills/fixture-skill/references/guide.md',
            blob: '5555555555555555555555555555555555555555',
          },
        ],
      });
      const manifestPath = path.join(root, 'scripts', 'data', 'skill-reference-sources.json');
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      manifest.repositories[0].skills['fixture-skill'].pop();
      writeJson(manifestPath, manifest);
      assert.throws(() => buildAuditPlan(root), (error) => {
        assert.match(error.message, /skill-reference-lock\.json referencePathCount does not match/);
        assert.match(error.message, /skill-reference-lock\.json evidenceSha256 does not match/);
        return true;
      });
    });

    await test('rejects NUL bytes in SKILL.md instead of silently skipping it', () => {
      const root = createFixture('nul-skill');
      fs.writeFileSync(
        path.join(root, 'skills', 'fixture-skill', 'SKILL.md'),
        Buffer.from('# Fixture\n\ninvalid\0text\n', 'utf8')
      );
      assert.throws(
        () => buildAuditPlan(root),
        /Known text file skills\/fixture-skill\/SKILL\.md contains NUL bytes/
      );
    });

    await test('rejects invalid UTF-8 in a known text extension', () => {
      const root = createFixture('invalid-utf8');
      fs.writeFileSync(
        path.join(root, 'skills', 'fixture-skill', 'references', 'guide.md'),
        Buffer.from([0x23, 0x20, 0xc3, 0x28])
      );
      assert.throws(
        () => buildAuditPlan(root),
        /Known text file skills\/fixture-skill\/references\/guide\.md is not valid UTF-8/
      );
    });

    await test('skips an undecodable unknown binary format by explicit rule', () => {
      const root = createFixture('unknown-binary');
      fs.writeFileSync(
        path.join(root, 'skills', 'fixture-skill', 'references', 'sample.assetbin'),
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0xff])
      );
      const plan = buildAuditPlan(root);
      assert.equal(plan.localFileCount, 2);
      assert.equal(
        plan.items[0].localFiles.some((entry) => entry.path.endsWith('sample.assetbin')),
        false
      );
    });

    await test('rejects manifest revision drift before any network request', () => {
      const root = createFixture('revision-drift', {
        commit: '9999999999999999999999999999999999999999',
      });
      assert.throws(() => buildAuditPlan(root), /catalog revision does not match .* manifest commit/);
    });

    await test('rejects case-folded duplicate repositories in the manifest', () => {
      const root = createFixture('case-folded-duplicate');
      const manifestPath = path.join(root, 'scripts', 'data', 'skill-reference-sources.json');
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      manifest.repositories.push({
        ...manifest.repositories[0],
        repo: 'Example/Reference',
        skills: {},
      });
      writeJson(manifestPath, manifest);
      assert.throws(
        () => buildAuditPlan(root),
        /duplicate manifest repository \(GitHub repository names are case-insensitive\)/
      );
    });

    await test('audits package text with an injected zero-network source reader', async () => {
      const copied = 'Preserve this highly specific twelve token sequence across both documents for audit evidence now.';
      const root = createFixture('injected-audit', { localText: `# Fixture\n\n${copied}\n` });
      let requests = 0;
      const result = await auditRepository(root, {
        fetchText: async (reference) => {
          requests += 1;
          assert.equal(reference.repo, 'example/reference');
          assert.equal(reference.commit, SHA);
          return `# Upstream\n\n${copied}\n`;
        },
      });
      assert.equal(requests, 1);
      assert.equal(result.findings.length, 1);
      assert.equal(result.findings[0].skill, 'fixture-skill');
      assert.equal(result.findings[0].localPath, 'skills/fixture-skill/SKILL.md');
      assert.equal(result.findings[0].upstreamPath, 'skills/fixture-skill/SKILL.md');
    });

    await test('retries only within the configured bound without using the network', async () => {
      let calls = 0;
      const text = await fetchPinnedText({
        repo: 'example/reference',
        commit: SHA,
        path: 'skills/fixture-skill/SKILL.md',
      }, {
        attempts: 3,
        baseDelayMs: 0,
        request: async () => {
          calls += 1;
          if (calls < 3) {
            const error = new Error('temporary failure');
            error.code = 'ECONNRESET';
            throw error;
          }
          return 'pinned body';
        },
      });
      assert.equal(text, 'pinned body');
      assert.equal(calls, 3);
    });

    await test('constructs an encoded URL pinned to the exact commit', () => {
      assert.equal(
        buildRawUrl({
          repo: 'example/reference',
          commit: SHA,
          path: 'skills/path with spaces/SKILL.md',
        }),
        `https://raw.githubusercontent.com/example/reference/${SHA}/skills/path%20with%20spaces/SKILL.md`
      );
    });

    console.log(`Skill originality tests passed: ${passed}`);
  } finally {
    safeCleanup();
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
