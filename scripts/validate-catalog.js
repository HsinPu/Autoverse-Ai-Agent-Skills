#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const skillsJsonPath = path.join(root, 'skills.json');
const readmePath = path.join(root, 'README.md');

const errors = [];

function fail(message) {
  errors.push(message);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    fail(`Unable to read JSON: ${path.relative(root, filePath)} (${error.message})`);
    return null;
  }
}

function parseFrontmatter(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    fail(`${path.relative(root, filePath)} is missing YAML frontmatter`);
    return {};
  }

  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (field) {
      fields[field[1]] = field[2].replace(/^['"]|['"]$/g, '');
    }
  }
  return fields;
}

function compare(name, field, expected, actual) {
  if (expected !== actual) {
    fail(`${name}: ${field} mismatch. skills.json=${JSON.stringify(expected)} SKILL.md=${JSON.stringify(actual)}`);
  }
}

const catalog = readJson(skillsJsonPath);
if (!catalog) {
  process.exit(1);
}

if (!Array.isArray(catalog.skills)) {
  fail('skills.json must contain a skills array');
}

const skills = Array.isArray(catalog.skills) ? catalog.skills : [];
if (catalog.total !== skills.length) {
  fail(`skills.json total (${catalog.total}) does not match skills.length (${skills.length})`);
}

const names = new Set();
for (const skill of skills) {
  if (!skill.name) fail('A catalog entry is missing name');
  if (names.has(skill.name)) fail(`Duplicate catalog skill name: ${skill.name}`);
  names.add(skill.name);

  for (const field of ['description', 'category', 'author', 'source', 'license']) {
    if (!skill[field]) fail(`${skill.name || '(unknown)'} is missing catalog field: ${field}`);
  }
  if (!Array.isArray(skill.tags)) fail(`${skill.name || '(unknown)'} tags must be an array`);
}

const skillDirs = fs.readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(root, entry.name, 'SKILL.md')))
  .map((entry) => entry.name)
  .sort();

const catalogNames = [...names].sort();
for (const name of catalogNames) {
  if (!skillDirs.includes(name)) fail(`Catalog entry has no matching skill directory: ${name}`);
}
for (const name of skillDirs) {
  if (!names.has(name)) fail(`Skill directory is missing from skills.json: ${name}`);
}

const catalogByName = new Map(skills.map((skill) => [skill.name, skill]));
for (const name of skillDirs) {
  const skillFile = path.join(root, name, 'SKILL.md');
  const frontmatter = parseFrontmatter(skillFile);
  const catalogEntry = catalogByName.get(name);

  for (const field of ['name', 'description', 'source', 'license']) {
    if (!frontmatter[field]) fail(`${name}: SKILL.md is missing frontmatter field: ${field}`);
  }

  compare(name, 'name', name, frontmatter.name);
  if (catalogEntry) {
    compare(name, 'description', catalogEntry.description, frontmatter.description);
    compare(name, 'source', catalogEntry.source, frontmatter.source);
    compare(name, 'license', catalogEntry.license, frontmatter.license);
  }
}

if (fs.existsSync(readmePath)) {
  const readme = fs.readFileSync(readmePath, 'utf8');
  const countMatch = readme.match(/目前共收錄 \*\*(\d+)\*\* 個 skills/);
  if (countMatch && Number(countMatch[1]) !== skills.length) {
    fail(`README skill count (${countMatch[1]}) does not match skills.length (${skills.length})`);
  }
}

if (errors.length > 0) {
  console.error('Catalog validation failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Catalog validation passed: ${skills.length} skills`);
