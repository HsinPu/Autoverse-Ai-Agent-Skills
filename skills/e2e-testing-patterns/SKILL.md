---
name: e2e-testing-patterns
description: End-to-end testing patterns for designing, writing, debugging, and maintaining browser E2E suites with tools such as Playwright or Cypress. Use when creating reliable E2E tests, choosing critical user flows, reducing flaky tests, designing fixtures, or integrating browser tests into CI.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# E2E Testing Patterns

Use this skill when the task is to build or improve browser E2E test coverage.

## Workflow

1. Identify the critical user flow and the risk the E2E test must prove.
2. Keep setup deterministic with fixtures, seeded data, isolated accounts, or API-backed test state.
3. Write tests against user-visible behavior using stable selectors and explicit assertions.
4. Control waits through page state, network responses, or visible UI rather than fixed sleeps.
5. Capture artifacts, traces, screenshots, and logs for CI failures and flaky-test triage.

## Rules

- Keep E2E coverage narrow; do not duplicate component or unit test coverage.
- Prefer one clear user journey per test over broad all-in-one smoke scripts.
- Avoid hidden dependencies between tests; each test should create or own its state.
- Use Page Object helpers only when they reduce duplication without hiding important assertions.
- Treat flakiness as a product or test design bug, not as something to mask with arbitrary retries.

## Handoff

- For deciding whether E2E is the right level, use `testing-strategy`.
- For local manual browser verification, use `webapp-testing`.
- For general browser interaction outside a test suite, use `browser-automation`.
