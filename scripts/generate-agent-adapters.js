#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const agentsRoot = path.join(root, 'agents');
const adaptersRoot = path.join(root, 'adapters');

function parseScalar(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try { return JSON.parse(trimmed); } catch { /* Use plain scalar fallback. */ }
  }
  return trimmed.replace(/^['"]|['"]$/g, '');
}

function parseAgent(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
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
  return { fields, body: match[2].trim() };
}

function listAgents() {
  return fs.readdirSync(agentsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((pluginEntry) => fs.readdirSync(path.join(agentsRoot, pluginEntry.name), { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
      .map((entry) => ({
        plugin: pluginEntry.name,
        role: path.basename(entry.name, '.md'),
        filePath: path.join(agentsRoot, pluginEntry.name, entry.name)
      })))
    .sort((left, right) => `${left.plugin}/${left.role}`.localeCompare(`${right.plugin}/${right.role}`));
}

function renderCodex(fields, body) {
  const instructions = body.replace(/"""/g, '\\"\\"\\"');
  return [
    `name = ${JSON.stringify(fields.name)}`,
    `description = ${JSON.stringify(fields.description)}`,
    `sandbox_mode = ${JSON.stringify(fields.permission === 'read-only' ? 'read-only' : 'workspace-write')}`,
    'developer_instructions = """',
    instructions,
    '"""',
    ''
  ].join('\n');
}

function renderClaude(fields, body) {
  const lines = [
    '---',
    `name: ${fields.name}`,
    `description: ${JSON.stringify(fields.description)}`,
    'model: inherit',
    `permissionMode: ${fields.permission === 'read-only' ? 'plan' : 'default'}`
  ];
  if (Array.isArray(fields.skills) && fields.skills.length > 0) {
    lines.push('skills:', ...fields.skills.map((skill) => `  - ${skill}`));
  }
  lines.push('---', '', body, '');
  return lines.join('\n');
}

function resetGeneratedAdapters() {
  for (const platform of ['codex', 'claude']) {
    const platformRoot = path.join(adaptersRoot, platform);
    if (!fs.existsSync(platformRoot)) continue;
    for (const pluginEntry of fs.readdirSync(platformRoot, { withFileTypes: true })) {
      if (!pluginEntry.isDirectory()) throw new Error(`Unexpected generated adapter entry: ${pluginEntry.name}`);
      const pluginRoot = path.join(platformRoot, pluginEntry.name);
      for (const entry of fs.readdirSync(pluginRoot, { withFileTypes: true })) {
        if (!entry.isFile()) throw new Error(`Unexpected generated adapter entry: ${platform}/${pluginEntry.name}/${entry.name}`);
        fs.unlinkSync(path.join(pluginRoot, entry.name));
      }
      fs.rmdirSync(pluginRoot);
    }
  }
}

function main() {
  const agents = listAgents();
  if (agents.length !== 199) throw new Error(`Expected 199 canonical Agents, found ${agents.length}`);
  resetGeneratedAdapters();
  for (const agent of agents) {
    const { fields, body } = parseAgent(agent.filePath);
    const id = `${agent.plugin}/${agent.role}`;
    if (fields.id !== id || fields.name !== `${agent.plugin}-${agent.role}`) {
      throw new Error(`${id} has inconsistent canonical identity`);
    }
    const codexRoot = path.join(adaptersRoot, 'codex', agent.plugin);
    const claudeRoot = path.join(adaptersRoot, 'claude', agent.plugin);
    fs.mkdirSync(codexRoot, { recursive: true });
    fs.mkdirSync(claudeRoot, { recursive: true });
    fs.writeFileSync(path.join(codexRoot, `${agent.role}.toml`), renderCodex(fields, body), 'utf8');
    fs.writeFileSync(path.join(claudeRoot, `${agent.role}.md`), renderClaude(fields, body), 'utf8');
  }
  console.log(`Generated Codex and Claude adapters for ${agents.length} Agents`);
}

main();
