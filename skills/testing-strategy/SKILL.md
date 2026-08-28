---
name: testing-strategy
description: Testing strategy workflow for choosing the right test level, shaping fixtures and test data, and balancing confidence, speed, and maintenance cost. Use when planning or reviewing test coverage; use test-driven-development separately when implementation must follow a RED-GREEN-REFACTOR cycle.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Testing Strategy

Use this skill when deciding what to test and at which level.

## Workflow

1. Classify the behavior as unit, integration, component, or end-to-end.
2. Choose the smallest test level that proves the risk.
3. Define fixtures, factories, and test data up front.
4. Prefer public behavior over implementation details.
5. Check flakiness, runtime, and maintenance cost before adding more tests.

## Rules

- Keep unit tests fast and deterministic.
- Use integration tests for boundaries and real dependencies.
- Use end-to-end tests only for critical flows that need browser or system coverage.
- Avoid over-mocking when the real integration is the behavior under test.
- State the intended test pyramid for the module or feature.

## Handoff

- For local browser validation, use `webapp-testing`.
- For behavior-first implementation through RED-GREEN-REFACTOR, use `test-driven-development`.
- For an independent gate over completed implementation and test evidence, use `pipeline-review`.
- For fresh proof immediately before a completion claim, use `verification-before-completion`.
- For team-wide code conventions, use `coding-standards`.
- For Python test implementation, fixtures, mocks, async tests, and pytest or unittest details, use `python-testing-engineering`; pair it with `python-development` when production Python code also changes.
- For TypeScript unit or Node.js tests, Vitest or Jest fixtures, typed mocks, and production `.ts` changes, use `typescript-development` as the language baseline.
- For React or other frontend component and hook tests, pair `typescript-development` with `frontend-testing`; for Vue tests, pair it with `vue-testing`.
- For other language-specific test practices, use the relevant language skill.
