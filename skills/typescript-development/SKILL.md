---
name: typescript-development
description: Write, modify, fix, review, refactor, and type-check TypeScript code, modules, libraries, services, and applications. Use as the primary TypeScript implementation and routing skill whenever work mentions TypeScript, .ts, .tsx, tsconfig, strict mode, tsc or vue-tsc errors, generics, interfaces, unions, or typed public APIs; then load only the framework, testing, debugging, or refactoring skill that materially owns the remaining work.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# TypeScript Development

Use this skill as the baseline for TypeScript implementation, review, type design, debugging, testing, and refactoring.

## TypeScript Routing Gate

Read this skill before planning when the target includes `.ts`, `.tsx`, `tsconfig*.json`, a `typescript` dependency, a `tsc` or `vue-tsc` diagnostic, strict-mode type errors, or an explicit TypeScript request, even if this skill was omitted from the runtime's initial metadata list.

Keep this skill responsible for supported TypeScript versions, compiler configuration, domain types, module and package boundaries, public APIs, runtime-validation boundaries, type narrowing, and general TypeScript implementation. Add only the specialist that owns a material part of the task:

- Plain Node.js or browser runtime behavior, asynchronous I/O, cancellation, or JavaScript interop: `javascript-development`.
- React component state and user-visible async behavior: `react-ui-patterns`.
- Next.js routing, Server Components, Server Actions, caching, or route handlers: `nextjs-development`.
- Vue SFCs and Composition API behavior: `vue-development` or `vue-composition-api`.
- React or general frontend component tests: `frontend-testing`.
- Vue component, composable, store, or route tests: `vue-testing`.
- General test-level selection and non-UI Vitest coverage: `testing-strategy`.
- Unknown compiler, build, or runtime cause: `systematic-debugging`.
- Behavior-preserving structural cleanup: `code-refactoring`.
- A required RED-GREEN-REFACTOR cycle: `test-driven-development`.

Do not load every related skill. Keep TypeScript as the shared implementation baseline and select the smallest specialist set justified by the request.

## When To Use

- Create or change `.ts` and `.tsx` files in libraries, services, command-line tools, web apps, or framework projects.
- Fix TypeScript compiler diagnostics, unsafe narrowing, inference failures, generic constraints, or public type regressions.
- Design or preserve exported interfaces, discriminated unions, schemas, adapters, and module boundaries.
- Add focused tests whose fixtures, mocks, or assertions must remain type-safe.

## Workflow

1. Inspect the supported TypeScript and runtime versions, `tsconfig`, package scripts, module boundaries, framework conventions, and test setup.
2. Trace the existing runtime data boundary before deciding which guarantees belong to static types and which require validation.
3. Model domain shapes with precise types before adding runtime logic.
4. Keep exported APIs stable, narrow, and easy to infer at call sites.
5. Use generics, unions, overloads, conditional types, and utility types only when they make usage clearer.
6. Verify with the repository's typecheck command, framework build check, focused tests, and the nearest affected suite.

## Rules

- Prefer explicit boundary types for public APIs, hooks, services, and adapters.
- Avoid `any`; if unavoidable, isolate it at the boundary and narrow quickly.
- Treat network, storage, environment, and user input as `unknown` until runtime validation establishes a trusted shape.
- Preserve the repository's module resolution, package exports, declaration output, and supported runtime targets.
- Keep type-level cleverness below the threshold where future maintainers can understand it.
- Replace hardcoded literals with named constants or typed configuration when values carry domain meaning.

## Reference Routing

- Refactoring patterns, code smells, parameter objects, and extraction tactics: read [reference/refactoring.md](reference/refactoring.md).

## Handoff

- For whole-project architecture diagnosis, target architecture comparison, or migration planning before TypeScript edits, use `project-architecture-review`.
- For plain JavaScript projects, use `javascript-development`.
- For React UI state and behavior, use `react-ui-patterns`.
- For Next.js application boundaries, use `nextjs-development` while retaining this skill for TypeScript contracts.
- For Vue TypeScript and SFC work, use `vue-development` or `vue-composition-api`.
- For TypeScript tests, use `testing-strategy`, `frontend-testing`, or `vue-testing` according to the test surface.
