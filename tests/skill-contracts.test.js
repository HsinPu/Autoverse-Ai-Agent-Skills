const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
  CONTRACT_FILES,
  EXPECTED_BLOCKS,
  extractContractBlocks,
  findMarkdownSection,
  splitMarkdownTableRow,
  validateContractDocuments,
  validateMachineResultInstance,
  validateMarkdownTables,
  validateRepository,
} = require('../scripts/validate-skill-contracts');

const ROOT = path.resolve(__dirname, '..');
const documents = {};
for (const relativePath of CONTRACT_FILES) {
  documents[relativePath] = fs.readFileSync(path.join(ROOT, ...relativePath.split('/')), 'utf8');
}

const machineSchema = EXPECTED_BLOCKS.find((entry) => (
  entry.value.id === 'visual-regression-testing.machine-gate' && entry.value.part === 'schema'
)).value;

function joined(errors) {
  return errors.join('\n');
}

function replaceOnce(text, before, after) {
  const first = text.indexOf(before);
  assert.notEqual(first, -1, `fixture mutation target not found: ${before}`);
  assert.equal(text.indexOf(before, first + before.length), -1, `fixture mutation target is not unique: ${before}`);
  return `${text.slice(0, first)}${after}${text.slice(first + before.length)}`;
}

function mutateDocument(file, before, after) {
  return {
    ...documents,
    [file]: replaceOnce(documents[file], before, after),
  };
}

function machineResult(mode, referenceId, baselineId) {
  return {
    verdict: 'pass',
    contract: {
      mode,
      matrixCell: '/home|1440x900|light|default',
      referenceId,
      baselineId,
    },
    issues: [],
    nextAction: 'done',
    baselineAction: 'unchanged',
    artifacts: [],
    unverified: [],
  };
}

const tests = [];
const test = (name, run) => tests.push([name, run]);

test('validates the current repository contract bundle', () => {
  const result = validateRepository(ROOT);
  assert.deepEqual(result.errors, []);
  assert.ok(result.markdownFileCount > 0);
  assert.equal(result.workflowContractCount, 7);
});

test('keeps contract section placement correct with CRLF documents', () => {
  const crlfDocuments = {};
  for (const [file, text] of Object.entries(documents)) {
    crlfDocuments[file] = text.replace(/\r?\n/g, '\r\n');
  }
  assert.deepEqual(validateContractDocuments(crlfDocuments), []);
});

test('detects Markdown header and separator mismatches', () => {
  const errors = validateMarkdownTables('| A | B |\n| --- | --- | --- |\n', 'fixture.md');
  assert.match(joined(errors), /header has 2 columns but separator has 3/);
});

for (const [name, body, expected] of [
  ['too many', '| 1 | 2 | 3 |', /row has 3 columns but header has 2/],
  ['too few', '| 1 |', /row has 1 columns but header has 2/],
  ['too many without outer pipes', '1 | 2 | 3', /row has 3 columns but header has 2/],
]) {
  test(`detects Markdown body rows with ${name} columns`, () => {
    const errors = validateMarkdownTables(`A | B\n--- | ---\n${body}\n`, 'fixture.md');
    assert.match(joined(errors), expected);
  });
}

test('accepts empty cells while preserving the declared column count', () => {
  assert.deepEqual(validateMarkdownTables('| A | B |\n| --- | --- |\n| 1 | |\n', 'fixture.md'), []);
});

test('ignores escaped and matched inline-code pipes while splitting tables', () => {
  assert.deepEqual(splitMarkdownTableRow('| `a|b` | c\\|d |'), ['`a|b`', 'c\\|d']);
  assert.deepEqual(splitMarkdownTableRow('| ``a`b|c`` | d |'), ['``a`b|c``', 'd']);
});

test('treats an unmatched backtick as text instead of swallowing a table delimiter', () => {
  assert.deepEqual(splitMarkdownTableRow('| `open | value |'), ['`open', 'value']);
});

test('treats backslashes as literal characters inside a Markdown code span', () => {
  const row = "| `a \\` | b` | c |";
  assert.equal(splitMarkdownTableRow(row).length, 3);
});

test('validates tables inside Markdown fences used as copyable templates', () => {
  const markdown = [
    '```markdown',
    '| A | B |',
    '| --- | --- | --- |',
    '```',
  ].join('\n');
  assert.match(joined(validateMarkdownTables(markdown, 'fixture.md')), /header has 2 columns but separator has 3/);
});

test('ignores table-like text inside non-Markdown fences', () => {
  const markdown = [
    '~~~text',
    '| A | B |',
    '| --- | --- |',
    '| one | two | three |',
    '~~~',
  ].join('\n');
  assert.deepEqual(validateMarkdownTables(markdown, 'fixture.md'), []);
});

