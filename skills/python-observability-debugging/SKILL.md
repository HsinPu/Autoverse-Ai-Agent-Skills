---
name: python-observability-debugging
description: Diagnose Python exceptions, tracebacks, failing programs, logging problems, slow code, memory growth, profiling results, and environment-specific runtime behavior. Use when the cause of a Python failure or performance problem is unknown and must be isolated before changing code; hand the confirmed fix to python-development.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Python Observability and Debugging

Use this skill when Python code is failing, slow, noisy, or hard to understand in runtime.

## Python Baseline Gate

Read the sibling [`../python-development/SKILL.md`](../python-development/SKILL.md) before planning a Python code fix, even when the runtime omitted it from the initial Skill list. Keep this skill responsible for reproduction, traceback and runtime evidence, profiling, memory, and root-cause isolation; keep `python-development` responsible for the justified production-code change after the cause is confirmed.

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
