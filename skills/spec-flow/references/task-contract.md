# Dependency-Aware Task Contract

Use this reference when a specification must become issue-ready work items or an execution queue.

## Task Fields

| Field | Purpose |
|---|---|
| `id` | Stable identifier used by dependencies and status updates |
| `outcome` | User-visible, operational, or contract-level result owned by the task |
| `scope` | Work included in this item |
| `excluded` | Nearby work intentionally outside the item |
| `blocked_by` | Task IDs or named decisions that must finish first |
| `acceptance` | Observable behavior or state required for completion |
| `evidence` | Test, command, artifact, inspection, or approval that proves acceptance |
| `owner` | Responsible role when ownership is known |
| `readiness` | `ready`, `blocked`, or `deferred` |
| `risk` | Compatibility, migration, security, external-action, or rollback concern |

## Minimal Template

```markdown
### TASK-001 — <outcome>

- Scope:
- Excluded:
- Blocked by: none
- Acceptance:
- Evidence:
- Owner:
- Readiness: ready
- Risk and recovery:
```

## Dependency Review

Before publishing tasks:

1. Confirm each dependency represents a real prerequisite rather than a preferred order.
2. Reject dependency cycles or replace them with a shared prerequisite task.
3. Identify the blocking edges whose completion unlocks the most useful work.
4. Keep research or decision tasks separate when implementation cannot be specified honestly yet.
5. Confirm the ready set can be executed and verified without relying on hidden unfinished work.
6. Ask the user or plan owner to approve granularity and dependencies before creating external issues.

## Slice Selection

Prefer an end-to-end slice when it can deliver one independently testable behavior. Use expand-migrate-contract for shared interfaces, schemas, or broad mechanical migrations. Avoid tasks that are only "backend", "frontend", or "tests" unless that layer is independently releasable or verifiable.

## Stability

Keep behavior, constraints, and evidence in the task. Avoid exact line numbers and speculative file lists that will become stale before execution. Link to the governing specification or decision record instead of duplicating it.
