---
name: frontend-code-review
description: Frontend code review guide for analyzing React, TypeScript, CSS, state, accessibility, performance, business logic, and UI behavior changes in .tsx, .ts, .js, and style files. Use when reviewing frontend diffs, pending working-tree changes, pull requests, or specific frontend files to surface concrete bugs, regressions, and test gaps.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Frontend Code Review

Use this skill to review frontend changes with a bug-hunting mindset. Support both pending-change review and focused file review.

## Workflow

1. Identify review mode: pending changes, PR diff, or named files.
2. Inspect changed files, UI scope, user-visible behavior, and affected states.
3. Check correctness, accessibility, performance, state handling, business logic, styling, and test coverage.
4. Look for regressions in loading, error, empty, responsive, keyboard, hover, focus, and interaction states.
5. Report findings with file and line references, ordered by severity.

## Rules

- Focus on concrete issues that can ship as bugs.
- Call out missing tests when behavior or UI state changed.
- Separate functional bugs from polish or style suggestions.
- Prefer the smallest fix that removes the risk.
- Treat missing keyboard access, broken focus, or inaccessible custom controls as functional defects, not polish.
- Avoid broad style preferences unless they affect usability, maintainability, or design-system consistency.

## Checklist

- **Correctness**: conditional rendering, stale state, race conditions, form validation, route/query handling, feature flags, permissions.
- **State UX**: loading, error, empty, disabled, optimistic, retry, cancellation, and refresh behavior.
- **Accessibility**: semantic elements, labels, keyboard operation, focus management, ARIA only when needed, contrast-sensitive UI.
- **Performance**: unnecessary waterfalls, unstable keys, expensive renders, unbounded lists, large dependencies, missed code splitting.
- **Business logic**: incorrect assumptions about roles, account state, quotas, localization, timezones, currency, pagination, or sorting.
- **Styling**: responsive breakage, overflow, z-index/focus traps, token misuse, theme/dark-mode regressions.
- **Tests**: behavior-level component tests for changed interactions; E2E coverage for critical flows.

## Output

```markdown
## Frontend Code Review

### Findings
- **[Severity]** `file:line` <issue>
  - **Impact:** <user-visible risk>
  - **Fix:** <smallest useful fix>

### Test Gaps
- `file:line` <missing or brittle test>

### Not Checked
- <states, browsers, or viewports not verified>
```

## Handoff

- For deeper general code review, use `code-review`.
- For visual design-system and UI craft review, use `frontend-design-review`.
- For local browser verification, use `webapp-testing`.