test('detects a malformed table in the real page deliverables template', () => {
  const before = '| Candidate ID | Artifact/viewports | Shared criteria | Decision | Reason | Confidence |\n| --- | --- | --- | --- | --- | --- |';
  const after = '| Candidate ID | Artifact/viewports | Shared criteria | Decision | Reason | Confidence |\n| --- | --- | --- | --- | --- | --- | --- |';
  const changed = replaceOnce(documents['skills/web-page-design-to-code/references/deliverables.md'], before, after);
  assert.match(joined(validateMarkdownTables(changed, 'deliverables.md')), /header has 6 columns but separator has 7/);
});

test('ignores headings inside fenced examples', () => {
  assert.equal(findMarkdownSection('```markdown\n## Hidden\ncontent\n```\n', 'Hidden'), null);
});

test('ignores machine contract markers inside fenced examples', () => {
  const example = '```markdown\n<!-- CRAFTROSTER_CONTRACT\n{ invalid json }\n-->\n```\n';
  assert.deepEqual(extractContractBlocks(example, 'fixture.md'), { blocks: [], errors: [] });
});

const sourceMutations = [
  ['figma default receipt disabled', 'skills/figma-to-code/SKILL.md', '"defaultWhenParentGateOpen": true', '"defaultWhenParentGateOpen": false', /defaultWhenParentGateOpen must be true/],
  ['figma production edits enabled', 'skills/figma-to-code/SKILL.md', '"mayEditProduction": false', '"mayEditProduction": true', /mayEditProduction must be false/],
  ['figma baseline approval enabled', 'skills/figma-to-code/SKILL.md', '"mayApproveBaseline": false', '"mayApproveBaseline": true', /mayApproveBaseline must be false/],
  ['figma parent gate closure enabled', 'skills/figma-to-code/SKILL.md', '"mayCloseParentGate": false', '"mayCloseParentGate": true', /mayCloseParentGate must be false/],
  ['figma rerouting enabled', 'skills/figma-to-code/SKILL.md', '"mayReroute": false', '"mayReroute": true', /mayReroute must be false/],
  ['figma scope expansion enabled', 'skills/figma-to-code/SKILL.md', '"mayExpandScope": false', '"mayExpandScope": true', /mayExpandScope must be false/],
  ['figma parent return disabled', 'skills/figma-to-code/SKILL.md', '"returnsToParent": true', '"returnsToParent": false', /returnsToParent must be true/],
  ['image default receipt disabled', 'skills/image-to-code/SKILL.md', '"defaultWhenParentGateOpen": true', '"defaultWhenParentGateOpen": false', /defaultWhenParentGateOpen must be true/],
  ['image production edits enabled', 'skills/image-to-code/SKILL.md', '"mayEditProduction": false', '"mayEditProduction": true', /mayEditProduction must be false/],
  ['image gate closure enabled', 'skills/image-to-code/SKILL.md', '"mayCloseParentGate": false', '"mayCloseParentGate": true', /mayCloseParentGate must be false/],
];

for (const [name, file, before, after, expected] of sourceMutations) {
  test(`rejects source-workflow mutation: ${name}`, () => {
    assert.match(joined(validateContractDocuments(mutateDocument(file, before, after))), expected);
  });
}

const agentFacingTextMutations = [
  [
    'Figma default parent receipt removed',
    'skills/figma-to-code/SKILL.md',
    'default to parent-orchestrated receipt mode',
    'optionally consider parent-orchestrated receipt mode',
  ],
  [
    'Figma stop-before-implementation removed',
    'skills/figma-to-code/SKILL.md',
    'In parent-orchestrated receipt mode, stop here.',
    'In parent-orchestrated receipt mode, continue into implementation.',
  ],
  [
    'Figma production write prohibition inverted',
    'skills/figma-to-code/SKILL.md',
    'Do not edit production code, approve a baseline, close a parent gate, reroute the task, or expand scope.',
    'You may edit production code, approve a baseline, close a parent gate, reroute the task, or expand scope.',
  ],
  [
    'image production write prohibition inverted',
    'skills/image-to-code/SKILL.md',
    'Do not edit production code, generate additional references unless the parent explicitly authorized that bounded action',
    'You may edit production code and generate additional references without parent authorization',
  ],
  [
    'design-system dry-run no-write rule inverted',
    'skills/design-system/SKILL.md',
    'Do not create or overwrite canonical tokens, documentation, previews, generated platform files, or production styles.',
    'Create and overwrite canonical tokens, documentation, previews, generated platform files, and production styles.',
  ],
  [
    'page pre-gate machine lock removed',
    'skills/web-page-design-to-code/SKILL.md',
    'Before the implementation gate, lock the machine-visual contract:',
    'After implementation starts, optionally consider the machine-visual contract:',
  ],
  [
    'site Gate 3 machine contract made optional',
    'skills/website-redesign-to-code/SKILL.md',
    '- the machine-visual contract: mode, source or baseline IDs, required matrix cells, deterministic environment, evidence channels and thresholds, retention and network-egress policy, baseline approver, and `warn`/`error` handling.',
    '- optionally consider a machine-visual contract after implementation.',
  ],
  [
    'site child source workflow may close and expand the program',
    'skills/website-redesign-to-code/SKILL.md',
    'it cannot close a program gate or expand the approved site scope.',
    'it may close a program gate and expand the approved site scope.',
  ],
];

