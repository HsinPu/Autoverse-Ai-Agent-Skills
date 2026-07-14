#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const catalogPath = path.join(root, 'agents.json');
const matrixPath = path.join(root, 'scripts', 'data', 'agent-coverage-matrix.json');
const documentationPath = path.join(root, 'docs', 'agent-coverage-matrix.md');
const readmePath = path.join(root, 'README.md');
const errors = [];

function fail(message) {
  errors.push(message);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    fail(`Unable to read ${path.relative(root, filePath)}: ${error.message}`);
    return null;
  }
}

const catalog = readJson(catalogPath);
const matrix = readJson(matrixPath);
const agents = catalog && Array.isArray(catalog.agents) ? catalog.agents : [];
const entries = matrix && Array.isArray(matrix.categories) ? matrix.categories : [];
const agentsById = new Map(agents.map((agent) => [agent.id, agent]));
const catalogCategories = new Set(agents.map((agent) => agent.category));
const matrixCategories = new Set();
let representativeOwners = 0;

if (!matrix || typeof matrix.scope !== 'string' || matrix.scope.trim() === '') {
  fail('Coverage matrix is missing a non-empty scope');
}
if (!matrix || !Array.isArray(matrix.criteria) || matrix.criteria.length < 4) {
  fail('Coverage matrix must define at least four coverage criteria');
}

for (const entry of entries) {
  const label = entry && entry.category ? entry.category : '<unknown-category>';
  if (!entry || typeof entry !== 'object') {
    fail('Coverage matrix contains a non-object category entry');
    continue;
  }
  if (matrixCategories.has(entry.category)) fail(`Duplicate coverage category: ${entry.category}`);
  matrixCategories.add(entry.category);

  if (entry.status !== 'covered') fail(`${label}: status must be covered`);
  for (const field of ['category', 'coreWork', 'handoff', 'boundary']) {
    if (typeof entry[field] !== 'string' || entry[field].trim() === '') fail(`${label}: missing ${field}`);
  }
  if (!Array.isArray(entry.owners) || entry.owners.length < 2) {
    fail(`${label}: at least two representative owners are required`);
    continue;
  }
  const uniqueOwners = new Set(entry.owners);
  if (uniqueOwners.size !== entry.owners.length) fail(`${label}: duplicate representative owner`);
  representativeOwners += uniqueOwners.size;
  for (const owner of uniqueOwners) {
    const agent = agentsById.get(owner);
    if (!agent) {
      fail(`${label}: representative owner does not exist: ${owner}`);
    } else if (agent.category !== entry.category) {
      fail(`${label}: ${owner} belongs to ${agent.category}`);
    }
  }
}

for (const category of catalogCategories) {
  if (!matrixCategories.has(category)) fail(`Catalog category is missing from coverage matrix: ${category}`);
}
for (const category of matrixCategories) {
  if (!catalogCategories.has(category)) fail(`Coverage matrix category is absent from catalog: ${category}`);
}
if (entries.length !== catalogCategories.size) {
  fail(`Coverage matrix has ${entries.length} categories; catalog has ${catalogCategories.size}`);
}
if (catalog && Number(catalog.categories) !== catalogCategories.size) {
  fail(`agents.json categories (${catalog.categories}) does not match computed categories (${catalogCategories.size})`);
}

let documentation = '';
try {
  documentation = fs.readFileSync(documentationPath, 'utf8');
} catch (error) {
  fail(`Unable to read ${path.relative(root, documentationPath)}: ${error.message}`);
}
for (const entry of entries) {
  if (!documentation.includes(`| \`${entry.category}\` |`)) fail(`Coverage documentation is missing category row: ${entry.category}`);
  for (const owner of entry.owners || []) {
    if (!documentation.includes(`\`${owner}\``)) fail(`Coverage documentation is missing representative owner: ${owner}`);
  }
}

try {
  const readme = fs.readFileSync(readmePath, 'utf8');
  if (!readme.includes('docs/agent-coverage-matrix.md')) fail('README does not link to the Agent coverage matrix');
} catch (error) {
  fail(`Unable to read README.md: ${error.message}`);
}

if (errors.length > 0) {
  console.error('Agent coverage validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Agent coverage matrix passed: ${entries.length}/${catalogCategories.size} categories, ${representativeOwners} representative owners`);
