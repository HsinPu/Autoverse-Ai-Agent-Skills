#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'craftroster-catalog-tests-'));
let passed = 0;

function runValidator(cwd) {
  return spawnSync(process.execPath, ['scripts/validate-catalog.js'], {
    cwd,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024
  });
}

function copyCase(name) {
  const target = path.join(tempRoot, name);
  fs.cpSync(root, target, {
    recursive: true,
    filter(source) {
      const relative = path.relative(root, source);
      if (!relative) return true;
      const first = relative.split(path.sep, 1)[0];
      return first !== '.git' && first !== 'node_modules';
    }
  });
  return target;
}

function readCatalog(cwd) {
  return JSON.parse(fs.readFileSync(path.join(cwd, 'skills.json'), 'utf8'));
}

function writeCatalog(cwd, catalog) {
  fs.writeFileSync(path.join(cwd, 'skills.json'), `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
}

function skillPath(cwd, name = 'answer-writing') {
  return path.join(cwd, 'skills', name, 'SKILL.md');
}

function mutateSkill(cwd, name, pattern, replacement) {
  const filePath = skillPath(cwd, name);
  const original = fs.readFileSync(filePath, 'utf8');
  const mutated = original.replace(pattern, replacement);
  if (mutated === original) throw new Error(`${name} frontmatter fixture did not mutate`);
  fs.writeFileSync(filePath, mutated, 'utf8');
}

function expectRejected(name, mutate, expectedMessage) {
  const cwd = copyCase(name);
  mutate(cwd);
  const result = runValidator(cwd);
  const output = `${result.stdout || ''}${result.stderr || ''}`;
  if (result.status === 0) {
    throw new Error(`${name}: validator accepted an invalid fixture`);
  }
  const expectedMessages = Array.isArray(expectedMessage) ? expectedMessage : [expectedMessage];
  for (const message of expectedMessages) {
    if (!output.includes(message)) {
      throw new Error(`${name}: missing expected message ${JSON.stringify(message)}\n${output}`);
    }
  }
  if (/TypeError|Cannot read properties of/i.test(output)) {
    throw new Error(`${name}: validator crashed instead of reporting a catalog finding\n${output}`);
  }
  passed += 1;
  console.log(`PASS ${name}`);
}

try {
  expectRejected('preserves catalog entry validation semantics', (cwd) => {
    const catalog = readCatalog(cwd);
    catalog.skills.find((skill) => skill.name === 'answer-writing').author = 'External Author';
    catalog.skills.find((skill) => skill.name === 'skill-creator-design').reference.revision = 'deadbeef';
    catalog.skills[0] = null;
    writeCatalog(cwd, catalog);
  }, [
    'skills.json skills[0] must be an object',
    'answer-writing author must be HsinPu',
    'skill-creator-design reference.revision must be a full 40-character Git commit SHA'
  ]);

  expectRejected('enforces official Skill top-level fields and constraints', (cwd) => {
    mutateSkill(
      cwd,
      'answer-writing',
      /license: Apache-2\.0(\r?\n)metadata:/,
      'license: Apache-2.0$1source: HsinPu/CraftRoster$1metadata:'
    );
    mutateSkill(
      cwd,
      'accessibility-testing',
      /license: Apache-2\.0(\r?\n)metadata:/,
      'license: Apache-2.0$1version: "1.0"$1metadata:'
    );
    mutateSkill(cwd, 'agent-action-governance', /^name: .*$/m, `name: ${'a'.repeat(65)}`);
    mutateSkill(cwd, 'agent-creator-design', /^name: .*$/m, 'name: agent--creator-design');
    mutateSkill(cwd, 'agent-instructions-authoring', /^description: .*$/m, `description: ${'a'.repeat(1025)}`);
    mutateSkill(
      cwd,
      'agent-reach-ops',
      /(license: Apache-2\.0)(\r?\n)/,
      `$1$2compatibility: ${'a'.repeat(501)}$2`
    );
    mutateSkill(
      cwd,
      'agents-sdk-development',
      /(license: Apache-2\.0)(\r?\n)/,
      '$1$2allowed-tools:$2  - Bash$2'
    );
    mutateSkill(
      cwd,
      'ai-image-prompt-design',
      /(  source: .*?)(\r?\n)/,
      '$1$2  version: 1$2'
    );
  }, [
    'answer-writing: SKILL.md contains unknown top-level frontmatter field: source',
    'accessibility-testing: SKILL.md contains unknown top-level frontmatter field: version',
    'agent-action-governance: SKILL.md name must be a string between 1 and 64 characters',
    'agent-creator-design: SKILL.md name must contain only lowercase letters, digits, and single hyphens',
    'agent-instructions-authoring: SKILL.md description must be a string between 1 and 1024 characters',
    'agent-reach-ops: SKILL.md compatibility must be a string between 1 and 500 characters when declared',
    'agents-sdk-development: SKILL.md allowed-tools must be a space-separated string when declared',
    'ai-image-prompt-design: SKILL.md metadata must be a string-to-string mapping (version)'
  ]);

  expectRejected('requires nested Skill ownership metadata and catalog parity', (cwd) => {
    mutateSkill(cwd, 'accessibility-testing', /^  author: .*(\r?\n)/m, '');
    mutateSkill(cwd, 'answer-writing', /^  author: .*$/m, '  author: "External Author"');
    mutateSkill(cwd, 'agent-action-governance', /^  source: .*(\r?\n)/m, '');
    mutateSkill(cwd, 'agent-creator-design', /^  source: .*$/m, '  source: "external/example"');
  }, [
    'accessibility-testing: SKILL.md metadata.author is required',
    'answer-writing: author mismatch',
    'agent-action-governance: SKILL.md metadata.source is required',
    'agent-creator-design: source mismatch'
  ]);

  expectRejected('enforces nested Skill reference metadata parity', (cwd) => {
    mutateSkill(
      cwd,
      'answer-writing',
      /(  source: .*?)(\r?\n)/,
      '$1$2  reference-source: "external/example"$2  reference-license: "MIT"$2'
    );
    mutateSkill(
      cwd,
      'accessibility-testing',
      /(  source: .*?)(\r?\n)/,
      '$1$2  reference-source: $2  reference-license: $2'
    );
    mutateSkill(cwd, 'karpathy-guidelines', /^  reference-source: .*$/m, '  reference-source: "external/example"');
    mutateSkill(
      cwd,
      'skill-creator-design',
      /^  reference-revision: .*$/m,
      '  reference-revision: "deadbeef"'
    );
  }, [
    'answer-writing: SKILL.md metadata declares reference metadata but skills.json has no reference entry',
    'accessibility-testing: SKILL.md metadata declares reference metadata but skills.json has no reference entry',
    'karpathy-guidelines: reference.source mismatch',
    'skill-creator-design: metadata.reference-revision must be a full 40-character Git commit SHA'
  ]);

  expectRejected('rejects malformed YAML frontmatter instead of reporting a false green', (cwd) => {
    mutateSkill(cwd, 'answer-writing', /^description: .*$/m, 'description: "unterminated');
    mutateSkill(
      cwd,
      'accessibility-testing',
      /^  source: .*$/m,
      '  source "HsinPu/CraftRoster"'
    );
    mutateSkill(cwd, 'agent-action-governance', /^license: .*$/m, 'license: [Apache-2.0]');
  }, [
    `${path.join('skills', 'answer-writing', 'SKILL.md')} has invalid YAML frontmatter: line 3: unterminated double-quoted scalar`,
    `${path.join('skills', 'accessibility-testing', 'SKILL.md')} has invalid YAML frontmatter: line 7: unsupported YAML syntax`,
    `${path.join('skills', 'agent-action-governance', 'SKILL.md')} has invalid YAML frontmatter: line 4: unsupported YAML scalar`
  ]);

  console.log(`Catalog validation tests passed: ${passed}`);
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
