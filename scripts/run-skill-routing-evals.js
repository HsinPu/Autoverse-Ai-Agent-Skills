#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const DEFAULT_ROOT = path.resolve(__dirname, '..');
const ROUTING_PROMPT = [
  'This is a Skill routing evaluation.',
  'Do not perform the user task and do not read or modify files.',
  'Return only the Skill names that normal automatic routing would select, one per line; return none if no Skill applies.',
  'Do not select a Skill merely because this evaluation asks about routing.',
  '',
  'Actual user request:',
].join('\n');

function usage() {
  return 'Usage: node scripts/run-skill-routing-evals.js --skill <name> [--root <repository>] [--model <model>] [--max-cases <count>] [--validate-only]';
}

function parseArgs(argv) {
  const options = {
    root: DEFAULT_ROOT,
    skill: null,
    model: null,
    maxCases: null,
    validateOnly: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--validate-only') {
      options.validateOnly = true;
      continue;
    }
    if (!['--root', '--skill', '--model', '--max-cases'].includes(argument) || index + 1 >= argv.length) {
      throw new Error(usage());
    }
    const value = argv[index + 1];
    index += 1;
    if (argument === '--root') options.root = path.resolve(value);
    if (argument === '--skill') options.skill = value;
    if (argument === '--model') options.model = value;
    if (argument === '--max-cases') {
      const parsed = Number(value);
      if (!Number.isInteger(parsed) || parsed < 1) throw new Error('--max-cases must be a positive integer');
      options.maxCases = parsed;
    }
  }
  if (!options.skill || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(options.skill)) {
    throw new Error('--skill must be a normalized kebab-case Skill name');
  }
  return options;
}

function listKnownSkills(root) {
  const skillsDir = path.join(root, 'skills');
  return new Set(fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(skillsDir, entry.name, 'SKILL.md')))
    .map((entry) => entry.name));
}

function parseSelectedSkills(output, knownSkills) {
  const messages = [];
  for (const line of output.split(/\r?\n/)) {
    if (!line.trim().startsWith('{')) continue;
    try {
      const event = JSON.parse(line);
      if (event.type === 'item.completed' && event.item?.type === 'agent_message') {
        messages.push(event.item.text || '');
      }
    } catch (error) {
      // Codex warnings may share stdout with JSONL; malformed non-event lines are ignored.
    }
  }

  const selected = [];
  const seen = new Set();
  for (const message of messages) {
    const matches = [];
    for (const skillName of knownSkills) {
      const escaped = skillName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const match = new RegExp(`(^|[^a-z0-9-])${escaped}($|[^a-z0-9-])`, 'i').exec(message);
      if (match) matches.push({ skillName, index: match.index });
    }
    matches.sort((left, right) => left.index - right.index || left.skillName.localeCompare(right.skillName));
    for (const match of matches) {
      if (!seen.has(match.skillName)) {
        seen.add(match.skillName);
        selected.push(match.skillName);
      }
    }
  }
  return selected;
}

function scoreRoutingCase(routingCase, selectedSkills) {
  const selected = new Set(selectedSkills);
  const missing = routingCase.expected_skills.filter((skillName) => !selected.has(skillName));
  const forbidden = routingCase.excluded_skills.filter((skillName) => selected.has(skillName));
  return { passed: missing.length === 0 && forbidden.length === 0, missing, forbidden };
}

function validateCorpus(root, skillName) {
  const validator = path.join(root, 'scripts', 'validate-skill-evals.js');
  const validation = spawnSync(process.execPath, [validator, '--root', root], {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 8 * 1024 * 1024,
  });
  if (validation.status !== 0) {
    throw new Error(`${validation.stdout || ''}${validation.stderr || ''}`.trim());
  }

  const routingPath = path.join(root, 'skills', skillName, 'evals', 'routing.json');
  if (!fs.existsSync(routingPath) || !fs.statSync(routingPath).isFile()) {
    throw new Error(`Routing corpus not found: ${routingPath}`);
  }
  return JSON.parse(fs.readFileSync(routingPath, 'utf8').replace(/^\uFEFF/, ''));
}

function runCodexCase(root, model, prompt) {
  const args = ['exec', '--ephemeral', '--sandbox', 'read-only', '--json', '-C', root];
  if (model) args.push('--model', model);
  args.push(`${ROUTING_PROMPT}${prompt}`);
  return spawnSync('codex', args, {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
    shell: false,
    timeout: 120000,
  });
}

function main(argv) {
  const options = parseArgs(argv);
  const corpus = validateCorpus(options.root, options.skill);
  const cases = options.maxCases === null ? corpus.cases : corpus.cases.slice(0, options.maxCases);
  if (options.validateOnly) {
    console.log(`${options.skill}: ${cases.length} routing cases validated`);
    return 0;
  }

  const knownSkills = listKnownSkills(options.root);
  let passed = 0;
  let positiveHits = 0;
  let positiveCount = 0;
  let falsePositives = 0;
  let exclusionCaseCount = 0;

  for (const routingCase of cases) {
    const result = runCodexCase(options.root, options.model, routingCase.prompt);
    if (result.error || result.status !== 0) {
      const detail = result.error?.message || `${result.stdout || ''}${result.stderr || ''}`.trim();
      console.error(`ERROR ${routingCase.id}: ${detail}`);
      continue;
    }
    const selected = parseSelectedSkills(result.stdout || '', knownSkills);
    const score = scoreRoutingCase(routingCase, selected);
    if (score.passed) passed += 1;
    if (routingCase.kind === 'positive') {
      positiveCount += 1;
      if (selected.includes(options.skill)) positiveHits += 1;
    }
    if (routingCase.excluded_skills.includes(options.skill)) {
      exclusionCaseCount += 1;
      if (selected.includes(options.skill)) falsePositives += 1;
    }
    const details = [];
    if (score.missing.length > 0) details.push(`missing=${score.missing.join(',')}`);
    if (score.forbidden.length > 0) details.push(`forbidden=${score.forbidden.join(',')}`);
    console.log(`${score.passed ? 'PASS' : 'FAIL'} ${routingCase.id}: selected=${selected.join(',') || 'none'}${details.length > 0 ? `; ${details.join('; ')}` : ''}`);
  }

  const recall = positiveCount === 0 ? 0 : (positiveHits / positiveCount) * 100;
  const falsePositiveRate = exclusionCaseCount === 0 ? 0 : (falsePositives / exclusionCaseCount) * 100;
  console.log(`Routing summary: ${passed}/${cases.length} passed, target recall ${positiveHits}/${positiveCount} (${recall.toFixed(1)}%), false positives ${falsePositives}/${exclusionCaseCount} (${falsePositiveRate.toFixed(1)}%)`);
  return passed === cases.length ? 0 : 1;
}

if (require.main === module) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}

module.exports = {
  parseSelectedSkills,
  scoreRoutingCase,
};
