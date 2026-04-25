---
name: testing-strategy
description: Testing strategy workflow for choosing the right test level, shaping fixtures and test data, and balancing confidence, speed, and maintenance cost. Use when planning test coverage or reviewing a feature's test plan.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
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
- For team-wide code conventions, use `coding-standards`.
- For language-specific test practices, use the relevant language skill.
