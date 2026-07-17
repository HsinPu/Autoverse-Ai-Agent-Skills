---
name: temporal-workflow-engineering
description: Engineer durable Temporal workflows and activities with deterministic replay, explicit state, signals, queries, updates, retries, timeouts, heartbeats, cancellation, compensation, child workflows, continue-as-new, versioning, worker deployment, and time-skipping tests. Use when building or reviewing long-running distributed business processes in Python, TypeScript, Java, Go, or another Temporal SDK.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Temporal Workflow Engineering

## Workflow

1. Model business states, events, deadlines, external effects, actors, signals, queries, updates, and terminal outcomes.
2. Keep deterministic decision logic in workflows and move network, filesystem, database, randomness, and external side effects into activities.
3. Define activity idempotency, retry classification, start-to-close and schedule-to-close timeouts, heartbeats, and cancellation.
4. Use child workflows for independently owned durable lifecycles, not ordinary function decomposition.
5. Add compensation for completed side effects; do not confuse cancellation with rollback.
6. Bound history through batching or continue-as-new where necessary.
7. Evolve deployed workflows through replay-safe changes and explicit versioning.
8. Validate with time-skipping, replay, failure injection, worker restart, duplicate, timeout, cancellation, and upgrade tests.

## Rules

- Never call nondeterministic APIs directly from workflow code.
- Do not retry permanent business rejection or non-idempotent side effects blindly.
- Preserve workflow ID, payload, search attribute, task queue, and serialization compatibility.
- Make cancellation scope and cleanup ownership explicit.
- Deploy compatible workers before scheduling executions that require new behavior.

## References

- Read [references/determinism-testing-and-versioning.md](references/determinism-testing-and-versioning.md) for workflow/activity boundaries, retry tables, time-skipping tests, replay checks, versioning patterns, history control, and deployment sequencing.

## Handoff

- Use `event-sourcing-cqrs` for immutable domain history and projections.
- Use `python-concurrency-patterns` for non-Temporal asyncio coordination.
- Use `testing-strategy` for test-level selection.
- Use `observability-engineering` for workflow and worker telemetry.
