#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const componentNamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function compareRows(left, right) {
  for (const field of ['type', 'category', 'name']) {
    if (left[field] < right[field]) return -1;
    if (left[field] > right[field]) return 1;
  }
  return 0;
}

function appendCatalogRows(rows, catalog, options) {
  const { type, collection, nameField } = options;
  if (!catalog || !Array.isArray(catalog[collection])) {
    throw new Error(`${type} catalog must contain a ${collection} array`);
  }
  if (catalog.total !== catalog[collection].length) {
    throw new Error(`${type} catalog total does not match ${collection}.length`);
  }

  const names = new Set();
  for (const entry of catalog[collection]) {
    const name = entry && entry[nameField];
    const category = entry && entry.category;
    if (typeof name !== 'string' || !componentNamePattern.test(name)) {
      throw new Error(`${type} catalog contains an invalid name`);
    }
    if (names.has(name)) throw new Error(`duplicate ${type} name: ${name}`);
    names.add(name);
    if (typeof category !== 'string' || !componentNamePattern.test(category)) {
      throw new Error(`${type} ${name} has an invalid category`);
    }
    rows.push({ type, category, name });
  }
}

function buildInstallCategoryRows(skillCatalog, agentCatalog) {
  const rows = [];
  appendCatalogRows(rows, skillCatalog, {
    type: 'skill',
    collection: 'skills',
    nameField: 'name'
  });
  appendCatalogRows(rows, agentCatalog, {
    type: 'agent',
    collection: 'agents',
    nameField: 'id'
  });
  return rows.sort(compareRows);
}

function renderInstallCategoryIndex(rows) {
  const lines = ['type\tcategory\tname'];
  for (const row of rows) lines.push(`${row.type}\t${row.category}\t${row.name}`);
  return `${lines.join('\n')}\n`;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function run(argv = process.argv.slice(2), root = path.resolve(__dirname, '..')) {
  let check = false;
  for (const arg of argv) {
    if (arg === '--check') check = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }

  const rows = buildInstallCategoryRows(
    readJson(path.join(root, 'skills.json')),
    readJson(path.join(root, 'agents.json'))
  );
  const rendered = renderInstallCategoryIndex(rows);
  const outputPath = path.join(root, 'scripts', 'data', 'install-category-index.tsv');

  if (check) {
    const current = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf8') : '';
    if (current !== rendered) {
      throw new Error('install-category-index.tsv is out of date; run npm run generate:install-categories');
    }
    console.log(`Install category index check passed: ${rows.length} components`);
    return;
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, rendered, 'utf8');
  console.log(`Generated install-category-index.tsv for ${rows.length} components`);
}

if (require.main === module) {
  try {
    run();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = {
  buildInstallCategoryRows,
  renderInstallCategoryIndex,
  run
};
