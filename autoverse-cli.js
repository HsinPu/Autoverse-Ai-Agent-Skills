#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const SKILLS_JSON = path.join(__dirname, 'skills.json');
const AGENTS_JSON = path.join(__dirname, 'agents.json');
const REPOSITORY_ID = 'HsinPu/Autoverse-Ai-Agent-Skills';
const homeDir = os.homedir();
const codexHome = process.env.CODEX_HOME || path.join(homeDir, '.codex');
const projectRoot = process.cwd();
const openCodeHome = process.env.OPENCODE_CONFIG_DIR ||
  (process.env.XDG_CONFIG_HOME
    ? path.join(process.env.XDG_CONFIG_HOME, 'opencode')
    : path.join(homeDir, '.config', 'opencode'));
const SUPPORTED_TARGETS = ['codex', 'claude', 'cursor', 'vscode', 'copilot', 'opencode', 'project'];
const ALL_TARGETS = ['codex', 'claude', 'cursor', 'copilot', 'opencode', 'project'];

function resolveCodexSkillProfiles() {
  const profiles = [
    { label: 'codex/CODEX_HOME', dir: path.join(codexHome, 'skills'), target: 'codex' },
    { label: 'codex/standard', dir: path.join(homeDir, '.agents', 'skills'), target: 'codex' },
    { label: 'codex/legacy', dir: path.join(homeDir, '.codex', 'skills'), target: 'codex' },
  ];
  const seen = new Set();
  return profiles.filter((profile) => {
    const identity = path.resolve(profile.dir).toLowerCase();
    if (seen.has(identity)) return false;
    seen.add(identity);
    return true;
  });
}

const SKILL_PROFILE_PATHS = {
  codex: resolveCodexSkillProfiles(),
  claude: [{ label: 'claude', dir: path.join(homeDir, '.claude', 'skills'), target: 'claude' }],
  cursor: [{ label: 'cursor', dir: path.join(homeDir, '.cursor', 'skills'), target: 'cursor' }],
  copilot: [{ label: 'copilot', dir: path.join(homeDir, '.copilot', 'skills'), target: 'copilot' }],
  opencode: [{ label: 'opencode', dir: path.join(openCodeHome, 'skills'), target: 'opencode' }],
  project: [
    {
      label: 'project/shared (codex/cursor/copilot/opencode)',
      dir: path.join(projectRoot, '.agents', 'skills'),
      target: 'project',
    },
    { label: 'project/claude', dir: path.join(projectRoot, '.claude', 'skills'), target: 'project' },
  ],
};

const AGENT_PROFILE_PATHS = {
  codex: [{ label: 'codex', dir: path.join(codexHome, 'agents'), extension: '.toml', adapter: 'codex', target: 'codex' }],
  claude: [{ label: 'claude', dir: path.join(homeDir, '.claude', 'agents'), extension: '.md', adapter: 'claude', target: 'claude' }],
  cursor: [{ label: 'cursor', dir: path.join(homeDir, '.cursor', 'agents'), extension: '.md', adapter: 'cursor', target: 'cursor' }],
  copilot: [{ label: 'copilot', dir: path.join(homeDir, '.copilot', 'agents'), extension: '.agent.md', adapter: 'copilot', target: 'copilot' }],
  opencode: [{ label: 'opencode', dir: path.join(openCodeHome, 'agents'), extension: '.md', adapter: 'opencode', target: 'opencode' }],
  project: [
    { label: 'project/codex', dir: path.join(projectRoot, '.codex', 'agents'), extension: '.toml', adapter: 'codex', target: 'project' },
    { label: 'project/claude', dir: path.join(projectRoot, '.claude', 'agents'), extension: '.md', adapter: 'claude', target: 'project' },
    { label: 'project/cursor', dir: path.join(projectRoot, '.cursor', 'agents'), extension: '.md', adapter: 'cursor', target: 'project' },
    { label: 'project/copilot', dir: path.join(projectRoot, '.github', 'agents'), extension: '.agent.md', adapter: 'copilot', target: 'project' },
    { label: 'project/opencode', dir: path.join(projectRoot, '.opencode', 'agents'), extension: '.md', adapter: 'opencode', target: 'project' },
  ],
};

function canonicalizeTarget(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (!SUPPORTED_TARGETS.includes(normalized)) return null;
  return normalized === 'vscode' ? 'copilot' : normalized;
}

function reportUnknownTarget(value) {
  console.error(`不支援的 target: ${value || '(空白)'}`);
  console.error(`可用 targets: ${SUPPORTED_TARGETS.join(', ')}`);
  process.exitCode = 1;
}

