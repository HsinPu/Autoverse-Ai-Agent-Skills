#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const SKILLS_JSON = path.join(__dirname, 'skills.json');
const META_FILE = '.skill-meta.json';

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

function writeSkillMeta(skillPath, meta) {
  try {
    const metaPath = path.join(skillPath, META_FILE);
    const now = new Date().toISOString();
    fs.writeFileSync(metaPath, JSON.stringify({
      ...meta,
      installedAt: meta.installedAt || now,
      updatedAt: now
    }, null, 2));
  } catch {}
}

function readSkillMeta(skillPath) {
  try {
    const metaPath = path.join(skillPath, META_FILE);
    if (fs.existsSync(metaPath)) {
      return JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    }
  } catch {}
  return null;
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function getSkillInfo(skillName) {
  const data = loadSkillsJson();
  return data.skills.find(s => s.name === skillName);
}

function installFromGitHub(skillName, repo, agent) {
  const destDir = AGENT_PATHS[agent];
  if (!destDir) {
    console.log(`錯誤: 不支援的 Agent "${agent}"`);
    return false;
  }

  const tempDir = path.join(os.tmpdir(), `autoverse-skills-${Date.now()}`);

  try {
    console.log(`從 GitHub 下載: ${repo}...`);
    const repoUrl = `https://github.com/${repo}.git`;
    execFileSync('git', ['clone', '--depth', '1', repoUrl, tempDir], { stdio: 'pipe' });

    let sourcePath = tempDir;
    const skillsSubdir = path.join(tempDir, 'skills', skillName);
    const directPath = path.join(tempDir, skillName);
    
    if (fs.existsSync(skillsSubdir) && fs.existsSync(path.join(skillsSubdir, 'SKILL.md'))) {
      sourcePath = skillsSubdir;
    } else if (fs.existsSync(directPath) && fs.existsSync(path.join(directPath, 'SKILL.md'))) {
      sourcePath = directPath;
    } else if (!fs.existsSync(path.join(tempDir, 'SKILL.md'))) {
      console.log(`錯誤: 在 ${repo} 找不到技能 "${skillName}"`);
      fs.rmSync(tempDir, { recursive: true, force: true });
      return false;
    }

    const destPath = path.join(destDir, skillName);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    copyDir(sourcePath, destPath);
    writeSkillMeta(destPath, { source: 'github', repo: repo, name: skillName });
    
    fs.rmSync(tempDir, { recursive: true, force: true });
    
    console.log(`已安裝: ${skillName} -> ${agent} (來源: github:${repo})`);
    return true;
  } catch (e) {
    console.log(`安裝失敗: ${e.message}`);
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
    return false;
  }
}

function installSkill(skillName, agent) {
  const skillInfo = getSkillInfo(skillName);
  
  if (!skillInfo) {
    console.log(`錯誤: 找不到技能 "${skillName}"`);
    const data = loadSkillsJson();
    const available = data.skills.map(s => s.name);
    if (available.length > 0) {
      console.log(`可用技能: ${available.slice(0, 5).join(', ')}${available.length > 5 ? '...' : ''}`);
    }
    return false;
  }

  const repo = skillInfo.source;
  if (!repo) {
    console.log(`錯誤: 技能 "${skillName}" 沒有定義來源`);
    return false;
  }

  return installFromGitHub(skillName, repo, agent);
}

function uninstallSkill(skillName, agent) {
  const destDir = AGENT_PATHS[agent];
  if (!destDir) return false;

  const destPath = path.join(destDir, skillName);

  if (fs.existsSync(destPath)) {
    try {
      fs.rmSync(destPath, { recursive: true, force: true });
      console.log(`已移除: ${skillName} (從 ${agent})`);
      return true;
    } catch (e) {
      console.log(`移除失敗: ${e.message}`);
      return false;
    }
  } else {
    console.log(`技能 "${skillName}" 未安裝在 ${agent}`);
    return false;
  }
}

function getInstalledSkills(agent) {
  const destDir = AGENT_PATHS[agent];
  if (!destDir || !fs.existsSync(destDir)) return [];
  return fs.readdirSync(destDir).filter(name => {
    const skillPath = path.join(destDir, name);
    return fs.statSync(skillPath).isDirectory() &&
           fs.existsSync(path.join(skillPath, 'SKILL.md'));
  });
}

function updateSkill(skillName, agent) {
  const destDir = AGENT_PATHS[agent];
  if (!destDir) return false;

  const destPath = path.join(destDir, skillName);

  if (!fs.existsSync(destPath)) {
    console.log(`技能 "${skillName}" 未安裝在 ${agent}`);
    return false;
  }

  const meta = readSkillMeta(destPath);
  let repo = meta?.repo;

  if (!repo) {
    const skillInfo = getSkillInfo(skillName);
    repo = skillInfo?.source;
  }

  if (!repo) {
    console.log(`錯誤: 找不到技能 "${skillName}" 的來源`);
    return false;
  }

  try {
    fs.rmSync(destPath, { recursive: true, force: true });
    
    const tempDir = path.join(os.tmpdir(), `autoverse-skills-${Date.now()}`);
    console.log(`從 GitHub 更新: ${repo}...`);
    
    const repoUrl = `https://github.com/${repo}.git`;
    execFileSync('git', ['clone', '--depth', '1', repoUrl, tempDir], { stdio: 'pipe' });
    
    let sourcePath = tempDir;
    const skillsSubdir = path.join(tempDir, 'skills', skillName);
    const directPath = path.join(tempDir, skillName);
    
    if (fs.existsSync(skillsSubdir) && fs.existsSync(path.join(skillsSubdir, 'SKILL.md'))) {
      sourcePath = skillsSubdir;
    } else if (fs.existsSync(directPath) && fs.existsSync(path.join(directPath, 'SKILL.md'))) {
      sourcePath = directPath;
    }
    
    copyDir(sourcePath, destPath);
    fs.rmSync(tempDir, { recursive: true, force: true });
    
    writeSkillMeta(destPath, { ...meta, source: 'github', repo: repo, name: skillName });
    console.log(`已更新: ${skillName} -> ${agent} (來源: github:${repo})`);
    return true;
  } catch (e) {
    console.log(`更新失敗: ${e.message}`);
    return false;
  }
}

function updateAllSkills(agent) {
  const installed = getInstalledSkills(agent);
  if (installed.length === 0) {
    console.log(`${agent}: 沒有已安裝的技能`);
    return;
  }
  console.log(`更新 ${agent} 的 ${installed.length} 個技能...\n`);
  let updated = 0;
  for (const name of installed) {
    if (updateSkill(name, agent)) updated++;
  }
  console.log(`\n完成: ${updated}/${installed.length} 個技能已更新`);
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
  const q = query.toLowerCase();
  
  const matches = data.skills.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.description.toLowerCase().includes(q) ||
    (s.tags && s.tags.some(t => t.toLowerCase().includes(q)))
  );
  
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

安裝:
  autoverse install ${skill.name} --agent cursor
  (若未安裝 autoverse 指令，可用: node autoverse-cli.js install ${skill.name} --agent cursor)
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
  install <技能名>      安裝技能 (從 GitHub)
  uninstall <技能名>    移除技能
  update <技能名>       更新技能 (從 GitHub)
  update --all          更新所有技能

選項:
  --agent <名稱>        指定目標 Agent (預設: claude)
  --all                 安裝/移除/更新到所有 Agent
  --category <類別>     依類別過濾

支援的 Agent:
  claude, cursor, codex, amp, vscode, copilot,
  project, goose, opencode, letta, gemini

範例:
  autoverse list
  autoverse search python
  autoverse info python-development
  autoverse install python-development --agent cursor
  autoverse update --all --agent cursor
`);
}

const args = process.argv.slice(2);
const command = args[0];

const allFlag = args.includes('--all');
const agentIndex = args.indexOf('--agent');
const agent = agentIndex !== -1 ? args[agentIndex + 1] : 'claude';

const categoryIndex = args.indexOf('--category');
const category = categoryIndex !== -1 ? args[categoryIndex + 1] : null;

const param = args.slice(1).find((a, i) => {
  const actualIndex = i + 1;
  return !a.startsWith('--') && actualIndex !== agentIndex + 1 && actualIndex !== categoryIndex + 1;
});

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
  if (!param) {
    console.log('請指定搜尋關鍵字');
    console.log('用法: autoverse search <關鍵字>');
  } else {
    searchSkills(param);
  }
} else if (command === 'info') {
  if (!param) {
    console.log('請指定技能名稱');
  } else {
    showInfo(param);
  }
} else if (command === 'install') {
  if (!param) {
    console.log('請指定技能名稱');
    console.log('用法: autoverse install <技能名> [--agent cursor] [--all]');
  } else if (allFlag) {
    Object.keys(AGENT_PATHS).forEach(a => installSkill(param, a));
  } else {
    installSkill(param, agent);
  }
} else if (command === 'uninstall' || command === 'rm') {
  if (!param) {
    console.log('請指定技能名稱');
    console.log('用法: autoverse uninstall <技能名> [--agent cursor] [--all]');
  } else if (allFlag) {
    Object.keys(AGENT_PATHS).forEach(a => uninstallSkill(param, a));
  } else {
    uninstallSkill(param, agent);
  }
} else if (command === 'update') {
  if (allFlag && !param) {
    const agents = agentIndex !== -1 ? [agent] : Object.keys(AGENT_PATHS);
    agents.forEach(a => updateAllSkills(a));
  } else if (!param) {
    console.log('請指定技能名稱或使用 --all');
    console.log('用法: autoverse update <技能名> [--agent cursor]');
    console.log('      autoverse update --all');
  } else if (allFlag) {
    Object.keys(AGENT_PATHS).forEach(a => updateSkill(param, a));
  } else {
    updateSkill(param, agent);
  }
} else {
  console.log(`未知指令: ${command}`);
  showHelp();
}
