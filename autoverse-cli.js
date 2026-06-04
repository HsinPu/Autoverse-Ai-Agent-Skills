#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const SKILLS_JSON = path.join(__dirname, 'skills.json');

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

function showHelp() {
  console.log(`
Autoverse AI Agent Skills - 技能管理工具

用法:
  autoverse <指令> [選項]
  (或: node autoverse-cli.js <指令> [選項])

指令:
  list                  列出所有可用技能
  list --installed      列出已安裝的技能
  search <關鍵字>       搜尋技能
  info <技能名>         顯示技能詳細資訊

選項:
  --agent <名稱>        list --installed 的目標 Agent (預設: claude)
  --all                 list --installed 時列出所有支援 Agent
  --category <類別>     依類別過濾

支援的 Agent:
  claude, cursor, codex, amp, vscode, copilot,
  project, goose, opencode, opencode-project, letta, gemini

範例:
  autoverse list
  autoverse search python
  autoverse info python-development
  autoverse list --installed --agent codex

安裝請使用免 Node installer:
  powershell -ExecutionPolicy Bypass -NoProfile -Command '$s = irm https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.ps1; & ([scriptblock]::Create($s)) -Agent codex'
`);
}

const args = process.argv.slice(2);
const command = args[0];

const allFlag = args.includes('--all');
const agentIndex = args.indexOf('--agent');
const agent = agentIndex !== -1 ? args[agentIndex + 1] : 'claude';

const categoryIndex = args.indexOf('--category');
const category = categoryIndex !== -1 ? args[categoryIndex + 1] : null;

const positionalArgs = getPositionalArgs(args);
const param = positionalArgs[0];
const searchQuery = positionalArgs.join(' ');

function getPositionalArgs(values) {
  const optionsWithValue = new Set(['--agent', '--category']);
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
      Object.keys(AGENT_PATHS).forEach(a => listInstalled(a));
    } else {
      listInstalled(agent);
    }
  } else {
    listSkills(category);
  }
} else if (command === 'search' || command === 's') {
  if (!searchQuery) {
    console.log('請指定搜尋關鍵字');
    console.log('用法: autoverse search <關鍵字>');
  } else {
    searchSkills(searchQuery);
  }
} else if (command === 'info') {
  if (!param) {
    console.log('請指定技能名稱');
  } else {
    showInfo(param);
  }
} else {
  console.log(`未知指令: ${command}`);
  showHelp();
}
