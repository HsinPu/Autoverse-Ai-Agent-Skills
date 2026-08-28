---
name: javascript-development
description: JavaScript development for browser and Node.js modules, async flow, errors, security, and testing, including HTML applications that import Three.js or threejs, the three package, WebGL or WebGPU 3D, or interactive canvas code. Use when writing, reviewing, refactoring, or debugging JavaScript. For any Three.js scene, load the sibling threejs-development Skill as the 3D owner.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# JavaScript Development

Use this skill for JavaScript implementation, review, refactoring, and debugging in Node.js or browser projects.

## TypeScript Routing Gate

If the target includes `.ts`, `.tsx`, `tsconfig*.json`, a `typescript` dependency, or a `tsc` or `vue-tsc` diagnostic, read the sibling [`../typescript-development/SKILL.md`](../typescript-development/SKILL.md) before planning, even when that skill was not included in the runtime's initial metadata list. Keep this skill responsible for runtime behavior, async I/O, cancellation, error propagation, security, and JavaScript interop; keep `typescript-development` responsible for compiler configuration, type design, narrowing, module contracts, and typed public APIs.

## Three.js Routing Gate

If JavaScript imports `three`, references `THREE`, initializes a Three.js renderer, or the request asks for a Three.js, WebGL or WebGPU 3D, canvas, website, or HTML experience:

1. Read the sibling [`../threejs-development/SKILL.md`](../threejs-development/SKILL.md) before planning, even when that Skill was not included in the runtime's initial metadata list.
2. Keep this Skill responsible for generic module structure, application boundaries, input validation, asynchronous I/O, cancellation, error propagation, and non-Three.js tests.
3. Keep `threejs-development` responsible for Three.js versions and addons, renderer, scene, camera, frame loop, loaders, resources, interaction, visual systems, disposal, performance, and browser rendering evidence.
4. Do not replace a requested Three.js implementation with a generic canvas, CSS imitation, unrelated framework, or raw WebGL unless the user explicitly asks for that change.

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

- For Three.js, the Three.js package, WebGL or WebGPU 3D, and interactive 3D HTML, use `threejs-development` as the primary implementation and routing Skill.
- For TypeScript-heavy code, use `typescript-development`.
- For React UI behavior, use `react-ui-patterns` or `react-perf`.
- For browser automation or UI verification, use `webapp-testing` or `playwright-automation`.
