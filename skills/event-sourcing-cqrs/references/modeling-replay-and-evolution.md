# Event Modeling, Replay, And Evolution

## Contents

- Event envelope
- Aggregate and store rules
- Projection patterns
- Evolution and correction
- Snapshot and replay
- Migration tests

## Event Envelope

```json
{
  "event_id": "globally-unique-id",
  "stream_id": "aggregate-id",
  "stream_version": 42,
  "event_type": "OrderPlaced",
  "schema_version": 2,
  "occurred_at": "ISO-8601",
  "recorded_at": "ISO-8601",
  "actor": {},
  "correlation_id": "business-flow-id",
  "causation_id": "command-or-event-id",
  "payload": {}
}
```

Keep ordering guarantees scoped to a stream unless the storage system proves more.

## Aggregate And Store Rules

- Rehydrate state only from accepted events and deterministic logic.
- Enforce invariants before append.
- Append expected next version atomically.
- Return concurrency conflicts instead of silently overwriting.
- Use an outbox or transactionally coupled publication record.
- Partition by stream ownership and measured workload.

## Projection Patterns

- Store a checkpoint after atomic projection updates.
- Make event handling idempotent.
- Support full rebuild into a new projection version.
- Measure lag by event position and time.
- Quarantine poison events without skipping silently.
- Switch consumers only after reconciliation.

## Evolution And Correction

- Prefer tolerant readers and additive event fields.
- Upcast old representations at read time when deterministic.
- Introduce a new event type when meaning changes.
- Model corrections as new facts linked to the original event.
- Keep event contracts independent from current database entities.

## Snapshot And Replay

Create snapshots only for measured replay cost. Include stream version, aggregate schema, and checksum. Treat snapshots as disposable caches; verify state rebuilt with and without them.

## Migration Tests

Test imported history, duplicate source data, ordering, concurrency, old schemas, partial backfill, projection parity, privacy handling, rollback, and dual-running reconciliation before cutover.
