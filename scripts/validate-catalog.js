#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const skillsRoot = path.join(root, 'skills');
const skillsJsonPath = path.join(root, 'skills.json');
const agentsRoot = path.join(root, 'agents');
const adaptersRoot = path.join(root, 'adapters');
const agentsJsonPath = path.join(root, 'agents.json');
const agentReferencePath = path.join(root, 'scripts', 'data', 'wshobson-agent-inventory.json');
const readmePath = path.join(root, 'README.md');

const errors = [];
const canonicalAgentMetadata = {
  author: 'HsinPu',
  source: 'HsinPu/Autoverse-Ai-Agent-Skills',
  license: 'Apache-2.0'
};

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
  let currentListField = null;
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (field) {
      const value = field[2].replace(/^['"]|['"]$/g, '');
      if (value === '') {
        fields[field[1]] = [];
        currentListField = field[1];
      } else {
        fields[field[1]] = value;
        currentListField = null;
      }
      continue;
    }

    const listItem = line.match(/^\s+-\s+(.+)$/);
    if (listItem && currentListField && Array.isArray(fields[currentListField])) {
      fields[currentListField].push(listItem[1].replace(/^['"]|['"]$/g, ''));
    }
  }
  return fields;
}

function compare(name, field, expected, actual, expectedLabel, actualLabel) {
  if (JSON.stringify(expected) !== JSON.stringify(actual)) {
    fail(`${name}: ${field} mismatch. ${expectedLabel}=${JSON.stringify(expected)} ${actualLabel}=${JSON.stringify(actual)}`);
  }
}

function normalizeNewlines(value) {
  return typeof value === 'string' ? value.replace(/\r\n/g, '\n') : value;
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

if (!fs.existsSync(skillsRoot)) {
  fail('skills/ directory is missing');
}

const rootSkillDirs = fs.readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name !== 'skills' && fs.existsSync(path.join(root, entry.name, 'SKILL.md')))
  .map((entry) => entry.name)
  .sort();

for (const name of rootSkillDirs) {
  fail(`Skill directory must live under skills/: ${name}`);
}

const skillDirs = fs.existsSync(skillsRoot)
  ? fs.readdirSync(skillsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(skillsRoot, entry.name, 'SKILL.md')))
  .map((entry) => entry.name)
  .sort()
  : [];

const catalogNames = [...names].sort();
for (const name of catalogNames) {
  if (!skillDirs.includes(name)) fail(`Catalog entry has no matching skill directory: ${name}`);
}
for (const name of skillDirs) {
  if (!names.has(name)) fail(`Skill directory is missing from skills.json: ${name}`);
}

const catalogByName = new Map(skills.map((skill) => [skill.name, skill]));
for (const name of skillDirs) {
  const skillFile = path.join(skillsRoot, name, 'SKILL.md');
  const frontmatter = parseFrontmatter(skillFile);
  const catalogEntry = catalogByName.get(name);

  for (const field of ['name', 'description', 'source', 'license']) {
    if (!frontmatter[field]) fail(`${name}: SKILL.md is missing frontmatter field: ${field}`);
  }

  compare(name, 'name', name, frontmatter.name, 'directory', 'SKILL.md');
  if (catalogEntry) {
    compare(name, 'description', catalogEntry.description, frontmatter.description, 'skills.json', 'SKILL.md');
    compare(name, 'source', catalogEntry.source, frontmatter.source, 'skills.json', 'SKILL.md');
    compare(name, 'license', catalogEntry.license, frontmatter.license, 'skills.json', 'SKILL.md');
  }
}

const agentCatalog = readJson(agentsJsonPath);
const agents = agentCatalog && Array.isArray(agentCatalog.agents) ? agentCatalog.agents : [];

if (!agentCatalog) {
  fail('agents.json is required');
} else {
  if (!Array.isArray(agentCatalog.agents)) {
    fail('agents.json must contain an agents array');
  }
  if (agentCatalog.total !== agents.length) {
    fail(`agents.json total (${agentCatalog.total}) does not match agents.length (${agents.length})`);
  }
}

const agentIds = new Set();
const agentNames = new Set();
const allowedPermissions = new Set(['read-only', 'workspace-write']);
for (const agent of agents) {
  if (!agent.id) fail('An agent catalog entry is missing id');
  if (!agent.name) fail('An agent catalog entry is missing name');
  if (agentIds.has(agent.id)) fail(`Duplicate catalog agent id: ${agent.id}`);
  if (agentNames.has(agent.name)) fail(`Duplicate catalog agent name: ${agent.name}`);
  agentIds.add(agent.id);
  agentNames.add(agent.name);

  for (const field of ['role', 'plugin', 'path', 'description', 'category', 'author', 'source', 'license', 'model', 'permission']) {
    if (!agent[field]) fail(`${agent.id || agent.name || '(unknown)'} is missing agent catalog field: ${field}`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(agent.plugin || '')) {
    fail(`${agent.id || '(unknown)'}: plugin must use lowercase hyphen-case`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(agent.role || '')) {
    fail(`${agent.id || '(unknown)'}: role must use lowercase hyphen-case`);
  }
  if (agent.id !== `${agent.plugin}/${agent.role}`) {
    fail(`${agent.id || '(unknown)'}: id must equal plugin/role`);
  }
  if (agent.name !== `${agent.plugin}-${agent.role}`) {
    fail(`${agent.id || '(unknown)'}: name must equal plugin-role`);
  }
  if (agent.path !== `agents/${agent.plugin}/${agent.role}.md`) {
    fail(`${agent.id || '(unknown)'}: path must equal agents/plugin/role.md`);
  }
  for (const [field, expected] of Object.entries(canonicalAgentMetadata)) {
    if (agent[field] !== expected) {
      fail(`${agent.name || '(unknown)'} ${field} must be ${expected}`);
    }
  }
  if (!allowedPermissions.has(agent.permission)) {
    fail(`${agent.name || '(unknown)'} permission must be read-only or workspace-write`);
  }
  if (!Array.isArray(agent.skills)) fail(`${agent.name || '(unknown)'} skills must be an array`);
  if (!Array.isArray(agent.tags)) fail(`${agent.name || '(unknown)'} tags must be an array`);
  if (!agent.reference || typeof agent.reference !== 'object') {
    fail(`${agent.id || '(unknown)'} reference must be an object`);
  } else {
    for (const field of ['repo', 'path', 'tree']) {
      if (!agent.reference[field]) fail(`${agent.id || '(unknown)'} reference is missing ${field}`);
    }
    if (agent.reference.repo !== 'wshobson/agents') {
      fail(`${agent.id || '(unknown)'} reference.repo must be wshobson/agents`);
    }
    if (agent.reference.path !== `plugins/${agent.plugin}/agents/${agent.role}.md`) {
      fail(`${agent.id || '(unknown)'} reference.path does not match plugin and role`);
    }
  }

  for (const skillName of Array.isArray(agent.skills) ? agent.skills : []) {
    if (!names.has(skillName)) fail(`${agent.name || '(unknown)'} references unknown skill: ${skillName}`);
  }
}

if (!fs.existsSync(agentsRoot)) {
  fail('agents/ directory is missing');
}

const agentEntries = fs.existsSync(agentsRoot)
  ? fs.readdirSync(agentsRoot, { withFileTypes: true })
  : [];

for (const entry of agentEntries) {
  if (!entry.isDirectory()) fail(`Agent definitions must live under agents/<plugin>/: ${entry.name}`);
  if (entry.isDirectory() && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.name)) {
    fail(`Agent plugin directory must use lowercase hyphen-case: ${entry.name}`);
  }
}

const agentFiles = agentEntries.filter((entry) => entry.isDirectory()).flatMap((pluginEntry) => {
  const pluginRoot = path.join(agentsRoot, pluginEntry.name);
  const entries = fs.readdirSync(pluginRoot, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (!entry.isFile() || path.extname(entry.name) !== '.md') {
      fail(`Unexpected entry under agents/${pluginEntry.name}/: ${entry.name}`);
      continue;
    }
    const role = path.basename(entry.name, '.md');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(role)) {
      fail(`Agent role filename must use lowercase hyphen-case: ${pluginEntry.name}/${role}`);
    }
    files.push({
      id: `${pluginEntry.name}/${role}`,
      plugin: pluginEntry.name,
      role,
      path: path.join(pluginRoot, entry.name),
      relativePath: `agents/${pluginEntry.name}/${entry.name}`
    });
  }
  return files;
}).sort((left, right) => left.id.localeCompare(right.id));

const fileIds = new Set(agentFiles.map((agentFile) => agentFile.id));
for (const id of [...agentIds].sort()) {
  if (!fileIds.has(id)) fail(`Agent catalog entry has no matching Markdown file: ${id}`);
}
for (const agentFile of agentFiles) {
  if (!agentIds.has(agentFile.id)) fail(`Agent Markdown file is missing from agents.json: ${agentFile.id}`);
}

const agentCatalogById = new Map(agents.map((agent) => [agent.id, agent]));
for (const agentFile of agentFiles) {
  const text = fs.readFileSync(agentFile.path, 'utf8');
  const frontmatter = parseFrontmatter(agentFile.path);
  const catalogEntry = agentCatalogById.get(agentFile.id);

  for (const field of ['id', 'name', 'role', 'plugin', 'description', 'category', 'author', 'source', 'license', 'model', 'permission', 'reference-repo', 'reference-path', 'reference-tree']) {
    if (!frontmatter[field]) fail(`${agentFile.id}: agent Markdown is missing frontmatter field: ${field}`);
  }
  if (!Array.isArray(frontmatter.skills)) fail(`${agentFile.id}: agent Markdown skills must be a YAML list`);
  if (!Array.isArray(frontmatter.tags)) fail(`${agentFile.id}: agent Markdown tags must be a YAML list`);

  compare(agentFile.id, 'id', agentFile.id, frontmatter.id, 'path', 'agent Markdown');
  compare(agentFile.id, 'plugin', agentFile.plugin, frontmatter.plugin, 'directory', 'agent Markdown');
  compare(agentFile.id, 'role', agentFile.role, frontmatter.role, 'filename', 'agent Markdown');
  compare(agentFile.id, 'name', `${agentFile.plugin}-${agentFile.role}`, frontmatter.name, 'path identity', 'agent Markdown');
  if (catalogEntry) {
    for (const field of ['name', 'role', 'plugin', 'description', 'category', 'author', 'source', 'license', 'model', 'permission', 'skills', 'tags']) {
      compare(agentFile.id, field, catalogEntry[field], frontmatter[field], 'agents.json', 'agent Markdown');
    }
    compare(agentFile.id, 'reference.repo', catalogEntry.reference.repo, frontmatter['reference-repo'], 'agents.json', 'agent Markdown');
    compare(agentFile.id, 'reference.path', catalogEntry.reference.path, frontmatter['reference-path'], 'agents.json', 'agent Markdown');
    compare(agentFile.id, 'reference.tree', catalogEntry.reference.tree, frontmatter['reference-tree'], 'agents.json', 'agent Markdown');
  }

  const requiredHeadings = ['# Role', '# Task', '# Constraints', '# Output'];
  const topLevelHeadings = [...text.matchAll(/^# .+$/gm)].map((match) => match[0]);
  compare(
    agentFile.id,
    'top-level headings',
    requiredHeadings,
    topLevelHeadings,
    'required Agent structure',
    'agent Markdown'
  );

  const canonicalBody = text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').trim();
  const codexPath = path.join(adaptersRoot, 'codex', agentFile.plugin, `${agentFile.role}.toml`);
  const claudePath = path.join(adaptersRoot, 'claude', agentFile.plugin, `${agentFile.role}.md`);
  if (!fs.existsSync(codexPath)) {
    fail(`${agentFile.id}: missing Codex adapter`);
  } else if (catalogEntry) {
    const codex = fs.readFileSync(codexPath, 'utf8');
    const nameMatch = codex.match(/^name = (.+)$/m);
    const descriptionMatch = codex.match(/^description = (.+)$/m);
    const sandboxMatch = codex.match(/^sandbox_mode = (.+)$/m);
    const instructionsMatch = codex.match(/developer_instructions = """\r?\n([\s\S]*?)\r?\n"""\r?\n?$/);
    try {
      compare(agentFile.id, 'Codex name', catalogEntry.name, nameMatch ? JSON.parse(nameMatch[1]) : null, 'agents.json', 'adapter');
      compare(agentFile.id, 'Codex description', catalogEntry.description, descriptionMatch ? JSON.parse(descriptionMatch[1]) : null, 'agents.json', 'adapter');
      compare(agentFile.id, 'Codex sandbox', catalogEntry.permission, sandboxMatch ? JSON.parse(sandboxMatch[1]) : null, 'agents.json', 'adapter');
    } catch (error) {
      fail(`${agentFile.id}: invalid Codex adapter scalar (${error.message})`);
    }
    compare(
      agentFile.id,
      'Codex instructions',
      normalizeNewlines(canonicalBody),
      instructionsMatch ? normalizeNewlines(instructionsMatch[1].trim()) : null,
      'canonical Agent',
      'adapter'
    );
  }

  if (!fs.existsSync(claudePath)) {
    fail(`${agentFile.id}: missing Claude adapter`);
  } else if (catalogEntry) {
    const claudeText = fs.readFileSync(claudePath, 'utf8');
    const claudeFrontmatter = parseFrontmatter(claudePath);
    const claudeBody = claudeText.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').trim();
    compare(agentFile.id, 'Claude name', catalogEntry.name, claudeFrontmatter.name, 'agents.json', 'adapter');
    compare(agentFile.id, 'Claude description', catalogEntry.description, claudeFrontmatter.description, 'agents.json', 'adapter');
    compare(agentFile.id, 'Claude model', 'inherit', claudeFrontmatter.model, 'required adapter value', 'adapter');
    compare(agentFile.id, 'Claude permissionMode', catalogEntry.permission === 'read-only' ? 'plan' : 'default', claudeFrontmatter.permissionMode, 'agents.json mapping', 'adapter');
    compare(agentFile.id, 'Claude skills', catalogEntry.skills, claudeFrontmatter.skills, 'agents.json', 'adapter');
    compare(
      agentFile.id,
      'Claude instructions',
      normalizeNewlines(canonicalBody),
      normalizeNewlines(claudeBody),
      'canonical Agent',
      'adapter'
    );
  }
}

for (const platform of ['codex', 'claude']) {
  const platformRoot = path.join(adaptersRoot, platform);
  if (!fs.existsSync(platformRoot)) {
    fail(`adapters/${platform}/ directory is missing`);
    continue;
  }
  const extension = platform === 'codex' ? '.toml' : '.md';
  const adapterFiles = fs.readdirSync(platformRoot, { withFileTypes: true }).flatMap((pluginEntry) => {
    if (!pluginEntry.isDirectory()) {
      fail(`Unexpected entry under adapters/${platform}/: ${pluginEntry.name}`);
      return [];
    }
    return fs.readdirSync(path.join(platformRoot, pluginEntry.name), { withFileTypes: true }).map((entry) => {
      if (!entry.isFile() || path.extname(entry.name) !== extension) {
        fail(`Unexpected entry under adapters/${platform}/${pluginEntry.name}/: ${entry.name}`);
        return null;
      }
      return `${pluginEntry.name}/${path.basename(entry.name, extension)}`;
    }).filter(Boolean);
  });
  compare(`adapters/${platform}`, 'count', agents.length, adapterFiles.length, 'agents.json', 'filesystem');
  for (const id of adapterFiles) {
    if (!agentIds.has(id)) fail(`adapters/${platform}/${id}: no matching canonical Agent`);
  }
}

const agentReference = readJson(agentReferencePath);
if (agentReference) {
  const definitions = Array.isArray(agentReference.definitions) ? agentReference.definitions : [];
  const totals = agentReference.totals || {};
  const rewrittenDefinitions = definitions.filter((definition) => definition.status === 'rewritten');
  const pendingDefinitions = definitions.filter((definition) => definition.status === 'pending');
  const uniqueRoleNames = new Set(definitions.map((definition) => definition.sourceName));
  const roleCounts = new Map();
  for (const definition of definitions) {
    roleCounts.set(definition.sourceName, (roleCounts.get(definition.sourceName) || 0) + 1);
  }

  if (!Array.isArray(agentReference.definitions)) fail('Agent reference inventory must contain a definitions array');
  compare('agent reference', 'definitions', definitions.length, totals.definitions, 'computed', 'inventory totals');
  compare('agent reference', 'uniqueRoleNames', uniqueRoleNames.size, totals.uniqueRoleNames, 'computed', 'inventory totals');
  compare(
    'agent reference',
    'repeatedRoleNames',
    [...roleCounts.values()].filter((count) => count > 1).length,
    totals.repeatedRoleNames,
    'computed',
    'inventory totals'
  );
  compare('agent reference', 'repeatedDefinitions', definitions.length - uniqueRoleNames.size, totals.repeatedDefinitions, 'computed', 'inventory totals');
  compare('agent reference', 'uniqueSourceBlobs', new Set(definitions.map((definition) => definition.sourceBlobSha)).size, totals.uniqueSourceBlobs, 'computed', 'inventory totals');
  compare('agent reference', 'rewritten', rewrittenDefinitions.length, totals.rewritten, 'computed', 'inventory totals');
  compare('agent reference', 'remaining', pendingDefinitions.length, totals.remaining, 'computed', 'inventory totals');

  const referenceIds = new Set();
  const referencePaths = new Set();
  const targetPaths = new Set();
  for (const definition of definitions) {
    for (const field of ['id', 'plugin', 'sourceName', 'runtimeName', 'status', 'sourcePath', 'sourceBlobSha', 'targetPath']) {
      if (!definition[field]) fail(`Agent reference definition is missing ${field}`);
    }
    if (!['pending', 'rewritten'].includes(definition.status)) {
      fail(`${definition.id || '(unknown)'}: invalid agent reference status: ${definition.status}`);
    }
    if (referenceIds.has(definition.id)) fail(`Duplicate agent reference id: ${definition.id}`);
    if (referencePaths.has(definition.sourcePath)) fail(`Duplicate upstream source path: ${definition.sourcePath}`);
    if (targetPaths.has(definition.targetPath)) fail(`Duplicate Agent target path: ${definition.targetPath}`);
    referenceIds.add(definition.id);
    referencePaths.add(definition.sourcePath);
    targetPaths.add(definition.targetPath);

    const catalogEntry = agentCatalogById.get(definition.id);
    if (definition.status === 'rewritten' && !catalogEntry) {
      fail(`${definition.id}: marked rewritten but target Agent is missing`);
    }
    if (definition.status === 'pending' && catalogEntry) {
      fail(`${definition.id}: target Agent exists but reference status is still pending`);
    }
    if (catalogEntry) {
      compare(definition.id, 'runtimeName', definition.runtimeName, catalogEntry.name, 'inventory', 'agents.json');
      compare(definition.id, 'targetPath', definition.targetPath, catalogEntry.path, 'inventory', 'agents.json');
      compare(definition.id, 'sourcePath', definition.sourcePath, catalogEntry.reference.path, 'inventory', 'agents.json');
      compare(definition.id, 'sourceTree', agentReference.sourceTreeSha, catalogEntry.reference.tree, 'inventory', 'agents.json');
    }
  }

  for (const id of agentIds) {
    if (!referenceIds.has(id)) fail(`${id}: Agent is missing from the upstream rewrite ledger`);
  }
}

if (fs.existsSync(readmePath)) {
  const readme = fs.readFileSync(readmePath, 'utf8');
  const countMatch = readme.match(/目前共收錄 \*\*(\d+)\*\* 個 skills/);
  if (countMatch && Number(countMatch[1]) !== skills.length) {
    fail(`README skill count (${countMatch[1]}) does not match skills.length (${skills.length})`);
  }
  const agentCountMatch = readme.match(/目前共收錄 \*\*(\d+)\*\* 個 agents/i);
  if (agentCountMatch && Number(agentCountMatch[1]) !== agents.length) {
    fail(`README agent count (${agentCountMatch[1]}) does not match agents.length (${agents.length})`);
  }
}

if (errors.length > 0) {
  console.error('Catalog validation failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

const agentLabel = agents.length === 1 ? 'agent' : 'agents';
console.log(`Catalog validation passed: ${skills.length} skills, ${agents.length} ${agentLabel}`);
