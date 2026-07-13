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
const canonicalSkillSource = 'HsinPu/Autoverse-Ai-Agent-Skills';
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
  if (!match) {
    fail(`${path.relative(root, filePath)} is missing YAML frontmatter`);
    return {};
  }
  const fields = {};
  let currentListField = null;
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (field) {
      fields[field[1]] = field[2].trim() === '' ? [] : parseScalar(field[2]);
      currentListField = field[2].trim() === '' ? field[1] : null;
      continue;
    }
    const listItem = line.match(/^\s+-\s+(.+)$/);
    if (listItem && currentListField && Array.isArray(fields[currentListField])) {
      fields[currentListField].push(parseScalar(listItem[1]));
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

const skillCatalog = readJson(skillsJsonPath);
const skills = skillCatalog && Array.isArray(skillCatalog.skills) ? skillCatalog.skills : [];
if (!skillCatalog || !Array.isArray(skillCatalog.skills)) fail('skills.json must contain a skills array');
if (skillCatalog && skillCatalog.total !== skills.length) {
  fail(`skills.json total (${skillCatalog.total}) does not match skills.length (${skills.length})`);
}

const skillNames = new Set();
for (const skill of skills) {
  if (!skill.name) fail('A catalog entry is missing name');
  if (skillNames.has(skill.name)) fail(`Duplicate catalog skill name: ${skill.name}`);
  skillNames.add(skill.name);
  for (const field of ['description', 'category', 'author', 'source', 'license']) {
    if (!skill[field]) fail(`${skill.name || '(unknown)'} is missing catalog field: ${field}`);
  }
  if (skill.source !== canonicalSkillSource) {
    fail(`${skill.name || '(unknown)'} source must be ${canonicalSkillSource}`);
  }
  if (skill.reference) {
    if (!skill.reference.source) fail(`${skill.name || '(unknown)'} reference.source is required`);
    if (!skill.reference.license) fail(`${skill.name || '(unknown)'} reference.license is required`);
  }
  if (!Array.isArray(skill.tags)) fail(`${skill.name || '(unknown)'} tags must be an array`);
}

if (!fs.existsSync(skillsRoot)) fail('skills/ directory is missing');
const rootSkillDirs = fs.readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name !== 'skills' && fs.existsSync(path.join(root, entry.name, 'SKILL.md')))
  .map((entry) => entry.name);
for (const name of rootSkillDirs) fail(`Skill directory must live under skills/: ${name}`);

const skillDirs = fs.existsSync(skillsRoot)
  ? fs.readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(skillsRoot, entry.name, 'SKILL.md')))
    .map((entry) => entry.name)
    .sort()
  : [];
for (const name of [...skillNames].sort()) {
  if (!skillDirs.includes(name)) fail(`Catalog entry has no matching skill directory: ${name}`);
}
for (const name of skillDirs) {
  if (!skillNames.has(name)) fail(`Skill directory is missing from skills.json: ${name}`);
}

const skillsByName = new Map(skills.map((skill) => [skill.name, skill]));
for (const name of skillDirs) {
  const skillFile = path.join(skillsRoot, name, 'SKILL.md');
  const frontmatter = parseFrontmatter(skillFile);
  const catalogEntry = skillsByName.get(name);
  for (const field of ['name', 'description', 'source', 'license']) {
    if (!frontmatter[field]) fail(`${name}: SKILL.md is missing frontmatter field: ${field}`);
  }
  compare(name, 'name', name, frontmatter.name, 'directory', 'SKILL.md');
  if (catalogEntry) {
    for (const field of ['description', 'source', 'license']) {
      compare(name, field, catalogEntry[field], frontmatter[field], 'skills.json', 'SKILL.md');
    }
    if (catalogEntry.reference) {
      compare(name, 'reference.source', catalogEntry.reference.source, frontmatter['reference-source'], 'skills.json', 'SKILL.md');
      compare(name, 'reference.license', catalogEntry.reference.license, frontmatter['reference-license'], 'skills.json', 'SKILL.md');
    }
  }
}

const agentCatalog = readJson(agentsJsonPath);
const agents = agentCatalog && Array.isArray(agentCatalog.agents) ? agentCatalog.agents : [];
if (!agentCatalog || !Array.isArray(agentCatalog.agents)) fail('agents.json must contain an agents array');
if (agentCatalog && agentCatalog.version !== '3.0.0') fail('agents.json version must be 3.0.0');
if (agentCatalog && agentCatalog.total !== agents.length) {
  fail(`agents.json total (${agentCatalog.total}) does not match agents.length (${agents.length})`);
}
if (agentCatalog && agentCatalog.uniqueRoles !== agents.length) {
  fail(`agents.json uniqueRoles (${agentCatalog.uniqueRoles}) must equal total (${agents.length})`);
}

