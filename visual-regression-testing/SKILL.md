---
name: visual-regression-testing
description: Visual regression testing workflow for screenshot baselines, pixel diffs, layout comparisons, Percy, Chromatic, BackstopJS, Playwright screenshot tests, and UI change verification. Use when detecting unintended visual changes across components, pages, viewports, or themes.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Visual Regression Testing

Use this skill when UI correctness depends on visual comparison.

## Workflow

1. Define the visual scope: component, page, flow, viewport, theme, browser, and state.
2. Establish or update baselines only after confirming the intended design change.
3. Capture screenshots with deterministic data, fonts, viewport, animations, time, and network state.
4. Compare diffs and classify them as intentional, acceptable noise, or regressions.
5. Report regressions with before/after screenshots, affected state, likely cause, and fix path.

## Rules

- Do not approve new baselines just because tests fail.
- Disable or stabilize animations, timestamps, random data, ads, and third-party widgets.
- Test important responsive and theme variants, not only the default desktop view.
- Prefer semantic visual assertions for layout intent, with pixel diff used as evidence.
- Keep thresholds tight enough to catch real drift but tolerant of known rendering noise.

## Handoff

- For subjective design critique, use `frontend-design-review`.
- For local browser screenshots and console checks, use `webapp-testing`.
- For cross-browser visual differences, use `browser-compatibility-testing`.
