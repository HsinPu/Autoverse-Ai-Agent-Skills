#!/usr/bin/env node

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  buildInstallCategoryRows,
  renderInstallCategoryIndex,
  run
} = require('../scripts/generate-install-category-index');

let passed = 0;
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'craftroster-install-category-'));

function test(name, callback) {
  callback();
  passed += 1;
  console.log(`PASS ${name}`);
}

function expectError(name, callback, expected) {
  assert.throws(callback, (error) => {
    assert(error.message.includes(expected), `${name}: unexpected message ${error.message}`);
    return true;
  });
  passed += 1;
  console.log(`PASS ${name}`);
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function fixtureCatalogs() {
  return {
    skills: {
      total: 2,
      skills: [
        { name: 'zeta-skill', category: 'testing-quality' },
        { name: 'alpha-skill', category: 'software-engineering' }
      ]
    },
    agents: {
      total: 2,
      agents: [
        { id: 'zeta-agent', category: 'quality-assurance' },
        { id: 'alpha-agent', category: 'development' }
      ]
    }
  };
}

function safeCleanup() {
  const resolvedTemp = path.resolve(os.tmpdir());
  const resolvedTarget = path.resolve(tempRoot);
  const relative = path.relative(resolvedTemp, resolvedTarget);
  if (
    relative === ''
    || relative.startsWith(`..${path.sep}`)
    || path.isAbsolute(relative)
    || !path.basename(resolvedTarget).startsWith('craftroster-install-category-')
  ) {
    throw new Error(`Refusing to clean unexpected test path: ${resolvedTarget}`);
  }
  fs.rmSync(resolvedTarget, { recursive: true, force: true });
}

try {
  test('builds deterministic rows for Skills and Agents', () => {
    const catalogs = fixtureCatalogs();
    const rows = buildInstallCategoryRows(catalogs.skills, catalogs.agents);
    assert.deepStrictEqual(rows, [
      { type: 'agent', category: 'development', name: 'alpha-agent' },
      { type: 'agent', category: 'quality-assurance', name: 'zeta-agent' },
      { type: 'skill', category: 'software-engineering', name: 'alpha-skill' },
      { type: 'skill', category: 'testing-quality', name: 'zeta-skill' }
    ]);
    assert.strictEqual(
      renderInstallCategoryIndex(rows),
      'type\tcategory\tname\nagent\tdevelopment\talpha-agent\nagent\tquality-assurance\tzeta-agent\nskill\tsoftware-engineering\talpha-skill\nskill\ttesting-quality\tzeta-skill\n'
    );
  });

  expectError('rejects malformed category values', () => {
    const catalogs = fixtureCatalogs();
    catalogs.skills.skills[0].category = 'bad\tcategory';
    buildInstallCategoryRows(catalogs.skills, catalogs.agents);
  }, 'invalid category');

  expectError('rejects duplicate component names', () => {
    const catalogs = fixtureCatalogs();
    catalogs.skills.skills[1].name = 'zeta-skill';
    buildInstallCategoryRows(catalogs.skills, catalogs.agents);
  }, 'duplicate skill name');

  test('writes and checks a repository category index', () => {
    const catalogs = fixtureCatalogs();
    writeJson(path.join(tempRoot, 'skills.json'), catalogs.skills);
    writeJson(path.join(tempRoot, 'agents.json'), catalogs.agents);
    run([], tempRoot);
    run(['--check'], tempRoot);
    fs.writeFileSync(path.join(tempRoot, 'scripts', 'data', 'install-category-index.tsv'), 'stale\n', 'utf8');
    assert.throws(() => run(['--check'], tempRoot), /out of date/);
  });
} finally {
  safeCleanup();
}

console.log(`Install category index tests passed: ${passed}`);
