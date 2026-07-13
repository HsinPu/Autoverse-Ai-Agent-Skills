#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const SKILLS_JSON = path.join(__dirname, 'skills.json');
const AGENTS_JSON = path.join(__dirname, 'agents.json');

const AGENT_PATHS = {
  claude: path.join(os.homedir(), '.claude', 'skills'),
  cursor: path.join(process.cwd(), '.cursor', 'skills'),
  codex: path.join(os.homedir(), '.codex', 'skills'),
  amp: path.join(os.homedir(), '.amp', 'skills'),
  vscode: path.join(process.cwd(), '.github', 'skills'),
  copilot: path.join(process.cwd(), '.github', 'skills'),
  project: path.join(process.cwd(), '.skills'),
  goose: path.join(os.homedir(), '.config', 'goose', 'skills'),
  opencode: path.join(os.homedir(), '.config', 'opencode', 'skills'),
  'opencode-project': path.join(process.cwd(), '.opencode', 'skills'),
  letta: path.join(os.homedir(), '.letta', 'skills'),
  gemini: path.join(os.homedir(), '.gemini', 'skills'),
};

const AGENT_PROFILE_PATHS = {
  codex: { dir: path.join(os.homedir(), '.codex', 'agents'), extension: '.toml' },
  'codex-project': { dir: path.join(process.cwd(), '.codex', 'agents'), extension: '.toml' },
  claude: { dir: path.join(os.homedir(), '.claude', 'agents'), extension: '.md' },
  'claude-project': { dir: path.join(process.cwd(), '.claude', 'agents'), extension: '.md' },
};

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

function listAgents(plugin = null) {
  let agents = loadAgentsJson().agents || [];
  if (plugin) agents = agents.filter(agent => agent.plugin === plugin);
  if (agents.length === 0) {
    console.log('沒有找到任何 Agent');
    return;
  }
  console.log(`可用 Agent (${agents.length} 個):\n`);
  const byPlugin = {};
  for (const agent of agents) (byPlugin[agent.plugin] ||= []).push(agent);
  for (const pluginName of Object.keys(byPlugin).sort()) {
    console.log(`[${pluginName}]`);
    for (const agent of byPlugin[pluginName]) {
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
    agent.id, agent.name, agent.role, agent.plugin, agent.description, ...(agent.tags || [])
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

function listInstalled(agent) {
  const destDir = AGENT_PATHS[agent];
  if (!destDir || !fs.existsSync(destDir)) {
    console.log(`${agent}: 尚未安裝任何技能`);
    return;
  }
  const installed = fs.readdirSync(destDir).filter(name => {
    const skillPath = path.join(destDir, name);
    return fs.statSync(skillPath).isDirectory() &&
           fs.existsSync(path.join(skillPath, 'SKILL.md'));
  });
  if (installed.length === 0) {
    console.log(`${agent}: 尚未安裝任何技能`);
  } else {
    console.log(`${agent} 已安裝 (${installed.length} 個):`);
    installed.forEach(name => console.log(`  ${name}`));
  }
}

function listInstalledAgents(target) {
  const config = AGENT_PROFILE_PATHS[target];
  if (!config || !fs.existsSync(config.dir)) {
    console.log(`${target}: 尚未安裝任何 Agent`);
    return;
  }
  const installed = fs.readdirSync(config.dir)
    .filter(name => name.endsWith(config.extension) && fs.existsSync(path.join(config.dir, `${name}.autoverse.json`)))
    .sort();
  if (installed.length === 0) console.log(`${target}: 尚未安裝任何 Agent`);
  else {
    console.log(`${target} 已安裝 Agent (${installed.length} 個):`);
    installed.forEach(name => console.log(`  ${path.basename(name, config.extension)}`));
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
    console.log(`找不到 Agent "${agentId}"；請使用 plugin/role。`);
    return;
  }
  console.log(`
${agent.id}
${agent.description}

執行名稱: ${agent.name}
Plugin: ${agent.plugin}
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
  --plugin <名稱>       Agent list 的 plugin 篩選
  --all                 list --installed 時列出該類型所有支援平台
  --category <類別>     依類別過濾

支援的 Agent:
  claude, cursor, codex, amp, vscode, copilot,
  project, goose, opencode, opencode-project, letta, gemini

範例:
  autoverse list
  autoverse search python
  autoverse info python-development
  autoverse list --type agent --plugin comprehensive-review
  autoverse search reviewer --type agent
  autoverse info comprehensive-review/code-reviewer --type agent
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
const target = targetIndex !== -1 ? args[targetIndex + 1] : 'claude';

const categoryIndex = args.indexOf('--category');
const category = categoryIndex !== -1 ? args[categoryIndex + 1] : null;
const pluginIndex = args.indexOf('--plugin');
const plugin = pluginIndex !== -1 ? args[pluginIndex + 1] : null;

const positionalArgs = getPositionalArgs(args);
const param = positionalArgs[0];
const searchQuery = positionalArgs.join(' ');

function getPositionalArgs(values) {
  const optionsWithValue = new Set(['--agent', '--target', '--type', '--category', '--plugin']);
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
      if (catalogType === 'agent') Object.keys(AGENT_PROFILE_PATHS).forEach(name => listInstalledAgents(name));
      else Object.keys(AGENT_PATHS).forEach(name => listInstalled(name));
    } else {
      if (catalogType === 'agent') listInstalledAgents(target);
      else listInstalled(target);
    }
  } else {
    if (catalogType === 'agent') listAgents(plugin);
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
