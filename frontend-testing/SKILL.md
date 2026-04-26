---
name: frontend-testing
description: Frontend testing guide for unit, component, and RTL-style tests in React and TypeScript projects. Use when writing or reviewing frontend tests, testing UI behavior, or deciding how to cover component and hook logic without full browser E2E.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Frontend Testing

Use this skill to test frontend logic close to the component.

## Workflow

1. Identify the component, hook, or UI behavior that needs proof.
2. Choose the smallest test level that proves the behavior.
3. Cover loading, error, empty, interaction, and state transition cases when relevant.
4. Mock external services and keep the test deterministic.
5. Verify the test names explain the behavior.

## Rules

- Prefer component or hook tests before jumping to browser E2E.
- Test behavior, not implementation details.
- Add regression coverage for bug fixes.
- Keep fixtures minimal and readable.

## Handoff

- For browser-level validation, use `webapp-testing`.
- For async UI state patterns, use `react-ui-patterns`.