for (const [name, file, before, after] of agentFacingTextMutations) {
  test(`rejects Agent-facing contract drift: ${name}`, () => {
    const errors = validateContractDocuments(mutateDocument(file, before, after));
    assert.match(joined(errors), /canonical text SHA-256 must be/);
  });
}

test('rejects a source workflow with a missing implementation stop boundary', () => {
  const changed = mutateDocument(
    'skills/image-to-code/SKILL.md',
    '### 5. Implement in the Existing Stack',
    '### 5. Continue Somewhere Else'
  );
  assert.match(joined(validateContractDocuments(changed)), /missing stop boundary 5\. Implement in the Existing Stack/);
});

test('rejects an unknown parent workflow and a one-way support edge', () => {
  const unknownParent = mutateDocument(
    'skills/figma-to-code/SKILL.md',
    '"web-page-design-to-code.orchestration",',
    '"unknown-page-flow.orchestration",'
  );
  assert.match(joined(validateContractDocuments(unknownParent)), /unknown parent workflow unknown-page-flow\.orchestration/);

  const oneWay = mutateDocument(
    'skills/web-page-design-to-code/SKILL.md',
    '    "figma-to-code.execution",\n',
    ''
  );
  assert.match(joined(validateContractDocuments(oneWay)), /does not declare the reverse support edge/);
});

test('rejects an invalid or duplicate machine contract marker', () => {
  const file = 'skills/figma-to-code/SKILL.md';
  const invalid = mutateDocument(file, '"version": 1,', '"version": nope,');
  assert.match(joined(validateContractDocuments(invalid)), /CRAFTROSTER_CONTRACT JSON is invalid/);

  const block = documents[file].match(/<!-- CRAFTROSTER_CONTRACT[\s\S]*?-->/)[0];
  const duplicate = { ...documents, [file]: `${documents[file]}\n${block}\n` };
  assert.match(joined(validateContractDocuments(duplicate)), /duplicate CRAFTROSTER_CONTRACT part/);
});

test('rejects a missing Figma screenshot-only fallback row', () => {
  const row = '| `screenshot_only` — screenshot only | `route_image_to_code` — route to `image-to-code` | `recommend_fallback_and_stop` — recommend raster fallback to the parent and stop | variables, components, and constraints are inferred |\n';
  const changed = mutateDocument('skills/figma-to-code/references/figma-evidence-contract.md', row, '');
  assert.match(joined(validateContractDocuments(changed)), /fallback evidence rows must contain 5 items/);
});

test('rejects an unknown Figma parent fallback action enum', () => {
  const changed = mutateDocument(
    'skills/figma-to-code/references/figma-evidence-contract.md',
    '"parentAction": "recommend_fallback_and_stop"',
    '"parentAction": "implement_page"'
  );
  assert.match(joined(validateContractDocuments(changed)), /parentAction must be "recommend_fallback_and_stop"/);
});

test('rejects a parent fallback description that performs implementation', () => {
  const changed = mutateDocument(
    'skills/figma-to-code/references/figma-evidence-contract.md',
    '`return_receipt` — complete the bounded evidence and repository-mapping receipt, then return to the parent',
    '`return_receipt` — implement the page and then return a receipt to the parent'
  );
  assert.match(joined(validateContractDocuments(changed)), /parent fallback description performs implementation/);
});

const designMutations = [
  ['dry-run writes enabled', 'skills/design-system/SKILL.md', '"mayWrite": false', '"mayWrite": true', /mayWrite must be false/],
  ['apply authorization disabled', 'skills/design-system/SKILL.md', '"requiresExplicitUserAuthorization": true', '"requiresExplicitUserAuthorization": false', /requiresExplicitUserAuthorization must be true/],
  ['parent gate bypass enabled', 'skills/design-system/SKILL.md', '"requiresParentGateWhenPresent": true', '"requiresParentGateWhenPresent": false', /requiresParentGateWhenPresent must be true/],
  ['dry-run output requirement enabled', 'skills/design-system/reference/token-extraction-and-drift.md', '"requiresGeneratedOutputs": false', '"requiresGeneratedOutputs": true', /requiresGeneratedOutputs must be false/],
  ['apply destructive approval disabled', 'skills/design-system/reference/token-extraction-and-drift.md', '"requiresDestructiveApproval": true', '"requiresDestructiveApproval": false', /requiresDestructiveApproval must be true/],
];

