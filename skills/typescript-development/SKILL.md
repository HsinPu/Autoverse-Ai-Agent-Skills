---
name: typescript-development
description: TypeScript development guide covering code style, type safety, design patterns, API design, and refactoring techniques for TypeScript-heavy codebases. Use when writing, reviewing, or restructuring TypeScript code, or when deciding type and module design.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# TypeScript Development

Use this skill for TypeScript-heavy implementation, review, type design, and refactoring.

## Workflow

1. Inspect `tsconfig`, package scripts, module boundaries, framework conventions, and test setup.
2. Model domain shapes with precise types before adding runtime logic.
3. Keep exported APIs stable, narrow, and easy to infer at call sites.
4. Use generics, unions, overloads, and utility types only when they make usage clearer.
5. Verify with `tsc`, framework build checks, unit tests, or the repo's existing validation command.

## Rules

- Prefer explicit boundary types for public APIs, hooks, services, and adapters.
- Avoid `any`; if unavoidable, isolate it at the boundary and narrow quickly.
- Keep type-level cleverness below the threshold where future maintainers can understand it.
- Replace hardcoded literals with named constants or typed configuration when values carry domain meaning.

## Reference Routing

- Refactoring patterns, code smells, parameter objects, and extraction tactics: read [reference/refactoring.md](reference/refactoring.md).

## Handoff

- For whole-project architecture diagnosis, target architecture comparison, or migration planning before TypeScript edits, use `project-architecture-review`.
- For plain JavaScript projects, use `javascript-development`.
- For React UI state and behavior, use `react-ui-patterns`.
- For Vue TypeScript and SFC work, use `vue-development` or `vue-composition-api`.
