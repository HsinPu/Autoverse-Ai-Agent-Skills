---
name: python-concurrency-patterns
description: Python concurrency patterns guide covering asyncio coordination, TaskGroup usage, cancellation, backpressure, worker orchestration, and safe parallelism. Use when a Python system needs coordinated concurrent work, controlled fan-out/fan-in, or cancellation-aware task flow rather than general async I/O basics.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Python Concurrency Patterns

Use this skill when you need to coordinate concurrent Python work safely.

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
