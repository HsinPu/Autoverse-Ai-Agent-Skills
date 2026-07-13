# Temporal Determinism, Testing, And Versioning

## Contents

- Boundary rules
- Retry and timeout design
- Testing
- Versioning
- History and deployment

## Boundary Rules

Keep decisions, timers, signals, queries, updates, and activity scheduling in workflows. Put network, database, filesystem, subprocess, randomness, current wall time, and external SDK calls in activities. Use SDK-provided deterministic time and randomness APIs when available.

## Retry And Timeout Design

| Failure | Default treatment |
|---|---|
| transient network or dependency failure | bounded retry with backoff |
| rate limit | server-directed or bounded delayed retry |
| invalid business request | non-retryable failure |
| activity process loss | retry if side effect is idempotent |
| long-running work | heartbeat with progress and cancellation details |
| workflow deadline | timer or explicit business timeout |

Set schedule-to-close when total retry duration matters and start-to-close when one attempt must be bounded.

## Testing

- Unit-test deterministic domain decisions outside the workflow where practical.
- Use the SDK test environment and time skipping for timers and deadlines.
- Test success, activity failure, exhausted retry, heartbeat timeout, signal order, update rejection, cancellation, compensation, child failure, and continue-as-new.
- Replay representative production histories before deploying workflow changes.
- Test old workers and new workers against compatible payloads and task queues.

## Versioning

- Add compatible branches through the SDK's supported version or patching mechanism.
- Keep old code paths until no open history requires them.
- Version payloads independently from workflow code.
- Use new workflow types or task queues for incompatible redesigns.
- Never branch on mutable deployment configuration in a way that changes replay decisions.

## History And Deployment

Monitor history length, activity retries, task latency, sticky cache, worker polling, and non-determinism failures. Deploy compatible workers before clients schedule new behavior. Preserve rollback workers while open executions may still dispatch old tasks.
