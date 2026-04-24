---
name: coding-standards
description: Universal coding standards guide for TypeScript, JavaScript, React, and Node.js projects. Use when establishing or auditing code conventions, ESLint/Prettier/TypeScript strict settings, feature-based folder structure, layered services, React patterns, testing practices, performance, accessibility, or security hygiene.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Coding Standards

Use this skill when the task is about team-wide rules, not one-off code changes.

## Core Scope

- TypeScript and JavaScript conventions
- React component and Hooks patterns
- Node.js service and API conventions
- Project structure and layering
- Lint, format, test, CI, performance, accessibility, and security standards

## Standards First

Before implementing new code or reviewing existing code, make the expected standards explicit:

- **Linting**: define ESLint rules and do not rely on ad hoc style fixes.
- **Formatting**: define Prettier or an equivalent formatter.
- **Type Safety**: enable strict TypeScript settings when the codebase supports it.
- **Folder Structure**: prefer feature-based folders and clear module boundaries.
- **Layering**: keep UI, state, service, and data access responsibilities separate.
- **Testing**: define what must be unit tested, integration tested, and end-to-end tested.

## When To Use

- Setting up standards for a new TS/JS/React/Node project
- Auditing an existing codebase for inconsistent conventions
- Reviewing a PR that adds new patterns or conventions
- Diagnosing maintainability issues caused by mixed styles or unclear structure

## Workflow

1. Inspect the current codebase conventions.
2. Identify the smallest set of standards that will make the project consistent.
3. Prefer existing project rules over inventing new ones.
4. Write or revise conventions so they are easy to follow and easy to review.
5. Validate the rules against real files and real code paths.

## Common Standards

- Use functional React components and Hooks by default.
- Prefer composition over inheritance.
- Keep components small and focused.
- Move business logic out of UI components when it grows.
- Validate inputs at the boundary.
- Keep async error handling explicit.
- Avoid hidden side effects in shared utilities.
- Keep public APIs stable and predictable.

## Checkpoints

- Are folders organized by feature or domain?
- Are naming, imports, and module boundaries consistent?
- Are tests covering important behavior rather than implementation details?
- Are security-sensitive flows validated at the boundary?
- Are accessibility and performance part of the standard, not an afterthought?

## Handoff

- For code-level defects and review output, use `code-review`.
- For cleanup without behavior change, use `code-refactoring`.
- For language-specific implementation details, use `typescript-development`, `javascript-development`, `vue-development`, or `frontend-design`.
- For design tokens and visual consistency, use `design-system`.
