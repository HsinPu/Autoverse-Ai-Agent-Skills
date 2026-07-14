# Migration Verification And Recovery

Define evidence and recovery before executing the first mutating stage. Keep thresholds measurable and assign the authority to continue, stop, roll back, or repair forward.

## Preflight Evidence

- Record schema revision, row counts, size, write rate, replication state, long transactions, active locks, and critical-query latency.
- Verify migration ordering, application compatibility, credentials, maintenance constraints, and available capacity.
- Verify backup recency and scope. Perform or cite a recent restore rehearsal that proves recovery time and access.
- Capture representative invariants such as uniqueness, referential integrity, totals, ownership, lifecycle state, and domain-specific balances.
- Define dashboards, queries, logs, checkpoints, alert thresholds, and an incident channel before mutation.

## Stage Verification

Check four evidence layers after every stage:

| Layer | Evidence |
|---|---|
| Schema | Expected objects, types, defaults, constraints, indexes, ownership, and migration history |
| Data | Counts, invariant queries, reconciliation totals, sampled records, checksums where meaningful, and exception rows |
| Application | Old and new version behavior, reads, writes, errors, queues, jobs, and critical journeys |
| Operations | Locks, latency, throughput, CPU, memory, storage, connection pressure, replication lag, and error rate |

Compare against the recorded baseline and threshold. Do not reduce verification to row counts when values, relationships, or semantics can drift.

## Cutover Gate

Require all of the following before moving authority to the new path:

- complete or explicitly bounded backfill with no unexplained reconciliation drift;
- current provider, application, worker, and consumer compatibility evidence;
- acceptable database and service health throughout the soak period;
- an executable rollback or forward-recovery action with an available owner;
- confirmation that no untracked writer can continue updating only the old path;
- authorization from the named cutover decision owner.

After cutover, keep the old path available and read-only when practical until the observation window closes.

## Choose Recovery Direction

Prefer rollback when the old path remains complete, the schema change is reversible, writes can be reconciled, and rollback time fits the recovery objective. Prefer forward repair when data has been transformed irreversibly, new writes cannot safely map backward, or rolling back would create greater inconsistency.

Use restore only with a clear recovery point, understood data-loss window, isolated target, validated credentials, and a reconciliation plan for writes after the backup. Treat restore as an operational procedure, not a magic inverse migration.

## Recovery Runbook

1. Stop the current stage and prevent additional incompatible writes.
2. Preserve logs, migration state, checkpoints, failed rows, and the exact baseline.
3. Assess integrity, affected consumers, replication, and service impact.
4. Choose rollback, forward repair, or restore with the authorized owner.
5. Execute one recovery path and verify its intermediate conditions.
6. Reconcile writes made during the failure window.
7. Re-run schema, data, application, and operational checks.
8. Reopen traffic only after the recovery gate passes.
9. Preserve decisions, evidence, residual risk, and corrective actions.

Escalate to incident response when impact extends beyond the migration team's controlled window or threatens availability, security, or data integrity.

## Evidence Record

For each stage, record the baseline and target revision, start and finish time, owner, commands, affected range, checkpoints, verification queries, observed metrics, exceptions, threshold decisions, recovery readiness, approval, and next permitted action.