const allowedPermissions = new Set(['read-only', 'workspace-write']);
const agentIds = new Set();
const referencePaths = new Set();
for (const agent of agents) {
  const label = agent.id || agent.name || '(unknown)';
  for (const field of ['id', 'name', 'role', 'path', 'description', 'category', 'author', 'source', 'license', 'model', 'permission']) {
    if (!agent[field]) fail(`${label} is missing agent catalog field: ${field}`);
  }
  if (agentIds.has(agent.id)) fail(`Duplicate catalog Agent: ${agent.id}`);
  agentIds.add(agent.id);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(agent.role || '')) fail(`${label}: invalid role name`);
  if (agent.id !== agent.role || agent.name !== agent.role) fail(`${label}: id and name must equal role`);
  if (agent.path !== `agents/${agent.role}.md`) fail(`${label}: path must equal agents/role.md`);
  for (const [field, expected] of Object.entries(canonicalAgentMetadata)) {
    if (agent[field] !== expected) fail(`${label} ${field} must be ${expected}`);
  }
  if (!allowedPermissions.has(agent.permission)) fail(`${label}: invalid permission ${agent.permission}`);
  if (!Array.isArray(agent.skills)) fail(`${label}: skills must be an array`);
  if (!Array.isArray(agent.tags)) fail(`${label}: tags must be an array`);
  for (const skillName of Array.isArray(agent.skills) ? agent.skills : []) {
    if (!skillNames.has(skillName)) fail(`${label} references unknown skill: ${skillName}`);
  }

  if (!agent.references || typeof agent.references !== 'object') {
    fail(`${label}: references must be an object`);
  } else {
    if (agent.references.repo !== 'wshobson/agents') fail(`${label}: references.repo must be wshobson/agents`);
    if (!agent.references.tree) fail(`${label}: references.tree is required`);
    if (!Array.isArray(agent.references.paths) || agent.references.paths.length === 0) {
      fail(`${label}: references.paths must be a non-empty array`);
    } else {
      for (const referencePath of agent.references.paths) {
        if (!new RegExp(`^plugins/[^/]+/agents/${agent.role}\\.md$`).test(referencePath)) {
          fail(`${label}: invalid reference path ${referencePath}`);
        }
        if (referencePaths.has(referencePath)) fail(`Duplicate upstream reference path: ${referencePath}`);
        referencePaths.add(referencePath);
      }
    }
  }
}

if (!fs.existsSync(agentsRoot)) fail('agents/ directory is missing');
const agentEntries = fs.existsSync(agentsRoot) ? fs.readdirSync(agentsRoot, { withFileTypes: true }) : [];
const agentFiles = [];
for (const entry of agentEntries) {
  if (!entry.isFile() || path.extname(entry.name) !== '.md') {
    fail(`Agent definitions must be direct Markdown files under agents/: ${entry.name}`);
    continue;
  }
  const role = path.basename(entry.name, '.md');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(role)) fail(`Invalid Agent filename: ${entry.name}`);
  agentFiles.push({ role, path: path.join(agentsRoot, entry.name), relativePath: `agents/${entry.name}` });
}
agentFiles.sort((left, right) => left.role.localeCompare(right.role));
compare('agents/', 'count', agents.length, agentFiles.length, 'agents.json', 'filesystem');

const agentsById = new Map(agents.map((agent) => [agent.id, agent]));
for (const agent of agents) {
  if (!agentFiles.some((file) => file.role === agent.id)) fail(`${agent.id}: catalog entry has no matching Markdown file`);
}