function loadSkillsJson() {
  try {
    if (fs.existsSync(SKILLS_JSON)) {
      return JSON.parse(fs.readFileSync(SKILLS_JSON, 'utf8'));
    }
  } catch (e) {
    console.log(`警告: 無法讀取 skills.json: ${e.message}`);
  }
  return { skills: [] };
}

function loadAgentsJson() {
  try {
    if (fs.existsSync(AGENTS_JSON)) return JSON.parse(fs.readFileSync(AGENTS_JSON, 'utf8'));
  } catch (e) {
    console.log(`警告: 無法讀取 agents.json: ${e.message}`);
  }
  return { agents: [] };
}

function listAgents(category = null) {
  let agents = loadAgentsJson().agents || [];
  if (category) agents = agents.filter(agent => agent.category === category);
  if (agents.length === 0) {
    console.log('沒有找到任何 Agent');
    return;
  }
  console.log(`可用 Agent (${agents.length} 個):\n`);
  const byCategory = {};
  for (const agent of agents) (byCategory[agent.category] ||= []).push(agent);
  for (const categoryName of Object.keys(byCategory).sort()) {
    console.log(`[${categoryName}]`);
    for (const agent of byCategory[categoryName]) {
      console.log(`  ${agent.id}`);
      console.log(`    ${agent.description.slice(0, 80)}${agent.description.length > 80 ? '...' : ''}`);
    }
    console.log('');
  }
}

function rankMatches(items, query, fieldsFor) {
  const q = query.trim().toLowerCase();
  const terms = tokenizeSearchText(q);
  return items.map((item, index) => {
    const fields = fieldsFor(item).map(value => String(value).toLowerCase());
    const exact = fields.slice(0, 2);
    const haystack = fields.join(' ');
    const tokens = new Set(tokenizeSearchText(haystack));
    let score = 0;
    if (exact.includes(q)) score = 100;
    else if (exact.some(value => value.includes(q))) score = 90;
    else if (fields.some(value => value.includes(q))) score = 70;
    else if (terms.length > 0 && terms.every(term => tokens.has(term))) score = 30;
    return { item, score, index };
  }).filter(result => result.score > 0)
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map(result => result.item);
}

function searchAgents(query) {
  const matches = rankMatches(loadAgentsJson().agents || [], query, agent => [
    agent.id, agent.name, agent.role, agent.category, agent.description, ...(agent.tags || [])
  ]);
  if (matches.length === 0) {
    console.log(`沒有找到符合 "${query}" 的 Agent`);
    return;
  }
  console.log(`Agent 搜尋結果 (${matches.length} 個):\n`);
  for (const agent of matches) {
    console.log(`  ${agent.id} (${agent.permission})`);
    console.log(`    ${agent.description.slice(0, 90)}${agent.description.length > 90 ? '...' : ''}\n`);
  }
}

function listSkills(category = null) {
  const data = loadSkillsJson();
  let skills = data.skills || [];
  
  if (category) {
    skills = skills.filter(s => s.category === category);
  }
  
  if (skills.length === 0) {
    console.log('沒有找到任何技能');
    return;
  }

  console.log(`可用技能 (${skills.length} 個):\n`);
  
  const byCategory = {};
  skills.forEach(s => {
    const cat = s.category || 'other';
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(s);
  });
  
  Object.keys(byCategory).sort().forEach(cat => {
    console.log(`[${cat.toUpperCase()}]`);
    byCategory[cat].forEach(skill => {
      console.log(`  ${skill.name}`);
      console.log(`    ${skill.description.slice(0, 60)}${skill.description.length > 60 ? '...' : ''}`);
    });
    console.log('');
  });
}

function searchSkills(query) {
  const data = loadSkillsJson();
  const q = query.trim().toLowerCase();
  const terms = tokenizeSearchText(q);
  
  const matches = data.skills.map((skill, index) => {
    const name = skill.name.toLowerCase();
    const description = skill.description.toLowerCase();
    const tags = (skill.tags || []).map(tag => tag.toLowerCase());
    const haystack = [name, description, ...tags].join(' ');
    const nameTokens = new Set(tokenizeSearchText(name));
    const tagTokens = new Set(tokenizeSearchText(tags.join(' ')));
    const normalizedTokens = new Set(tokenizeSearchText(haystack));
    const nameAndTagTokens = new Set(tokenizeSearchText([name, ...tags].join(' ')));

    let score = 0;
    if (name === q || tags.includes(q)) score = 100;
    else if (name.includes(q)) score = 90;
    else if (tags.some(tag => tag.includes(q))) score = 80;
    else if (description.includes(q)) score = 70;
    else if (terms.length > 0 && terms.every(term => nameTokens.has(term))) score = 75;
    else if (terms.length > 0 && terms.every(term => nameAndTagTokens.has(term))) score = 60;
    else if (terms.length > 0 && terms.every(term => tagTokens.has(term))) score = 50;
    else if (terms.length > 0 && terms.every(term => normalizedTokens.has(term))) score = 30;

    return { skill, score, index };
  }).filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(result => result.skill);
  
  if (matches.length === 0) {
    console.log(`沒有找到符合 "${query}" 的技能`);
    return;
  }
  
  console.log(`搜尋結果 (${matches.length} 個):\n`);
  matches.forEach(skill => {
    const tags = skill.tags ? ` [${skill.tags.slice(0, 3).join(', ')}]` : '';
    console.log(`  ${skill.name}${tags}`);
    console.log(`    ${skill.description.slice(0, 70)}${skill.description.length > 70 ? '...' : ''}`);
    console.log('');
  });
}

