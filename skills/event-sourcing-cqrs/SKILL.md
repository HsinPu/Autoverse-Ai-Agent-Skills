---
name: event-sourcing-cqrs
description: Design and implement event-sourced domains, event stores, aggregates, commands, immutable event contracts, CQRS read models, projections, snapshots, idempotency, consistency boundaries, replay, correction, and schema evolution. Use when a system needs auditable state transitions, temporal reconstruction, separate read models, or migration and recovery for existing event-driven data.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/Autoverse-Ai-Agent-Skills"
---

# Event Sourcing And CQRS

## Fit Check

1. Identify decisions, invariants, audit needs, temporal queries, correction requirements, and expected write and read scale.
2. Compare event sourcing with conventional state plus audit history.
3. Reject event sourcing when ordinary CRUD and a history table satisfy the domain at lower operational cost.

## Workflow

1. Define aggregate boundaries, command intent, invariant enforcement, expected version, and concurrency behavior.
2. Name immutable events as past facts and specify identity, actor, causation, correlation, timestamp, and schema version.
3. Append events atomically with optimistic concurrency and publish through an outbox or equivalent durable boundary.
4. Build idempotent projections with checkpoints, rebuild, lag, poison-event, and correction behavior.
5. Define snapshots only after replay cost is measured.
6. Test command rejection, concurrency conflicts, duplicate delivery, reordering assumptions, projection failure, replay, and event evolution.
7. Plan migration, backfill, dual-running, reconciliation, rollback, and consumer compatibility.

## Rules

- Never rewrite historical facts silently.
- Separate event-store consistency from projection freshness.
- Keep cross-aggregate workflows outside aggregate transactions.
- Preserve deterministic replay and version every contract that can evolve.
- Treat privacy deletion, retention, and encryption as event-lifecycle design constraints.

## References

- Read [references/modeling-replay-and-evolution.md](references/modeling-replay-and-evolution.md) for event envelopes, storage layout, projection patterns, upcasting, corrections, snapshots, migration, and test matrices.

## Handoff

- Use `database-design` for physical storage and indexing.
- Use `api-contract-design` for command and query boundaries.
- Use `temporal-workflow-engineering` for long-running cross-aggregate processes.
- Use `observability-engineering` for projection lag and replay monitoring.
