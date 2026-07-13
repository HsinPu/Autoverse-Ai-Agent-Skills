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
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
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
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => ({
      role: path.basename(entry.name, '.md'),
      filePath: path.join(agentsRoot, entry.name)
    }))
    .sort((left, right) => left.role.localeCompare(right.role));
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

function renderCursor(fields, body) {
  return [
    '---',
    `name: ${fields.name}`,
    `description: ${JSON.stringify(fields.description)}`,
    'model: inherit',
    `readonly: ${fields.permission === 'read-only'}`,
    '---',
    '',
    body,
    ''
  ].join('\n');
}

function renderCopilot(fields, body) {
  const lines = [
    '---',
    `name: ${fields.name}`,
    `description: ${JSON.stringify(fields.description)}`
  ];
  if (fields.permission === 'read-only') {
    lines.push('tools:', '  - read', '  - search', '  - web', '  - agent');
  }
  lines.push('---', '', body, '');
  return lines.join('\n');
}

function renderOpenCode(fields, body) {
  const lines = [
    '---',
    `description: ${JSON.stringify(fields.description)}`,
    'mode: subagent',
    'permission:',
    `  edit: ${fields.permission === 'read-only' ? 'deny' : 'allow'}`
  ];
  if (fields.permission === 'read-only') lines.push('  bash: deny');
  lines.push('---', '', body, '');
  return lines.join('\n');
}

function resetGeneratedAdapters() {
  for (const platform of ['codex', 'claude', 'cursor', 'copilot', 'opencode']) {
    const platformRoot = path.join(adaptersRoot, platform);
    if (path.dirname(platformRoot) !== adaptersRoot) throw new Error(`Unsafe adapter output path: ${platformRoot}`);
    fs.rmSync(platformRoot, { recursive: true, force: true });
    fs.mkdirSync(platformRoot, { recursive: true });
  }
}

function main() {
  const agents = listAgents();
  if (agents.length !== 134) throw new Error(`Expected 134 canonical Agents, found ${agents.length}`);
  resetGeneratedAdapters();
  for (const agent of agents) {
    const { fields, body } = parseAgent(agent.filePath);
    if (fields.id !== agent.role || fields.name !== agent.role || fields.role !== agent.role) {
      throw new Error(`${agent.role} has inconsistent canonical identity`);
    }
    if (!['read-only', 'workspace-write'].includes(fields.permission)) {
      throw new Error(`${agent.role} has unsupported permission: ${fields.permission}`);
    }
    fs.writeFileSync(path.join(adaptersRoot, 'codex', `${agent.role}.toml`), renderCodex(fields, body), 'utf8');
    fs.writeFileSync(path.join(adaptersRoot, 'claude', `${agent.role}.md`), renderClaude(fields, body), 'utf8');
    fs.writeFileSync(path.join(adaptersRoot, 'cursor', `${agent.role}.md`), renderCursor(fields, body), 'utf8');
    fs.writeFileSync(path.join(adaptersRoot, 'copilot', `${agent.role}.agent.md`), renderCopilot(fields, body), 'utf8');
    fs.writeFileSync(path.join(adaptersRoot, 'opencode', `${agent.role}.md`), renderOpenCode(fields, body), 'utf8');
  }
  console.log(`Generated Codex, Claude, Cursor, GitHub Copilot, and OpenCode adapters for ${agents.length} Agents`);
}

main();