for (const agentFile of agentFiles) {
  const text = fs.readFileSync(agentFile.path, 'utf8');
  const frontmatter = parseFrontmatter(agentFile.path);
  const catalogEntry = agentsById.get(agentFile.role);
  if (!catalogEntry) fail(`${agentFile.role}: Markdown file is missing from agents.json`);
  for (const field of ['id', 'name', 'role', 'description', 'category', 'author', 'source', 'license', 'model', 'permission', 'reference-repo', 'reference-tree']) {
    if (!frontmatter[field]) fail(`${agentFile.role}: Agent Markdown is missing frontmatter field: ${field}`);
  }
  for (const field of ['skills', 'tags', 'reference-paths']) {
    if (!Array.isArray(frontmatter[field]) || frontmatter[field].length === 0) {
      fail(`${agentFile.role}: ${field} must be a non-empty YAML list`);
    }
  }
  compare(agentFile.role, 'id', agentFile.role, frontmatter.id, 'filename', 'Agent Markdown');
  compare(agentFile.role, 'name', agentFile.role, frontmatter.name, 'filename', 'Agent Markdown');
  compare(agentFile.role, 'role', agentFile.role, frontmatter.role, 'filename', 'Agent Markdown');
  if (catalogEntry) {
    for (const field of ['name', 'role', 'description', 'category', 'author', 'source', 'license', 'model', 'permission', 'skills', 'tags']) {
      compare(agentFile.role, field, catalogEntry[field], frontmatter[field], 'agents.json', 'Agent Markdown');
    }
    compare(agentFile.role, 'references.repo', catalogEntry.references.repo, frontmatter['reference-repo'], 'agents.json', 'Agent Markdown');
    compare(agentFile.role, 'references.paths', catalogEntry.references.paths, frontmatter['reference-paths'], 'agents.json', 'Agent Markdown');
    compare(agentFile.role, 'references.tree', catalogEntry.references.tree, frontmatter['reference-tree'], 'agents.json', 'Agent Markdown');
  }

  const requiredHeadings = ['# Role', '# Task', '# Constraints', '# Output'];
  const topLevelHeadings = [...text.matchAll(/^# .+$/gm)].map((match) => match[0]);
  compare(agentFile.role, 'top-level headings', requiredHeadings, topLevelHeadings, 'required Agent structure', 'Agent Markdown');
  const canonicalBody = text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').trim();

  const codexPath = path.join(adaptersRoot, 'codex', `${agentFile.role}.toml`);
  if (!fs.existsSync(codexPath)) {
    fail(`${agentFile.role}: missing Codex adapter`);
  } else if (catalogEntry) {
    const codex = fs.readFileSync(codexPath, 'utf8');
    const nameMatch = codex.match(/^name = (.+)$/m);
    const descriptionMatch = codex.match(/^description = (.+)$/m);
    const sandboxMatch = codex.match(/^sandbox_mode = (.+)$/m);
    const instructionsMatch = codex.match(/developer_instructions = """\r?\n([\s\S]*?)\r?\n"""\r?\n?$/);
    try {
      compare(agentFile.role, 'Codex name', catalogEntry.name, nameMatch ? JSON.parse(nameMatch[1]) : null, 'agents.json', 'adapter');
      compare(agentFile.role, 'Codex description', catalogEntry.description, descriptionMatch ? JSON.parse(descriptionMatch[1]) : null, 'agents.json', 'adapter');
      compare(agentFile.role, 'Codex sandbox', catalogEntry.permission, sandboxMatch ? JSON.parse(sandboxMatch[1]) : null, 'agents.json', 'adapter');
    } catch (error) {
      fail(`${agentFile.role}: invalid Codex adapter scalar (${error.message})`);
    }
    compare(agentFile.role, 'Codex instructions', normalizeNewlines(canonicalBody), instructionsMatch ? normalizeNewlines(instructionsMatch[1].trim()) : null, 'canonical Agent', 'adapter');
  }

  const claudePath = path.join(adaptersRoot, 'claude', `${agentFile.role}.md`);
  if (!fs.existsSync(claudePath)) {
    fail(`${agentFile.role}: missing Claude adapter`);
  } else if (catalogEntry) {
    const claudeText = fs.readFileSync(claudePath, 'utf8');
    const claudeFrontmatter = parseFrontmatter(claudePath);
    const claudeBody = claudeText.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').trim();
    compare(agentFile.role, 'Claude name', catalogEntry.name, claudeFrontmatter.name, 'agents.json', 'adapter');
    compare(agentFile.role, 'Claude description', catalogEntry.description, claudeFrontmatter.description, 'agents.json', 'adapter');
    compare(agentFile.role, 'Claude model', 'inherit', claudeFrontmatter.model, 'required adapter value', 'adapter');
    compare(agentFile.role, 'Claude permissionMode', catalogEntry.permission === 'read-only' ? 'plan' : 'default', claudeFrontmatter.permissionMode, 'agents.json mapping', 'adapter');
    compare(agentFile.role, 'Claude skills', catalogEntry.skills, claudeFrontmatter.skills, 'agents.json', 'adapter');
    compare(agentFile.role, 'Claude instructions', normalizeNewlines(canonicalBody), normalizeNewlines(claudeBody), 'canonical Agent', 'adapter');
  }
}

for (const platform of ['codex', 'claude']) {
  const platformRoot = path.join(adaptersRoot, platform);
  if (!fs.existsSync(platformRoot)) {
    fail(`adapters/${platform}/ directory is missing`);
    continue;
  }
  const extension = platform === 'codex' ? '.toml' : '.md';
  const files = fs.readdirSync(platformRoot, { withFileTypes: true });
  const adapterRoles = [];
  for (const entry of files) {
    if (!entry.isFile() || path.extname(entry.name) !== extension) {
      fail(`Adapters must be direct ${extension} files under adapters/${platform}/: ${entry.name}`);
      continue;
    }
    adapterRoles.push(path.basename(entry.name, extension));
  }
  compare(`adapters/${platform}`, 'count', agents.length, adapterRoles.length, 'agents.json', 'filesystem');
  for (const role of adapterRoles) {
    if (!agentIds.has(role)) fail(`adapters/${platform}/${role}: no matching canonical Agent`);
  }
}

const inventory = readJson(agentReferencePath);
if (inventory) {
  const definitions = Array.isArray(inventory.definitions) ? inventory.definitions : [];
  const totals = inventory.totals || {};
  const consolidated = definitions.filter((definition) => definition.status === 'consolidated');
  const pending = definitions.filter((definition) => definition.status === 'pending');
  const uniqueRoleNames = new Set(definitions.map((definition) => definition.sourceName));
  const roleCounts = new Map();
  for (const definition of definitions) roleCounts.set(definition.sourceName, (roleCounts.get(definition.sourceName) || 0) + 1);
  compare('Agent reference', 'definitions', definitions.length, totals.definitions, 'computed', 'inventory totals');
  compare('Agent reference', 'uniqueRoleNames', uniqueRoleNames.size, totals.uniqueRoleNames, 'computed', 'inventory totals');
  compare('Agent reference', 'repeatedRoleNames', [...roleCounts.values()].filter((count) => count > 1).length, totals.repeatedRoleNames, 'computed', 'inventory totals');
  compare('Agent reference', 'repeatedDefinitions', definitions.length - uniqueRoleNames.size, totals.repeatedDefinitions, 'computed', 'inventory totals');
  compare('Agent reference', 'uniqueSourceBlobs', new Set(definitions.map((definition) => definition.sourceBlobSha)).size, totals.uniqueSourceBlobs, 'computed', 'inventory totals');
  compare('Agent reference', 'consolidated', consolidated.length, totals.consolidated, 'computed', 'inventory totals');
  compare('Agent reference', 'remaining', pending.length, totals.remaining, 'computed', 'inventory totals');

  const definitionIds = new Set();
  const sourcePaths = new Set();
  const agentsByReferencePath = new Map(agents.flatMap((agent) => agent.references.paths.map((referencePath) => [referencePath, agent])));
  for (const definition of definitions) {
    for (const field of ['id', 'plugin', 'sourceName', 'runtimeName', 'status', 'sourcePath', 'sourceBlobSha', 'targetPath']) {
      if (!definition[field]) fail(`Agent reference definition is missing ${field}`);
    }
    if (!['pending', 'consolidated'].includes(definition.status)) fail(`${definition.id}: invalid status ${definition.status}`);
    if (definitionIds.has(definition.id)) fail(`Duplicate Agent reference id: ${definition.id}`);
    if (sourcePaths.has(definition.sourcePath)) fail(`Duplicate upstream source path: ${definition.sourcePath}`);
    definitionIds.add(definition.id);
    sourcePaths.add(definition.sourcePath);
    const catalogEntry = agentsByReferencePath.get(definition.sourcePath);
    if (definition.status === 'consolidated' && !catalogEntry) fail(`${definition.id}: consolidated reference has no canonical Agent`);
    if (definition.status === 'pending' && catalogEntry) fail(`${definition.id}: canonical Agent exists but reference is pending`);
    if (catalogEntry) {
      compare(definition.id, 'runtimeName', definition.runtimeName, catalogEntry.name, 'inventory', 'agents.json');
      compare(definition.id, 'targetPath', definition.targetPath, catalogEntry.path, 'inventory', 'agents.json');
      compare(definition.id, 'sourceName', definition.sourceName, catalogEntry.role, 'inventory', 'agents.json');
      compare(definition.id, 'sourceTree', inventory.sourceTreeSha, catalogEntry.references.tree, 'inventory', 'agents.json');
    }
  }
  for (const referencePath of referencePaths) {
    if (!sourcePaths.has(referencePath)) fail(`${referencePath}: canonical Agent reference is missing from inventory`);
  }
}

if (fs.existsSync(readmePath)) {
  const readme = fs.readFileSync(readmePath, 'utf8');
  const skillCountMatch = readme.match(/\*\*(\d+) Skills\*\*/i);
  if (skillCountMatch && Number(skillCountMatch[1]) !== skills.length) {
    fail(`README skill count (${skillCountMatch[1]}) does not match skills.length (${skills.length})`);
  }
  const agentCountMatch = readme.match(/目前共收錄 \*\*(\d+)\*\* 個不重複 Agents/i);
  if (agentCountMatch && Number(agentCountMatch[1]) !== agents.length) {
    fail(`README Agent count (${agentCountMatch[1]}) does not match agents.length (${agents.length})`);
  }
}

if (errors.length > 0) {
  console.error('Catalog validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Catalog validation passed: ${skills.length} skills, ${agents.length} agents`);
