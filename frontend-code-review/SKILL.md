---
name: frontend-code-review
description: Frontend code review guide for analyzing React, TypeScript, CSS, and UI changes in .tsx, .ts, .js, and style files. Use when reviewing frontend diffs, pull requests, or UI changes and the goal is to surface concrete bugs, regressions, and test gaps.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Frontend Code Review

Use this skill to review frontend changes with a bug-hunting mindset.

## Workflow

1. Inspect the changed files, UI scope, and user-visible behavior.
2. Check correctness, accessibility, performance, state handling, and test coverage.
3. Look for regressions in loading, error, empty, responsive, and interaction states.
4. Review styling, semantics, and component boundaries when they affect the result.
5. Report findings with file and line references.

## Rules

- Focus on concrete issues that can ship as bugs.
- Call out missing tests when behavior or UI state changed.
- Separate functional bugs from polish or style suggestions.
- Prefer the smallest fix that removes the risk.

## Handoff

- For deeper general code review, use `code-review`.
- For local browser verification, use `webapp-testing`.
