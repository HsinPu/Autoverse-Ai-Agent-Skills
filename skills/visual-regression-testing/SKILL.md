---
name: visual-regression-testing
description: Provider-neutral visual comparison and machine-gate workflow for detecting screenshot regressions and evaluating implementation fidelity against approved references across components, pages, states, viewports, themes, and browsers. Use when UI changes need reproducible screenshot, DOM, OCR, contrast, console, network, or semantic-vision evidence; dimensional acceptance criteria; CI verdicts; baseline approval; or an iterative repair gate.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "amitpatole/agent-vision"
  reference-license: "MIT"
  reference-revision: "83f5abdfe76c97fbc47af451a340f5eb5683f547"
---

# Visual Regression Testing

Use this Skill when UI correctness depends on reproducible visual comparison. Keep capture, machine perception, product judgment, and baseline approval as separate responsibilities.

## Choose the Mode

- **Regression:** compare the current render with a previously approved implementation baseline and detect unintended drift.
- **Reference fidelity:** compare an implementation with an approved mockup, screenshot, or reference set and measure whether it meets an explicit design contract.

Do not mix the modes. A new design reference may authorize a product change, but it does not automatically authorize replacing the regression baseline.

## Workflow

1. Define the comparison contract: mode, source or baseline ID, component or page, viewport, theme, browser, state, required content, tolerance, and approval owner.
2. Build the smallest coverage matrix that represents critical responsive, theme, content, and interaction variants.
3. Select evidence channels for the risk: screenshot diff, DOM geometry, computed-style contrast, OCR, console or network failures, accessibility tree, temporal sampling, or optional semantic vision.
4. Capture screenshots with deterministic data, fonts, viewport, animations, time, locale, and network state.
5. Normalize machine results into `pass`, `warn`, `fail`, or `error`, with issue location, evidence channel, severity, confidence, and next action. Read [references/machine-visual-gate.md](references/machine-visual-gate.md) for the portable contract and CI lifecycle.
6. Evaluate structure, text, position, and color separately. Record measured bounds, counts, samples, or tool scores only where the method is repeatable.
7. Classify each difference as blocking, major, minor, accepted, expected noise, or regression, and identify its likely owner.
8. For fidelity work, repeat one focused repair at a time and recapture the identical matrix cell. Stop when the contract passes or the stop rules apply.
9. Promote a candidate baseline only after confirming the intended change, approval evidence, affected matrix cells, and owner. A passing capture does not approve itself.
10. Report before/after evidence, environment, thresholds, affected state, likely cause, fix path, accepted deviations, baseline action, and unverified cells.

## Evidence Matrix

| Dimension | Evidence examples | Guardrail |
| --- | --- | --- |
| Structure | region presence, DOM/component count, order, bounding boxes | Missing critical content cannot be offset by a high image-similarity score |
| Text | exact authoritative copy, role, wrapping, line count | Generated image text is not authoritative product copy |
| Position | anchors, gutters, gaps, relative bounds, clipping | Compare at the same viewport, scale, fonts, and content |
| Color | semantic roles, sampled values, contrast, theme | Accessibility and intentional platform differences override cosmetic matching |

## Machine Gate Contract

<!-- CRAFTROSTER_CONTRACT
{
  "id": "visual-regression-testing.machine-gate",
  "part": "handoff",
  "version": 1,
  "type": "machine-gate-handoff",
  "section": "Machine Gate Contract",
  "machineReceiptFields": [
    "mode",
    "matrixCell",
    "referenceId",
    "baselineId",
    "verdict",
    "nextAction",
    "baselineAction"
  ]
}
-->

Use a machine gate when a repeatable tool can produce structured evidence. The minimum handoff is:

```text
verdict: pass | warn | fail | error
contract:
  mode: regression | reference-fidelity
  matrixCell: <route|viewport|theme|state>
  referenceId: <approved artifact ID or null>
  baselineId: <approved implementation baseline ID or null>
issues:
  - severity: blocking | major | minor | info
    channel: dom | contrast | ocr | console | network | pixel | semantic | temporal
    location: <selector, coordinates, region, frame, or route>
    evidence: <measured observation>
    confidence: high | medium | low
    remediation: <smallest next action>
nextAction: done | revise | review | rerun
baselineAction: unchanged | candidate | approved | rejected
```

Regression mode requires `contract.baselineId`; reference-fidelity mode requires `contract.referenceId`. Missing the authority ID makes the evidence non-reproducible and returns `error` with `nextAction: review`.

Map provider-specific fields and exit codes at the adapter boundary. Do not make the Skill depend on one SaaS, model, or testing library.

## Rules

- Do not approve new baselines just because tests fail.
- Disable or stabilize animations, timestamps, random data, ads, and third-party widgets.
- Test important responsive and theme variants, not only the default desktop view.
- Prefer semantic visual assertions for layout intent, with pixel diff used as evidence.
- Use deterministic channels for exact facts: DOM geometry for element bounds, computed styles for HTML contrast, OCR for rendered text boxes, and console or network capture for broken runtime resources.
- Treat vision-model coordinates and raster-only accessibility judgments as advisory unless another deterministic channel corroborates them.
- Keep thresholds tight enough to catch real drift but tolerant of known rendering noise.
- When an external reference exposes only pixel dimensions, record the candidate CSS viewport, inferred DPR or zoom, confidence, and constraint-based tolerance instead of claiming an exact viewport match.
- Do not combine unrelated measurements into a made-up overall score. Record the tool, version, threshold, and meaning of every automated metric.
- When absolute scoring is ambiguous, compare two candidates pairwise against the same contract and keep the one that resolves higher-impact differences without brittle code.
- Keep sensitive captures local or no-egress when required, disable persistent caches when the tool supports it, and never upload customer data merely to obtain a visual score.
- Preserve the distinction between `warn` and `pass`; do not coerce warnings to green when review is still required.
- Stop after two consecutive focused passes fail to reduce the same highest-severity difference, or when missing assets, conflicting references, or an unstable environment prevent a valid comparison. Report the constraint instead of tuning forever.

## Handoff

- For subjective design critique, use `frontend-design-review`.
- For local browser screenshots and console checks, use `webapp-testing`.
- For cross-browser visual differences, use `browser-compatibility-testing`.
- For accessibility conformance beyond visual evidence, use `accessibility-testing`.
