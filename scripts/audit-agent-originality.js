#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const catalogPath = path.join(root, 'agents.json');
const manifestPath = path.join(__dirname, 'data', 'agent-reference-sources.json');
const minimumLineCharacters = 60;
const minimumPhraseWords = 12;

function usage() {
  console.log(`Usage: node scripts/audit-agent-originality.js

Fetches pinned upstream commits and rejects suspicious verbatim overlap with
canonical Agent prompt bodies. The audit checks normalized lines of at least
${minimumLineCharacters} characters and exact phrases of at least ${minimumPhraseWords} words.`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function runGit(args, options = {}) {
  const result = spawnSync('git', args, {
    cwd: options.cwd,
    encoding: 'utf8',
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
    maxBuffer: 20 * 1024 * 1024,
    stdio: options.capture ? ['ignore', 'pipe', 'pipe'] : ['ignore', 'ignore', 'pipe']
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    const detail = (result.stderr || '').trim();
    throw new Error(`git ${args[0]} failed${detail ? `: ${detail}` : ''}`);
  }
  return result.stdout || '';
}

function stripFrontmatter(text) {
  return text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
}

function tokens(value) {
  return (value.normalize('NFKC').toLowerCase().match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || []);
}

function comparableLines(text) {
  const lines = new Map();
  for (const rawLine of stripFrontmatter(text).split(/\r?\n/)) {
    if (/^\s*#{1,6}\s/.test(rawLine) || /^\s*```/.test(rawLine)) continue;
    const normalized = tokens(rawLine).join(' ');
    if (normalized.length >= minimumLineCharacters && tokens(normalized).length >= 8 && !lines.has(normalized)) {
      lines.set(normalized, rawLine.trim());
    }
  }
  return lines;
}

function phrases(text) {
  const results = new Map();
  for (const rawLine of stripFrontmatter(text).split(/\r?\n/)) {
    if (/^\s*#{1,6}\s/.test(rawLine) || /^\s*```/.test(rawLine)) continue;
    const words = tokens(rawLine);
    for (let index = 0; index <= words.length - minimumPhraseWords; index += 1) {
      const phrase = words.slice(index, index + minimumPhraseWords).join(' ');
      if (!results.has(phrase)) results.set(phrase, rawLine.trim());
    }
  }
  return results;
}

function firstOverlap(canonicalText, upstreamText) {
  const upstreamLines = comparableLines(upstreamText);
  for (const [normalized, display] of comparableLines(canonicalText)) {
    if (upstreamLines.has(normalized)) return { kind: 'line', text: display };
  }
  const upstreamPhrases = phrases(upstreamText);
  for (const [phrase, display] of phrases(canonicalText)) {
    if (upstreamPhrases.has(phrase)) return { kind: `${minimumPhraseWords}-word phrase`, text: display };
  }
  return null;
}

function fetchRepository(tempRoot, source) {
  const repoDirectory = path.join(tempRoot, source.repo.replace(/[^A-Za-z0-9._-]/g, '__'));
  fs.mkdirSync(repoDirectory, { recursive: true });
  runGit(['init', '--bare', repoDirectory]);
  runGit([
    '-C', repoDirectory,
    'fetch', '--depth=1', '--no-tags',
    `https://github.com/${source.repo}.git`, source.commit
  ]);
  const fetchedCommit = runGit(['-C', repoDirectory, 'rev-parse', 'FETCH_HEAD'], { capture: true }).trim();
  if (fetchedCommit !== source.commit) throw new Error(`${source.repo}: fetched commit SHA mismatch`);
  const fetchedTree = runGit(['-C', repoDirectory, 'rev-parse', 'FETCH_HEAD^{tree}'], { capture: true }).trim();
  if (fetchedTree !== source.tree) throw new Error(`${source.repo}: fetched tree SHA mismatch`);
  return repoDirectory;
}

function readUpstream(repoDirectory, commit, referencePath) {
  return runGit(['-C', repoDirectory, 'show', `${commit}:${referencePath}`], { capture: true });
}

function main() {
  const argumentsList = process.argv.slice(2);
  if (argumentsList.length > 0) {
    if (argumentsList.length === 1 && ['--help', '-h'].includes(argumentsList[0])) {
      usage();
      return;
    }
    throw new Error(`Unknown argument: ${argumentsList.join(' ')}`);
  }

  const catalog = readJson(catalogPath);
  const manifest = readJson(manifestPath);
  const sources = new Map(manifest.repositories.map((source) => [source.repo, source]));
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'autoverse-agent-originality-'));
  const repositories = new Map();
  const findings = [];
  let comparisons = 0;

  try {
    for (const source of manifest.repositories) {
      repositories.set(source.repo, fetchRepository(tempRoot, source));
    }
    for (const agent of catalog.agents) {
      const source = sources.get(agent.references.repo);
      if (!source) throw new Error(`${agent.id}: reference repository is not in the manifest`);
      const canonicalText = fs.readFileSync(path.join(root, ...agent.path.split('/')), 'utf8');
      for (const referencePath of agent.references.paths) {
        const upstreamText = readUpstream(repositories.get(source.repo), source.commit, referencePath);
        comparisons += 1;
        const overlap = firstOverlap(canonicalText, upstreamText);
        if (overlap) findings.push({ agent: agent.id, repo: source.repo, path: referencePath, ...overlap });
      }
    }
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }

  if (findings.length > 0) {
    console.error(`Agent originality audit failed with ${findings.length} suspicious overlap(s):`);
    for (const finding of findings) {
      console.error(`- ${finding.agent} <- ${finding.repo}/${finding.path} (${finding.kind}): ${finding.text}`);
    }
    process.exitCode = 1;
    return;
  }
  console.log(`Agent originality audit passed: ${catalog.agents.length} Agents, ${comparisons} pinned upstream comparisons`);
}

try {
  main();
} catch (error) {
  console.error(`Agent originality audit failed: ${error.message}`);
  process.exitCode = 1;
}