function tokenizeSearchText(value) {
  return value
    .replace(/[^a-z0-9+#\u3400-\u9fff]+/gi, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function readJsonFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
  } catch {
    return null;
  }
}

function findInstalledSkills(profile) {
  if (!fs.existsSync(profile.dir)) return [];
  try {
    return fs.readdirSync(profile.dir).filter((name) => {
      const skillPath = path.join(profile.dir, name);
      const metadataPath = path.join(skillPath, '.skill-meta.json');
      try {
        if (!fs.statSync(skillPath).isDirectory() || !fs.existsSync(path.join(skillPath, 'SKILL.md'))) return false;
      } catch {
        return false;
      }
      const metadata = readJsonFile(metadataPath);
      return metadata?.repo === REPOSITORY_ID && metadata.component === 'skill' &&
        metadata.target === profile.target && metadata.name === name;
    }).sort();
  } catch {
    return [];
  }
}

function listInstalled(targetName) {
  const canonicalTarget = canonicalizeTarget(targetName);
  if (!canonicalTarget) {
    reportUnknownTarget(targetName);
    return;
  }
  const profiles = SKILL_PROFILE_PATHS[canonicalTarget];
  if (canonicalTarget === 'codex') {
    const installed = [...new Set(profiles.flatMap(findInstalledSkills))].sort();
    const label = targetName.toLowerCase();
    if (installed.length === 0) console.log(`${label}: 尚未安裝任何技能`);
    else {
      console.log(`${label} 已安裝 (${installed.length} 個):`);
      installed.forEach(name => console.log(`  ${name}`));
    }
    return;
  }
  for (const profile of profiles) {
    const label = canonicalTarget === 'project' ? profile.label : targetName.toLowerCase();
    const installed = findInstalledSkills(profile);
    if (installed.length === 0) console.log(`${label}: 尚未安裝任何技能`);
    else {
      console.log(`${label} 已安裝 (${installed.length} 個):`);
      installed.forEach(name => console.log(`  ${name}`));
    }
  }
}

function findInstalledAgents(profile) {
  if (!fs.existsSync(profile.dir)) return [];
  try {
    return fs.readdirSync(profile.dir)
      .filter((name) => {
        if (!name.endsWith(profile.extension)) return false;
        const role = path.basename(name, profile.extension);
        const metadata = readJsonFile(path.join(profile.dir, `${name}.autoverse.json`));
        return metadata?.repo === REPOSITORY_ID && metadata.component === 'agent' &&
          metadata.target === profile.target && metadata.adapter === profile.adapter &&
          metadata.id === role && metadata.name === role;
      })
      .map(name => path.basename(name, profile.extension))
      .sort();
  } catch {
    return [];
  }
}

function listInstalledAgents(targetName) {
  const canonicalTarget = canonicalizeTarget(targetName);
  if (!canonicalTarget) {
    reportUnknownTarget(targetName);
    return;
  }
  const profiles = AGENT_PROFILE_PATHS[canonicalTarget];
  for (const profile of profiles) {
    const label = canonicalTarget === 'project' ? profile.label : targetName.toLowerCase();
    const installed = findInstalledAgents(profile);
    if (installed.length === 0) console.log(`${label}: 尚未安裝任何 Agent`);
    else {
      console.log(`${label} 已安裝 Agent (${installed.length} 個):`);
      installed.forEach(name => console.log(`  ${name}`));
    }
  }
}

function showInfo(skillName) {
  const data = loadSkillsJson();
  const skill = data.skills.find(s => s.name === skillName);
  
  if (!skill) {
    console.log(`找不到技能 "${skillName}"`);
    return;
  }
  
  console.log(`
${skill.name}
${skill.description}

類別: ${skill.category}
作者: ${skill.author}
來源: ${skill.source}
授權: ${skill.license}
標籤: ${skill.tags ? skill.tags.join(', ') : '無'}

免 Node 安裝:
  powershell -ExecutionPolicy Bypass -NoProfile -Command '$s = irm https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.ps1; & ([scriptblock]::Create($s)) -Agent codex -Skill ${skill.name}'
  curl -fsSL https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.sh | bash -s -- --agent codex --skill ${skill.name}
`);
}

function showAgentInfo(agentId) {
  const agent = (loadAgentsJson().agents || []).find(item => item.id === agentId || item.name === agentId);
  if (!agent) {
    console.log(`找不到 Agent "${agentId}"；請使用角色名稱。`);
    return;
  }
  console.log(`
${agent.id}
${agent.description}

執行名稱: ${agent.name}
分類: ${agent.category}
角色: ${agent.role}
權限: ${agent.permission}
作者: ${agent.author}
來源: ${agent.source}
授權: ${agent.license}
相關 Skills: ${agent.skills.join(', ')}

Codex 安裝:
  powershell -ExecutionPolicy Bypass -NoProfile -Command '$s = irm https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.ps1; & ([scriptblock]::Create($s)) -Target codex -Type agent -Name ${agent.id}'

Claude Code 安裝:
  curl -fsSL https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.sh | bash -s -- --target claude --type agent --name ${agent.id}

OpenCode 安裝:
  curl -fsSL https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.sh | bash -s -- --target opencode --type agent --name ${agent.id}
`);
}

function showHelp() {
  console.log(`
Autoverse AI Agent Skills - Catalog 工具

用法:
  autoverse <指令> [選項]
  (或: node autoverse-cli.js <指令> [選項])

指令:
  list                  列出可用 Skills（加 --type agent 列出 Agents）
  list --installed      列出已安裝的元件
  search <關鍵字>       搜尋 catalog
  info <名稱>           顯示詳細資訊

選項:
  --type skill|agent    Catalog 類型（預設: skill）
  --target <名稱>       list --installed 的平台（--agent 為相容別名）
  --all                 list --installed 時列出該類型所有支援平台
  --category <類別>     依類別過濾

Skill 與 Agent targets:
  codex, claude, cursor, vscode, copilot, opencode, project

  vscode 是 copilot 的別名，兩者共用 ~/.copilot 的安裝位置。
  project 會檢查目前工作目錄中的各工具專案路徑。

範例:
  autoverse list
  autoverse search python
  autoverse info python-development
  autoverse list --type agent --category quality-assurance
  autoverse search reviewer --type agent
  autoverse info code-reviewer --type agent
  autoverse list --installed --type agent --target codex

安裝請使用免 Node installer:
  powershell -ExecutionPolicy Bypass -NoProfile -Command '$s = irm https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.ps1; & ([scriptblock]::Create($s)) -Agent codex'
`);
}

const args = process.argv.slice(2);
const command = args[0];

const allFlag = args.includes('--all');
const typeIndex = args.indexOf('--type');
const catalogType = typeIndex !== -1 ? args[typeIndex + 1] : 'skill';
const targetIndex = args.includes('--target') ? args.indexOf('--target') : args.indexOf('--agent');
const target = targetIndex !== -1 ? args[targetIndex + 1] : 'codex';

const categoryIndex = args.indexOf('--category');
const category = categoryIndex !== -1 ? args[categoryIndex + 1] : null;
const positionalArgs = getPositionalArgs(args);
const param = positionalArgs[0];
const searchQuery = positionalArgs.join(' ');

function getPositionalArgs(values) {
  const optionsWithValue = new Set(['--agent', '--target', '--type', '--category']);
  const positional = [];

  for (let i = 1; i < values.length; i += 1) {
    const value = values[i];

    if (optionsWithValue.has(value)) {
      i += 1;
      continue;
    }

    if (value.startsWith('--')) {
      continue;
    }

    positional.push(value);
  }

  return positional;
}

if (!command || command === 'help' || command === '--help' || command === '-h') {
  showHelp();
} else if (command === 'list' || command === 'ls') {
  if (args.includes('--installed')) {
    if (allFlag) {
      if (catalogType === 'agent') ALL_TARGETS.forEach(name => listInstalledAgents(name));
      else ALL_TARGETS.forEach(name => listInstalled(name));
    } else {
      if (catalogType === 'agent') listInstalledAgents(target);
      else listInstalled(target);
    }
  } else {
    if (catalogType === 'agent') listAgents(category);
    else listSkills(category);
  }
} else if (command === 'search' || command === 's') {
  if (!searchQuery) {
    console.log('請指定搜尋關鍵字');
    console.log('用法: autoverse search <關鍵字>');
  } else {
    if (catalogType === 'agent') searchAgents(searchQuery);
    else searchSkills(searchQuery);
  }
} else if (command === 'info') {
  if (!param) {
    console.log('請指定名稱');
  } else {
    if (catalogType === 'agent') showAgentInfo(param);
    else showInfo(param);
  }
} else {
  console.log(`未知指令: ${command}`);
  showHelp();
}
