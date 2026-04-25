---
name: python-observability-debugging
description: Python observability and debugging guide covering traceback triage, logging investigation, profiling, memory diagnosis, performance troubleshooting, and runtime failure analysis. Use when a Python system is failing, slow, memory-heavy, or hard to diagnose, and the task is to isolate root cause rather than design application code.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Python Observability and Debugging

Use this skill when Python code is failing, slow, noisy, or hard to understand in runtime.

## When To Use

- Investigate exceptions, tracebacks, and intermittent failures
- Profile slow code paths or memory growth
- Correlate logs, traces, and runtime symptoms
- Diagnose production-only behavior or environment-specific bugs
- Reduce noise and isolate root cause before changing code

## Boundaries

- Use `logging-patterns` for how logs should be written.
- Use `testing-strategy` for choosing the right test level or test design.
- Use `python-development` for general Python structure and style.

## Workflow

1. Reproduce the symptom with the smallest possible input or command.
2. Capture the exact error, traceback, logs, and environment facts.
3. Narrow the failure surface before editing code.
4. Compare expected behavior with observed behavior.
5. Use profiling or targeted instrumentation only when needed.
6. Verify the fix against the original symptom.

## Diagnostic Tools

| Need | Prefer | Notes |
|---|---|---|
| Stack traces | `traceback`, exception logs | Keep the full root cause |
| CPU hotspots | `cProfile`, `profile`, `py-spy` | Start with the narrowest reproducible path |
| Memory growth | `tracemalloc`, object counts | Compare before/after snapshots |
| Ad hoc runtime facts | temporary prints, logs, asserts | Remove once the issue is solved |

## Triage Rules

- Reproduce before hypothesizing.
- Change one variable at a time.
- Prefer evidence from logs, metrics, or traces over guesses.
- Distinguish root cause from symptom.
- Keep temporary diagnostics small and explicit.

## Handoff

- For log message style, hand off to `logging-patterns`.
- For test planning, hand off to `testing-strategy`.
- For code changes after diagnosis, hand off to `python-development`.

- See [reference/debugging-workflows.md](reference/debugging-workflows.md) for deeper guidance.
