#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'autoverse-catalog-tests-'));
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

function expectRejected(name, mutate, expectedMessage) {
  const cwd = copyCase(name);
  mutate(cwd);
  const result = runValidator(cwd);
  const output = `${result.stdout || ''}${result.stderr || ''}`;
  if (result.status === 0) {
    throw new Error(`${name}: validator accepted an invalid fixture`);
  }
  if (!output.includes(expectedMessage)) {
    throw new Error(`${name}: missing expected message ${JSON.stringify(expectedMessage)}\n${output}`);
  }
  if (/TypeError|Cannot read properties of/i.test(output)) {
    throw new Error(`${name}: validator crashed instead of reporting a catalog finding\n${output}`);
  }
  passed += 1;
  console.log(`PASS ${name}`);
}

try {
  expectRejected('rejects a non-object Skill entry without crashing', (cwd) => {
    const catalog = readCatalog(cwd);
    catalog.skills[0] = null;
    writeCatalog(cwd, catalog);
  }, 'skills.json skills[0] must be an object');

  expectRejected('requires the canonical HsinPu author', (cwd) => {
    const catalog = readCatalog(cwd);
    catalog.skills.find((skill) => skill.name === 'answer-writing').author = 'External Author';
    writeCatalog(cwd, catalog);
  }, 'answer-writing author must be HsinPu');

  expectRejected('rejects SKILL-only reference metadata', (cwd) => {
    const skillPath = path.join(cwd, 'skills', 'answer-writing', 'SKILL.md');
    const original = fs.readFileSync(skillPath, 'utf8');
    const mutated = original.replace(
      /license: Apache-2\.0(\r?\n)---/,
      'license: Apache-2.0$1reference-source: external/example$1reference-license: MIT$1---'
    );
    if (mutated === original) throw new Error('reference metadata fixture did not mutate');
    fs.writeFileSync(skillPath, mutated, 'utf8');
  }, 'answer-writing: SKILL.md declares reference metadata but skills.json has no reference entry');

  expectRejected('rejects blank SKILL-only reference metadata', (cwd) => {
    const skillPath = path.join(cwd, 'skills', 'answer-writing', 'SKILL.md');
    const original = fs.readFileSync(skillPath, 'utf8');
    const mutated = original.replace(
      /license: Apache-2\.0(\r?\n)---/,
      'license: Apache-2.0$1reference-source:$1reference-license:$1---'
    );
    if (mutated === original) throw new Error('blank reference metadata fixture did not mutate');
    fs.writeFileSync(skillPath, mutated, 'utf8');
  }, 'answer-writing: SKILL.md declares reference metadata but skills.json has no reference entry');

  expectRejected('requires a full pinned reference revision', (cwd) => {
    const catalog = readCatalog(cwd);
    catalog.skills.find((skill) => skill.name === 'skill-creator-design').reference.revision = 'deadbeef';
    writeCatalog(cwd, catalog);
  }, 'skill-creator-design reference.revision must be a full 40-character Git commit SHA');

  console.log(`Catalog validation tests passed: ${passed}`);
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
