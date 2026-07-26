# Review Checklist

Read only the sections relevant to the requested diff and affected behavior. Use each item as a question to investigate, not as a reason to manufacture a finding.

## Correctness and State

- Trace valid, invalid, empty, boundary, retry, cancellation, timeout, and partial-failure paths.
- Check stale state, ordering assumptions, off-by-one behavior, default values, feature flags, and role or account state.
- Verify initialization, restart, teardown, cleanup, and repeated execution.
- Compare the implementation with the stated requirement and existing behavior, not with personal preference.

## Contracts and Compatibility

- Check public APIs, events, schemas, configuration, CLI behavior, serialization, and persisted formats.
- Trace changed inputs and outputs through all known producers and consumers.
- Identify compatibility requirements for older clients, installed versions, stored data, or rolling deployments.
- Verify deprecation, fallback, migration, rollback, and release-order assumptions.

## Security and Privacy

- Identify trust boundaries and attacker-controlled input before evaluating a sink.
- Check authentication, authorization, resource ownership, tenant isolation, and privilege transitions.
- Verify injection, XSS, SSRF, open redirect, unsafe file handling, deserialization, secret exposure, and sensitive logging against framework protections.
- Check replay, idempotency, race, webhook verification, cryptography, token lifetime, and data minimization when relevant.
- Route vulnerability-focused analysis to `security-code-review`.

## Data, Persistence, and Migrations

- Check schema constraints, indexes, nullability, defaults, backfills, existing rows, and transaction boundaries.
- Verify expand-and-contract order, mixed-version compatibility, retry safety, rollback, and large-table operational impact.
- Trace cache invalidation, replication lag, consistency expectations, and duplicate delivery.
- Confirm destructive or irreversible paths have explicit safeguards.

## Errors, Reliability, and Observability

- Check whether failures are propagated, translated, retried, compensated, or silently swallowed.
- Verify retry classification, backoff, timeout, cancellation, circuit-breaking, and duplicate-side-effect behavior.
- Check logs, metrics, traces, and correlation context for critical paths without exposing secrets or personal data.
- Verify degraded-mode and dependency-failure behavior.

## Concurrency and Resources

- Check races, lock ordering, shared mutable state, task ownership, event ordering, and atomicity.
- Verify listeners, timers, subscriptions, file handles, sockets, transactions, workers, GPU resources, and background jobs are released.
- Check bounded queues, backpressure, memory growth, and cancellation propagation.

## Performance and Cost

- Look for demonstrated N+1 access, unbounded work, blocking I/O, repeated parsing, excessive rendering, or avoidable network waterfalls.
- Confirm indexes, batching, pagination, caching, code splitting, and resource limits where workload evidence justifies them.
- Distinguish a measured regression from a theoretical optimization.
- Check whether a performance change moves cost or latency to another component.

## Frontend, Mobile, and Accessibility

- Check loading, error, empty, disabled, offline, permission, background, rotation, and resume states.
- Verify keyboard, focus, labels, touch targets, reduced motion, contrast, zoom, localization, and assistive-technology alternatives where affected.
- Check responsive layout, overflow, state synchronization, stale requests, hydration, rendering, and browser or device compatibility.
- Route frontend-specific behavior to `frontend-code-review`; use real browser or device evidence when the failure depends on runtime rendering.

## Dependencies, Build, and Delivery

- Check dependency version compatibility, lockfile intent, licenses, vulnerability exposure, and package size.
- Verify build flags, environment variables, secrets, CI permissions, artifacts, migrations, rollout, health checks, and rollback.
- Check generated outputs against their canonical source and reproducible generation command.
- Identify platform-specific behavior across Windows, macOS, Linux, browsers, devices, or architectures when in scope.

## Tests and Verification

- Require regression tests for demonstrated bugs when a stable automated level exists.
- Check success, boundary, failure, compatibility, authorization, and cleanup paths instead of line coverage alone.
- Detect assertions that only mirror implementation, flaky timing, over-mocking, hidden external dependencies, and tests that never exercise the changed path.
- Prefer the cheapest test that proves the contract; name runtime paths that remain unverified.

## Evidence Questions

Before reporting a finding, answer:

1. What changed?
2. Which caller, consumer, or runtime path reaches it?
3. What exact input or state fails?
4. What existing safeguard was checked?
5. What observable impact follows?
6. Can the issue be reproduced or demonstrated from code?
7. Is this one root cause or a duplicate symptom?
