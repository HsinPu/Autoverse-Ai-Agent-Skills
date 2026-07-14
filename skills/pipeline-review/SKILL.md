---
name: pipeline-review
description: Run an independent, read-only review gate between implementation stages using three-level findings, a stable review-report artifact, explicit ownership, and repeatable review loops. Use after a change set or delivery stage is complete and before merge, release, or the next pipeline stage.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
reference-source: wshobson/agents
reference-license: MIT
---

# Pipeline Review

Use this workflow to separate implementation from acceptance. Keep the reviewer read-only: the reviewer reports defects and evidence but never repairs, stages, commits, or publishes the reviewed change.

## Roles

- **Implementer:** supplies the completed change, intent, test evidence, and known limitations; fixes accepted findings in a later turn.
- **Reviewer:** independently inspects current files, diffs, contracts, and tests; produces findings without editing the change.
- **Coordinator:** preserves the report, routes findings, and starts another review after remediation.
- **Decision owner:** accepts residual risk or authorizes a gate exception. Neither reviewer nor implementer may self-approve an exception.

## Review packet

Require these inputs before review:

- target revision, diff, or explicit file scope;
- intended behavior and acceptance criteria;
- repository guidance and affected public contracts;
- tests and checks actually run, including failures or omissions;
- known risks, migrations, operational effects, and rollback expectations.

If material inputs are missing, record a verification gap instead of guessing.

## Workflow

1. Freeze the review baseline and identify the current stage and next gate.
2. Read the implementation directly; do not rely only on the implementer's summary.
3. Trace changed behavior through callers, data, errors, permissions, compatibility, tests, deployment, and rollback where relevant.
4. Report only reproducible or well-supported findings. Group repeated symptoms under one root cause.
5. Classify every finding using the three levels below and assign a stable ID.
6. Return the structured report. Have the coordinator persist it as the agreed `review-report` artifact.
7. Route accepted findings to an implementer. Do not let the reviewer apply fixes.
8. Re-review the updated baseline, verify each prior finding, inspect remediation regressions, and append a new review round.
9. Pass the gate only when blocking findings are resolved or the decision owner records an explicit risk exception.

## Finding levels

- **Blocker:** likely correctness, security, data-loss, compatibility, or release failure. The gate is closed.
- **Major:** material defect or verification gap that can harm users or operations. The gate stays closed unless the decision owner records a reasoned, time-bounded exception.
- **Advisory:** useful non-blocking improvement. It must not be promoted to a gate failure by preference alone.

Each finding must include location, evidence, failure scenario, impact, acceptance criterion, and confidence. Keep questions and unverified risks outside the finding list.

## `review-report` artifact

Use this stable structure in the response or in a coordinator-owned file:

```markdown
# Review Report

- Review ID:
- Round:
- Baseline:
- Scope:
- Intended behavior:
- Checks reviewed or run:

## Findings

| ID | Level | Location | Evidence and failure | Acceptance criterion | Status |
|---|---|---|---|---|---|

## Verification gaps

## Resolved findings

## Decision

- Verdict: block | conditional | pass
- Required owner actions:
- Risk exceptions and expiry:
- Next review trigger:
```

Append a round or preserve prior finding IDs rather than overwriting history. Only the reviewer may mark a finding verified; only the decision owner may mark risk accepted.

## Loop controls

- Reopen a resolved finding when evidence shows the acceptance criterion no longer holds.
- Stop and escalate when the same finding repeats without new remediation, required evidence is unavailable, or authority for an exception is missing.
- Do not weaken acceptance criteria merely to end the loop.
- Do not run destructive tests, mutate external systems, or exceed the review's authorized scope.
- Do not auto-fix, silently patch, or combine review and implementation in one role.
