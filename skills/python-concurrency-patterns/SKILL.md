---
name: python-concurrency-patterns
description: Python specialist only for designing or changing concurrency ownership, task lifetime, TaskGroup, cancellation, queues, backpressure, workers, or controlled fan-out. Read it with python-development when coordination is primary. For an unknown traceback, failing test, hang, timeout, or asyncio error, read python-observability-debugging first instead.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Python Concurrency Patterns

Use this skill when you need to coordinate concurrent Python work safely.

## Python Baseline Gate

Before planning or editing concurrent Python code, read the sibling [`../python-development/SKILL.md`](../python-development/SKILL.md), even when the runtime omitted it from the initial Skill list. Keep this skill responsible for task lifetime, cancellation, queues, backpressure, and concurrency ownership; keep `python-development` responsible for general async I/O, modules, typing, errors, resources, and implementation conventions.

## When To Use

- Fan out work across multiple async tasks or workers
- Coordinate cancellation, timeouts, and task groups
- Control concurrency limits and backpressure
- Manage queues, producers, consumers, or pipelines
- Refactor hard-to-reason concurrent flows

## Boundaries

- Use `python-development` for general async I/O, typing, and code structure.
- Use `python-backend-development` for framework-specific workers or request flow.
- Use `python-observability-debugging` first for unknown race conditions, tracebacks, failing tests, hangs, timeouts, or runtime failures; add this skill only when the confirmed fix changes concurrency ownership or coordination.

## Workflow

1. Define the concurrency model: sequential, async, thread, process, or queue-based.
2. Identify shared state and cancellation boundaries.
3. Limit fan-out and make pressure visible.
4. Keep task lifetimes explicit.
5. Handle timeouts and partial failure deliberately.
6. Verify the system still behaves under load and cancellation.

## Core Rules

- Prefer structured concurrency where available.
- Keep producers and consumers balanced.
- Do not let background tasks escape their owning scope.
- Use semaphores or queue limits to control concurrency.
- Treat cancellation as a first-class path, not an edge case.

## Handoff

- For general async I/O and Python structure, hand off to `python-development`.
- For backend worker integration, hand off to `python-backend-development`.
- For failures and slowdowns, hand off to `python-observability-debugging`.

- See [reference/concurrency-workflows.md](reference/concurrency-workflows.md) for deeper guidance.
