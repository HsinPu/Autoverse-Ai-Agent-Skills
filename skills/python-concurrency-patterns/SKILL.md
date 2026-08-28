---
name: python-concurrency-patterns
description: Design, implement, fix, and review concurrent Python code using asyncio, TaskGroup, cancellation, timeouts, queues, backpressure, workers, or controlled fan-out and fan-in. Use when coordination and task lifetime are the primary Python concern rather than general async I/O basics; pair with python-development.
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
- Use `python-observability-debugging` for diagnosing race conditions or runtime failures.

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