for (const [name, file, before, after, expected] of designMutations) {
  test(`rejects design-system mutation: ${name}`, () => {
    assert.match(joined(validateContractDocuments(mutateDocument(file, before, after))), expected);
  });
}

test('rejects normalized machine examples missing either authority field or an issue field', () => {
  for (const [before, after, expected] of [
    ['    "referenceId": "string-or-null",\n', '', /contract fields is missing referenceId/],
    [
      '    "referenceId": "string-or-null",\n    "baselineId": "string-or-null"\n',
      '    "referenceId": "string-or-null"\n',
      /contract fields is missing baselineId/,
    ],
    ['      "severity": "blocking \| major \| minor \| info",\n', '', /issues\[0\] fields is missing severity/],
  ]) {
    const changed = mutateDocument('skills/visual-regression-testing/references/machine-visual-gate.md', before, after);
    assert.match(joined(validateContractDocuments(changed)), expected);
  }
});

test('rejects an inverted machine authority map', () => {
  const changed = mutateDocument(
    'skills/visual-regression-testing/references/machine-visual-gate.md',
    '"requiredNonEmpty": "baselineId",',
    '"requiredNonEmpty": "referenceId",'
  );
  assert.match(joined(validateContractDocuments(changed)), /requiredNonEmpty must be "baselineId"/);
});

test('accepts both valid machine authority modes', () => {
  assert.deepEqual(validateMachineResultInstance(machineResult('regression', null, 'baseline-42'), machineSchema), []);
  assert.deepEqual(validateMachineResultInstance(machineResult('reference-fidelity', 'figma-node-7', null), machineSchema), []);
});

for (const [name, result, expected] of [
  ['regression with both IDs', machineResult('regression', 'reference-1', 'baseline-1'), /referenceId must be null/],
  ['regression with neither ID', machineResult('regression', null, null), /baselineId must be a non-empty string/],
  ['reference fidelity with both IDs', machineResult('reference-fidelity', 'reference-1', 'baseline-1'), /baselineId must be null/],
  ['reference fidelity with neither ID', machineResult('reference-fidelity', null, null), /referenceId must be a non-empty string/],
  ['reference fidelity with an empty authority ID', machineResult('reference-fidelity', '  ', null), /referenceId must be a non-empty string/],
  ['unknown mode', machineResult('comparison', 'reference-1', null), /mode must be one of regression, reference-fidelity/],
]) {
  test(`rejects invalid machine result: ${name}`, () => {
    assert.match(joined(validateMachineResultInstance(result, machineSchema)), expected);
  });
}

const orchestratorMutations = [
  ['page support edits enabled', 'skills/web-page-design-to-code/SKILL.md', '"supportMayEditProductionBeforeGate": false', '"supportMayEditProductionBeforeGate": true', /supportMayEditProductionBeforeGate must be false/],
  ['page support gate closure enabled', 'skills/web-page-design-to-code/SKILL.md', '"supportMayCloseGate": false', '"supportMayCloseGate": true', /supportMayCloseGate must be false/],
  ['site support scope expansion enabled', 'skills/website-redesign-to-code/SKILL.md', '"supportMayExpandScope": false', '"supportMayExpandScope": true', /supportMayExpandScope must be false/],
];

for (const [name, file, before, after, expected] of orchestratorMutations) {
  test(`rejects orchestrator mutation: ${name}`, () => {
    assert.match(joined(validateContractDocuments(mutateDocument(file, before, after))), expected);
  });
}

test('rejects page and site machine-contract lock sections that move past their gates', () => {
  const page = mutateDocument(
    'skills/web-page-design-to-code/SKILL.md',
    '### 4. Draft the Implementation Contract',
    '### 4. Draft Something Else'
  );
  assert.match(joined(validateContractDocuments(page)), /missing contract section 4\. Draft the Implementation Contract/);

  const site = mutateDocument(
    'skills/website-redesign-to-code/SKILL.md',
    '### Gate 3: Confirm Implementation Readiness',
    '### Gate 3: Defer Implementation Readiness'
  );
  assert.match(joined(validateContractDocuments(site)), /missing contract section Gate 3: Confirm Implementation Readiness/);
});

test('rejects a deliverable contract that drops a machine receipt field', () => {
  const changed = mutateDocument(
    'skills/web-page-design-to-code/references/deliverables.md',
    '    "referenceId",\n    "baselineId",\n    "verdict",',
    '    "referenceId",\n    "verdict",'
  );
  assert.match(joined(validateContractDocuments(changed)), /machineReceiptFields must contain 7 items/);
});

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
  console.error(`Skill contract tests failed: ${failures}/${tests.length}`);
  process.exit(1);
}

console.log(`Skill contract tests passed: ${tests.length}`);
