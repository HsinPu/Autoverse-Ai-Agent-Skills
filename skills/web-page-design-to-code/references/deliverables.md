# Web Page Design-to-Code Deliverables

Use only the sections that improve traceability for the current task. Keep small redesigns in task context; persist these artifacts when another implementer must continue the work or the repository treats design decisions as maintained documentation.

## Intake and Audit

```markdown
# Page redesign audit

- Target route:
- Page goal and audience:
- Current framework and route owner:
- Styling system and reusable primitives:
- Content and data sources:
- Required viewports:
- Source authority: brief/current page | structured Figma | raster/recording | generated artifact | hybrid
- Source artifact IDs/revisions, states, and viewports:
- Visual approval authority and product-behavior authority:
- Reference images and their role:
- Source conflicts and resolution owner:
- Must-preserve behavior:
- Required states:
- Accessibility, SEO, analytics, and performance constraints:
- Out of scope:
- Unknowns or blocked access:
```

## Direction Summary and Approval Record

```markdown
# Visual direction

- Direction name:
- Artifact version/identifier:
- Artifact type: image mockup | non-raster prototype
- Exact viewport and covered states for each artifact:
- Hierarchy and section order:
- Palette and typography:
- Grid, spacing, and surfaces:
- Imagery and iconography:
- Interaction and motion intent:
- Desktop-to-mobile reflow:
- Preserved behavior:

## Design-intelligence receipt, when used

- Query and filters:
- Dataset revision and dataset/script SHA-256 values:
- Selected record IDs, evidence levels, and reasons:
- Rejected records and counter-signals:
- Product evidence that overrode a candidate:
- Downstream decision owner:

## Candidate comparison

| Candidate ID | Artifact/viewports | Shared criteria | Decision | Reason | Confidence |
| --- | --- | --- | --- | --- | --- |

## Approval

- Status: proposed | approved | rejected | superseded
- Approved by:
- Approval evidence:
- Implementation explicitly authorized: yes | no
- Approved artifacts:
- Figma/image receipt ID, revision, and ownership mode, when used:
- Receipt authorization scope and acquired/missing states:
- Unresolved source inferences:
- Substitute explicitly authorized, if applicable:
- Approved deviations:
```

Do not infer approval from silence or from general encouragement.

## Implementation Contract

```markdown
# Page implementation contract

## Target
- Route:
- Content/data source:
- Existing contracts to preserve:

## Tokens
- Canonical token source/revision:
- Token path: reuse | extract/reconcile | scoped candidate
- DTCG compatibility/version:
- Colors:
- Typography:
- Spacing/grid:
- Radius/shadow:

## Token extraction and drift, when used
- Evidence sources and representative route/state/viewport matrix:
- Observed versus approved values:
- Dry-run changes: add | change | rename | alias | deprecate | delete
- Destructive changes and approval owner:
- Unverified cells and drift owner:

## Sections and components
| Section/component | Layout constraint | Content source | States | Interaction |
| --- | --- | --- | --- | --- |

## Component and state ownership
| Responsibility | Existing owner | Reuse/extend/compose/new | Data source | State owner | Required contract change |
| --- | --- | --- | --- | --- | --- |

## Responsive behavior
| Viewport | Reflow and priority rules | Navigation/control changes | Content limits |
| --- | --- | --- | --- |

## Assets
| Asset | Source/license | Treatment | Fallback |
| --- | --- | --- | --- |

## Acceptance criteria
- Functional:
- Visual:
- Responsive:
- Accessibility:
- Performance:
- Allowed tolerance or intentional deviation:
- Machine-gate authority: mode, referenceId, baselineId, baseline approver
- Machine-gate environment: matrix cells, browser, device scale, theme, locale, state, fixture
- Machine-gate policy: channels, thresholds, warn/error handling
- Privacy contract: redaction, retention, cache, and network egress
```

## Visual QA Report

<!-- AUTOVERSE_CONTRACT
{
  "id": "web-page-design-to-code.orchestration",
  "part": "deliverable",
  "version": 1,
  "type": "machine-receipt-template",
  "section": "Visual QA Report",
  "machineReceiptFields": [
    "mode",
    "matrixCell",
    "referenceId",
    "baselineId",
    "verdict",
    "nextAction",
    "baselineAction"
  ],
  "machineContractFields": {
    "authority": [
      "mode",
      "referenceId",
      "baselineId",
      "baselineApprover"
    ],
    "environment": [
      "matrixCell",
      "browser",
      "deviceScale",
      "theme",
      "locale",
      "state",
      "fixture"
    ],
    "policy": [
      "channels",
      "thresholds",
      "warnHandling",
      "errorHandling",
      "retention",
      "cache",
      "networkEgress"
    ]
  }
}
-->

```markdown
# Page visual QA

| Viewport/state | Approved reference | Rendered evidence | Machine result/contract ID | Severity | Finding/status |
| --- | --- | --- | --- | --- | --- |

## Fidelity evidence
| Dimension | Method/tolerance | Result | Accepted deviation |
| --- | --- | --- | --- |
| Structure | | | |
| Text | | | |
| Position | | | |
| Color | | | |

- Environment and commit:
- Fonts/data/theme stabilized:
- Validation mode: pixel comparison | constraint-based comparison
- Canonical result location/ID:
- Contract: mode, matrixCell, referenceId, baselineId
- Machine verdict: pass | warn | fail | error
- Next action: done | revise | review | rerun
- Baseline action: unchanged | candidate | approved | rejected
- Provider/version/command and retry count:
- Evidence channels and unverified cells:
- Artifact retention and network-egress result:
- Console/network result:
- Functional checks:
- Accessibility checks:
- Remaining deviations:
- Iteration stop reason, if not passed:
- Final decision: pass | pass with accepted deviations | blocked
```
