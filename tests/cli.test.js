const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const CLI_PATH = path.join(__dirname, '..', 'autoverse-cli.js');
const EXPECTED_SKILL_COUNT = require('../skills.json').skills.length;

function runCli(args) {
  return spawnSync(process.execPath, [CLI_PATH, ...args], {
    cwd: path.dirname(CLI_PATH),
    encoding: 'utf8',
  });
}

function combinedOutput(result) {
  return `${result.stdout || ''}${result.stderr || ''}`;
}

const tests = [
  ['defaults to the Skill catalog when --type is omitted', () => {
    const result = runCli(['list']);

    assert.equal(result.status, 0, combinedOutput(result));
    assert.match(result.stdout, new RegExp(String(EXPECTED_SKILL_COUNT)));
  }],
  ['accepts the Agent catalog explicitly', () => {
    const result = runCli(['list', '--type', 'agent', '--category', 'quality-assurance']);

    assert.equal(result.status, 0, combinedOutput(result));
    assert.match(result.stdout, /Agent/);
  }],
  ['accepts the Skill catalog explicitly', () => {
    const result = runCli(['list', '--type', 'skill']);

    assert.equal(result.status, 0, combinedOutput(result));
    assert.match(result.stdout, new RegExp(String(EXPECTED_SKILL_COUNT)));
  }],
  ['rejects an unsupported --type instead of listing Skills', () => {
    const result = runCli(['list', '--type', 'nonsense']);
    const output = combinedOutput(result);

    assert.equal(result.status, 1, output);
    assert.match(output, /無效的 --type 值/);
    assert.match(output, /skill.*agent/i);
    assert.doesNotMatch(result.stdout, new RegExp(String(EXPECTED_SKILL_COUNT)));
  }],
  ['rejects --type without a value', () => {
    const result = runCli(['list', '--type']);
    const output = combinedOutput(result);

    assert.equal(result.status, 1, output);
    assert.match(output, /缺少 --type 的值/);
  }],
  ['treats another option after --type as a missing value', () => {
    const result = runCli(['list', '--type', '--all']);
    const output = combinedOutput(result);

    assert.equal(result.status, 1, output);
    assert.match(output, /缺少 --type 的值/);
  }],
  ['rejects a repeated --type with a trailing invalid value', () => {
    const result = runCli(['list', '--type', 'agent', '--type', 'nonsense']);
    const output = combinedOutput(result);

    assert.equal(result.status, 1, output);
    assert.match(output, /不可重複使用 --type/);
    assert.doesNotMatch(result.stdout, /Agent/);
  }],
  ['rejects a repeated --type with a trailing missing value', () => {
    const result = runCli(['list', '--type', 'agent', '--type']);
    const output = combinedOutput(result);

    assert.equal(result.status, 1, output);
    assert.match(output, /不可重複使用 --type/);
    assert.doesNotMatch(result.stdout, /Agent/);
  }],
  ['rejects --target when the next token is another option', () => {
    const result = runCli(['list', '--installed', '--target', '--all']);
    const output = combinedOutput(result);

    assert.equal(result.status, 1, output);
    assert.match(output, /缺少 --target\/--agent 的值/);
  }],
  ['rejects duplicate target aliases', () => {
    const result = runCli(['list', '--installed', '--target', 'codex', '--agent', 'claude']);
    const output = combinedOutput(result);

    assert.equal(result.status, 1, output);
    assert.match(output, /不可重複使用 --target\/--agent/);
  }],
  ['rejects --category when the next token is another option', () => {
    const result = runCli(['list', '--category', '--all']);
    const output = combinedOutput(result);

    assert.equal(result.status, 1, output);
    assert.match(output, /缺少 --category 的值/);
  }],
  ['rejects duplicate --category values', () => {
    const result = runCli(['list', '--category', 'backend', '--category', 'frontend']);
    const output = combinedOutput(result);

    assert.equal(result.status, 1, output);
    assert.match(output, /不可重複使用 --category/);
  }],
  ['rejects an unknown long option instead of ignoring it', () => {
    const result = runCli(['list', '--typ', 'agent']);
    const output = combinedOutput(result);

    assert.equal(result.status, 1, output);
    assert.match(output, /未知選項: --typ/);
    assert.doesNotMatch(result.stdout, new RegExp(String(EXPECTED_SKILL_COUNT)));
  }],
  ['rejects unsupported --option=value syntax explicitly', () => {
    const result = runCli(['list', '--type=agent']);
    const output = combinedOutput(result);

    assert.equal(result.status, 1, output);
    assert.match(output, /未知選項: --type=agent/);
    assert.doesNotMatch(result.stdout, new RegExp(String(EXPECTED_SKILL_COUNT)));
  }],
];

let failures = 0;
for (const [name, run] of tests) {
  try {
    run();
    console.log(`PASS ${name}`);
  } catch (error) {
    failures += 1;
    console.error(`FAIL ${name}`);
    console.error(error.stack || error.message);
  }
}

if (failures > 0) {
  console.error(`CLI tests failed: ${failures}/${tests.length}`);
  process.exit(1);
}

console.log(`CLI tests passed: ${tests.length}`);
