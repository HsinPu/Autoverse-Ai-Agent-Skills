#!/usr/bin/env node

'use strict';

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const manifestPath = path.join(root, 'scripts', 'data', 'legacy-skill-content-sha256.tsv');
const text = fs.readFileSync(manifestPath, 'utf8').replace(/\r\n/g, '\n');
const lines = text.split('\n');

assert.strictEqual(lines[0], '# craftroster-verified-legacy-skill-content-v1');
assert.strictEqual(lines[1], '# digest-namespace: craftroster-skill-content-v1');
assert.strictEqual(
  lines[2],
  '# history-range: 3e5d15ebf81bcdc53bf187cad734020875e4d560^..e66a7ff4f6978f430cfccae34a7f7018e5d20498',
);
assert.match(lines[3], /^# skills: [1-9][0-9]*$/);
assert.match(lines[4], /^# entries: [1-9][0-9]*$/);
assert.strictEqual(lines.at(-1), '', 'manifest must end with one newline');

const expectedSkillCount = Number(lines[3].slice('# skills: '.length));
const expectedEntryCount = Number(lines[4].slice('# entries: '.length));
const rows = lines.slice(5, -1);
assert.strictEqual(rows.length, expectedEntryCount, 'manifest entry count does not match its header');

const keys = new Set();
const skills = new Set();
let previous = '';
for (const row of rows) {
  assert.match(row, /^[a-z0-9]+(?:-[a-z0-9]+)*\t[0-9a-f]{64}$/, `invalid manifest row: ${row}`);
  assert(previous < row, `manifest rows must be sorted and unique: ${row}`);
  assert(!keys.has(row), `duplicate manifest row: ${row}`);
  previous = row;
  keys.add(row);
  skills.add(row.split('\t', 1)[0]);
}
assert.strictEqual(skills.size, expectedSkillCount, 'manifest Skill count does not match its header');

function skillContentDigest(skillRoot) {
  const files = [];
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(fullPath);
      else if (entry.isFile()) {
        const relativePath = path.relative(skillRoot, fullPath).split(path.sep).join('/');
        if (relativePath !== '.skill-meta.json') files.push({ fullPath, relativePath });
      } else {
        throw new Error(`legacy fixture contains unsupported content: ${fullPath}`);
      }
    }
  }
  visit(skillRoot);
  files.sort((left, right) => Buffer.compare(
    Buffer.from(left.relativePath, 'utf8'),
    Buffer.from(right.relativePath, 'utf8'),
  ));
  const hasher = crypto.createHash('sha256');
  hasher.update('craftroster-skill-content-v1\0', 'utf8');
  for (const file of files) {
    const content = fs.readFileSync(file.fullPath);
    hasher.update(file.relativePath, 'utf8');
    hasher.update('\0');
    hasher.update(String(content.length), 'ascii');
    hasher.update('\0');
    hasher.update(content);
    hasher.update('\0');
  }
  return hasher.digest('hex');
}

const fixtureName = 'terminal-ops';
const fixtureDigest = skillContentDigest(path.join(root, 'tests', 'fixtures', 'legacy-skills', fixtureName));
assert(
  keys.has(`${fixtureName}\t${fixtureDigest}`),
  'legacy terminal-ops fixture must be present in the verified digest manifest',
);

console.log(`Legacy Skill digest manifest passed: ${skills.size} Skills, ${rows.length} digests`);
