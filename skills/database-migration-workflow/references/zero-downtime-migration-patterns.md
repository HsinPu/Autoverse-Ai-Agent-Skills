# Zero-Downtime Migration Patterns

Choose a pattern from the compatibility problem and database capabilities. Verify engine-specific lock and transaction behavior before treating any operation as online.

## Pattern Selection

| Change | Preferred pattern | Main risk |
|---|---|---|
| Add optional data without changing old behavior | Additive expansion | Hidden defaults or old readers |
| Rename or change an incompatible column | Shadow column and staged cutover | Divergent old and new values |
| Replace a table or storage model | Shadow table and controlled copy | Write capture and reconciliation |
| Move reads or writes gradually | Dual path with comparison | Partial failure and split authority |
| Add a large index or validate a constraint | Online build or deferred validation | Locks, resource pressure, long transactions |
| Transform a large historical dataset | Batched resumable backfill | Lag, retries, hot rows, and drift |

## Expand-Migrate-Contract

1. Expand with additive schema that both old and new application versions tolerate.
2. Deploy application code that can operate during the compatibility window.
3. Migrate or backfill data while keeping old behavior valid.
4. Cut traffic to the new path and observe it for the agreed soak period.
5. Contract only after every consumer and rollback target no longer needs the old structure.

Keep expansion and contraction in different releases. Treat the compatibility window as an explicit operational state, not a brief implementation detail.

## Shadow Column Or Table

Create a new destination rather than mutating incompatible data in place. Backfill historical rows, capture ongoing changes, compare source and destination, then switch consumers. Define which side wins during conflicts and how missed writes are replayed. Keep the source available until the destination is authoritative and the recovery window closes.

Prefer a shadow structure for type changes, normalization changes, key changes, encryption changes, or transformations that cannot be reversed safely in place.

## Dual Read And Dual Write

Use a dual path only with explicit authority rules:

- select the source of truth for each stage;
- define write order, retry behavior, and partial-failure handling;
- make operations idempotent or assign stable operation identifiers;
- reconcile both paths and alert on drift;
- measure the extra latency and load;
- define the exact condition for removing the old path.

Prefer shadow writes plus comparison before switching reads. Avoid indefinite dual writes because they turn temporary migration logic into a permanent distributed consistency problem.

## Online Indexes And Constraints

Use the engine's supported online or concurrent operation only after checking its version, provider restrictions, failure cleanup, transaction rules, and resource cost. Separate index creation from query cutover. Add constraints in a non-blocking or not-yet-validated state when supported, clean existing violations, validate separately, then enforce new writes.

Do not infer zero downtime from the command name. Test lock acquisition, cancellation, retry, replication, and long-running transaction behavior at representative scale.

## Batched Backfill

Partition work by a stable key or checkpoint. Keep each batch bounded, idempotent, restartable, and observable. Throttle against database health rather than a fixed optimistic rate. Record attempted, changed, skipped, failed, and reconciled rows. Handle rows modified during the backfill through change capture, a final delta pass, or a protected cutover window.

Avoid a single unbounded transaction, offset pagination over changing data, and retries that apply non-idempotent transformations twice.

## Compatibility Matrix

Test every supported combination that may coexist:

| Application | Old schema | Expanded schema | Contracted schema |
|---|---|---|---|
| Old version | Baseline | Must remain safe during rollout | Must be retired before contract |
| New version | Usually unsupported | Target operating state | Final operating state |
| Workers and jobs | Record separately | Verify deploy and retry order | Remove old dependencies first |

Include replicas, analytics jobs, change-data-capture connectors, scripts, and external consumers when they observe the migrated structure.
