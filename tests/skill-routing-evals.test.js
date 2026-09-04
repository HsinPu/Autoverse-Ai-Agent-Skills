#!/usr/bin/env node

'use strict';

const assert = require('assert');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const runner = require('../scripts/run-skill-routing-evals.js');
let passed = 0;

function test(name, fn) {
  fn();
  passed += 1;
  console.log(`PASS ${name}`);
}

test('extracts only known Skill names from Codex agent messages', () => {
  const output = [
    JSON.stringify({ type: 'thread.started', thread_id: 'fixture' }),
    JSON.stringify({
      type: 'item.completed',
      item: { type: 'agent_message', text: 'solution-discovery\nstripe-payments\nunknown-skill' },
    }),
  ].join('\n');
  assert.deepStrictEqual(
    runner.parseSelectedSkills(output, new Set(['solution-discovery', 'spec-flow', 'stripe-payments'])),
    ['solution-discovery', 'stripe-payments']
  );
});

test('scores expected, excluded, and extra selected Skills independently', () => {
  assert.deepStrictEqual(
    runner.scoreRoutingCase(
      { expected_skills: ['solution-discovery'], excluded_skills: ['spec-flow'] },
      ['solution-discovery', 'stripe-payments']
    ),
    { passed: true, missing: [], forbidden: [] }
  );
  assert.deepStrictEqual(
    runner.scoreRoutingCase(
      { expected_skills: ['spec-flow'], excluded_skills: ['solution-discovery'] },
      ['solution-discovery']
    ),
    { passed: false, missing: ['spec-flow'], forbidden: ['solution-discovery'] }
  );
});

test('validates the repository routing corpus without calling Codex', () => {
  const result = spawnSync(
    process.execPath,
    [path.join(root, 'scripts', 'run-skill-routing-evals.js'), '--skill', 'solution-discovery', '--validate-only'],
    { cwd: root, encoding: 'utf8' }
  );
  assert.strictEqual(result.status, 0, `${result.stdout || ''}${result.stderr || ''}`);
  assert.match(result.stdout, /solution-discovery: 10 routing cases validated/);
});

console.log(`Skill routing eval tests passed: ${passed}`);
