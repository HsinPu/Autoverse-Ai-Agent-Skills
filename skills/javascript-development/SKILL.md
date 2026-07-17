---
name: javascript-development
description: JavaScript development guide covering code style, module structure, async and error handling, security, and testing in modern Node.js and browser code. Use when writing, reviewing, or refactoring JavaScript.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# JavaScript Development

Use this skill for JavaScript implementation, review, refactoring, and debugging in Node.js or browser projects.

## Workflow

1. Inspect runtime targets, module format, package scripts, lint rules, and test setup.
2. Follow the local style for modules, exports, async flow, and error boundaries.
3. Keep side effects explicit and isolate I/O from pure transformation logic.
4. Handle promises, cancellation, retries, and thrown errors deliberately.
5. Verify with the repo's unit tests, targeted script, browser check, or Node smoke command.

## Reference Routing

- Style, modules, JSDoc, `@ts-check`, and formatting: read [reference/code-style.md](reference/code-style.md).
- Async flow, promises, and error handling: read [reference/async-and-errors.md](reference/async-and-errors.md).
- Browser, server, dependency, and input security: read [reference/security.md](reference/security.md).
- Jest, Vitest, mocks, and test structure: read [reference/testing.md](reference/testing.md).

## Rules

- Prefer simple data flow over clever metaprogramming.
- Avoid hidden mutation across modules unless the project already uses that pattern.
- Validate and normalize external input at the boundary.
- Do not add dependencies when native APIs or existing helpers are enough.

## Handoff

- For TypeScript-heavy code, use `typescript-development`.
- For React UI behavior, use `react-ui-patterns` or `react-perf`.
- For browser automation or UI verification, use `webapp-testing` or `playwright-automation`.
