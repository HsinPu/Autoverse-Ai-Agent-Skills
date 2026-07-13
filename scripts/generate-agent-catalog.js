#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const agentsRoot = path.join(root, 'agents');
const catalogPath = path.join(root, 'agents.json');
const readmePath = path.join(root, 'README.md');

const requiredFields = [
  'id',
  'name',
  'role',
  'description',
  'category',
  'author',
  'source',
  'license',
  'model',
  'permission',
  'skills',
  'tags',
  'reference-repo',
  'reference-paths',
  'reference-tree'
];

function parseScalar(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try { return JSON.parse(trimmed); } catch { /* Use plain scalar fallback. */ }
  }
  return trimmed.replace(/^['"]|['"]$/g, '');
}

function parseFrontmatter(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`${path.relative(root, filePath)} is missing YAML frontmatter`);

  const fields = {};
  let currentList = null;
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (field) {
      fields[field[1]] = field[2].trim() === '' ? [] : parseScalar(field[2]);
      currentList = field[2].trim() === '' ? field[1] : null;
      continue;
    }
    const item = line.match(/^\s+-\s+(.+)$/);
    if (item && currentList) fields[currentList].push(parseScalar(item[1]));
  }
  return fields;
}

function listAgentFiles() {
  if (!fs.existsSync(agentsRoot)) throw new Error('agents/ directory is missing');
  return fs.readdirSync(agentsRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => path.join(agentsRoot, entry.name))
    .sort();
}

function readAgents() {
  return listAgentFiles().map((filePath) => {
    const fields = parseFrontmatter(filePath);
    const relativePath = path.relative(root, filePath).replace(/\\/g, '/');
    for (const field of requiredFields) {
      if (!fields[field] || (Array.isArray(fields[field]) && fields[field].length === 0)) {
        throw new Error(`${relativePath} is missing required frontmatter field: ${field}`);
      }
    }

    const role = path.basename(filePath, '.md');
    if (fields.role !== role || fields.id !== role || fields.name !== role) {
      throw new Error(`${relativePath} does not match its flat role identity (${role})`);
    }

    return {
      id: fields.id,
      name: fields.name,
      role: fields.role,
      description: fields.description,
      category: fields.category,
      author: fields.author,
      source: fields.source,
      license: fields.license,
      model: fields.model,
      permission: fields.permission,
      skills: fields.skills,
      tags: fields.tags,
      path: relativePath,
      references: {
        repo: fields['reference-repo'],
        paths: fields['reference-paths'],
        tree: fields['reference-tree']
      }
    };
  }).sort((left, right) => left.id.localeCompare(right.id));
}

function renderCategorySummary(agents) {
  const groups = new Map();
  for (const agent of agents) {
    const group = groups.get(agent.category) || [];
    group.push(agent);
    groups.set(agent.category, group);
  }
  const rows = [...groups.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([category, entries]) => {
    const links = entries.sort((left, right) => left.role.localeCompare(right.role))
      .map((agent) => `[\`${agent.role}\`](${agent.path})`).join(', ');
    return `| \`${category}\` | ${entries.length} | ${links} |`;
  });
  return [
    '<!-- AGENT_SUMMARY_START -->',
    '| Category | Count | Agents |',
    '|---|---:|---|',
    ...rows,
    '<!-- AGENT_SUMMARY_END -->'
  ].join('\n');
}

function updateReadme(agents) {
  if (!fs.existsSync(readmePath)) return;
  let readme = fs.readFileSync(readmePath, 'utf8');
  const countBlock = /<!-- AGENT_COUNT_START -->[\s\S]*?<!-- AGENT_COUNT_END -->/;
  const summaryBlock = /<!-- AGENT_SUMMARY_START -->[\s\S]*?<!-- AGENT_SUMMARY_END -->/;
  if (countBlock.test(readme)) {
    readme = readme.replace(
      countBlock,
      `<!-- AGENT_COUNT_START -->\n目前共收錄 **${agents.length}** 個不重複 Agents。\n<!-- AGENT_COUNT_END -->`
    );
  }
  if (summaryBlock.test(readme)) readme = readme.replace(summaryBlock, renderCategorySummary(agents));
  fs.writeFileSync(readmePath, readme, 'utf8');
}

const agents = readAgents();
const catalog = {
  version: '3.0.0',
  updated: new Date().toISOString(),
  total: agents.length,
  categories: new Set(agents.map((agent) => agent.category)).size,
  uniqueRoles: new Set(agents.map((agent) => agent.role)).size,
  agents
};

fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
updateReadme(agents);
console.log(`Generated agents.json for ${agents.length} unique Agents across ${catalog.categories} categories`);
