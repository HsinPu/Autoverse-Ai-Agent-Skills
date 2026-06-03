---
name: python-testing-engineering
description: Python testing implementation guide covering pytest fixtures, parametrization, monkeypatching, mocks, async tests, temp paths, capture helpers, and framework-specific adapters. Use when writing, refactoring, or debugging Python tests and test harnesses, or when the task is about how to implement tests rather than choosing the test level.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Python Testing Engineering

Use this skill when you need to write or improve Python tests.

## When To Use

- Write or refactor pytest-based unit, integration, or async tests
- Design fixtures, factories, and reusable test helpers
- Mock dependencies or isolate external boundaries
- Test file system, environment, CLI, HTTP, or background-worker behavior
- Improve flaky tests or stabilize failing test suites

## Boundaries

- Use `testing-strategy` for choosing the right test level and coverage balance.
- Use `python-observability-debugging` for diagnosing why tests or code are failing.
- Use `python-development` for general Python style and project structure.

## Workflow

1. Start from the behavior you want to prove.
2. Pick the smallest practical test tool and scope.
3. Build only the fixtures and doubles needed for the case.
4. Keep setup explicit and teardown automatic.
5. Make the test deterministic and independent.
6. Run the narrow test first, then the relevant suite.

## Pytest Baseline

- Prefer `pytest` for new Python test code.
- Use `parametrize` for clear input/output cases.
- Use marks for known exceptions, slow tests, or conditional execution.
- Keep test names descriptive and behavior-focused.

## Fixture Design

- Prefer small, composable fixtures over one large setup fixture.
- Use function scope by default.
- Use `conftest.py` for shared fixtures only when they are broadly useful.
- Avoid hidden state in fixtures.

## Isolation Tools

| Need | Prefer | Notes |
|---|---|---|
| Temp files / dirs | `tmp_path`, `tmp_path_factory` | Real filesystem, auto-cleaned |
| Env vars / cwd | `monkeypatch` | Keep changes local to the test |
| stdout / stderr | `capsys`, `capfd` | Use the lighter capture that fits |
| Logs | `caplog` | Assert log level and message shape |
| Sync doubles | `Mock`, `MagicMock` | Use `spec` or `autospec` when helpful |
| Async doubles | `AsyncMock` | Match coroutine boundaries |

## Mocking Rules

- Mock at the boundary, not inside the implementation.
- Prefer fakes when stateful behavior matters more than call counts.
- Use `spec` or `autospec` to catch interface drift.
- Avoid asserting on incidental internal calls unless that is the contract.

## Async Tests

- Use the project's async test plugin or marker consistently.
- Keep event-loop-bound code isolated from blocking I/O.
- Await the real coroutine behavior you want to prove.

## Framework Adapters

- Use framework-specific clients or fixtures for integration tests.
- Keep adapter setup thin and reusable.
- If a backend/framework skill already defines the app structure, keep test logic here and app structure there.

## Flaky Tests

- Remove dependence on real time, random order, shared state, or external services.
- Replace sleeps with explicit synchronization or deterministic fakes.
- Simplify the fixture graph before increasing timeouts.

## Handoff

- For deciding test level or test mix, hand off to `testing-strategy`.
- For diagnosing failures in tests or code under test, hand off to `python-observability-debugging`.
- For app-structure-specific integration details, hand off to `python-backend-development`.

- See [reference/testing-workflows.md](reference/testing-workflows.md) for deeper guidance.
