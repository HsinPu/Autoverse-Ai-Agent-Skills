---
name: incremental-implementation
description: Large-change slicing workflow for code changes that should not land as one diff. Use after or with code-change-workflow when feature work, refactors, migrations, or multi-file edits need small verified slices, repeated tests, checkpoints, intermediate commits, reviewability, rollback, or later inspection.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Incremental Implementation

Use this skill when a requested code change is too large, risky, or broad to land safely in one pass. For existing-code edits, use it after or alongside `code-change-workflow` so the first slice is based on the real owner path and verification path.

## Goal

- Turn a large code task into small, dependency-aware slices.
- Keep every slice narrow enough to understand, verify, commit, and roll back.
- Preserve a useful history so later debugging can inspect one logical change at a time.
- Avoid mixing behavior changes, refactors, formatting churn, and migration cleanup in one diff.

## When To Use

Use this skill when any condition applies:

- The `code-change-workflow` inspection shows the task cannot stay as one small safe edit.
- The change touches multiple files, modules, services, screens, commands, schemas, or tests.
- The implementation could take more than one focused edit-and-verify cycle.
- The user asks to reduce risk, make future inspection easier, or avoid one large code change.
- A refactor must preserve behavior while moving ownership, boundaries, or call sites.
- A migration needs staged rollout, compatibility, backfill, cutover, cleanup, or rollback points.
- The work would be hard to review if completed as one monolithic diff.

Do not use it for a single obvious edit where one targeted verification is enough.

## Routing Rules

- Do not use this as the first and only skill for an unknown existing code path; start with `code-change-workflow` to find ownership, callers, constraints, and verification.
- Use this to plan slice order, checkpoints, and commit boundaries once the affected surface is known.
- Pair with `code-refactoring` only for behavior-preserving cleanup slices.
- Pair with stack-specific skills only inside a slice, not as a replacement for slice planning.
- Keep slice tracking separate from implementation details; use `todo-first` when the slice list has meaningful status.

## Slice Planning

Before editing, define:

1. **Goal**: the final behavior or structure being reached.
2. **Constraints**: behavior parity, public API stability, data compatibility, UI parity, or rollout limits.
3. **Current proof**: tests, build commands, smoke checks, fixtures, snapshots, or manual checks that can prove each slice.
4. **Slice order**: the smallest sequence that keeps the system working after every step.
5. **Stop points**: commits, checkpoints, or handoff notes where work can pause safely.

Prefer slices that are self-contained and reviewable:

- introduce a helper or abstraction before moving callers;
- migrate one caller group, route, command, component, or module at a time;
- add compatibility code before switching behavior;
- update tests with the slice that changes the contract;
- remove old code only after every caller has moved and verification passes.

## Execution Cycle

Repeat this cycle for each slice:

1. State the slice goal and done criteria.
2. Inspect the affected owner code and avoid unrelated cleanup.
3. Make the smallest code change that completes the slice.
4. Run the narrowest meaningful verification.
5. Fix failures before expanding scope.
6. Inspect the diff and remove accidental churn.
7. Commit or record the checkpoint when the slice is safe.
8. Re-plan the next slice using what changed.

If a slice grows, split it before continuing.

## Slice Quality Rules

- One slice should have one reason to change.
- Keep behavior changes separate from behavior-preserving refactors.
- Keep formatting-only changes separate from semantic changes.
- Do not edit overlapping file sets in parallel unless ownership is clear.
- Keep public contracts stable unless the slice explicitly changes the contract.
- Prefer targeted tests first; broaden verification when the touched surface is shared.
- Never claim a slice is complete without naming the verification that passed.

## Large-Change Patterns

- **Branch by abstraction**: add an abstraction around old code, move callers gradually, introduce the new implementation, switch callers, then delete the old path.
- **Parallel change**: expand the contract first, support old and new forms together, migrate producers/consumers, then contract away the old form.
- **Feature flag or config gate**: land new behavior behind a gate when partial rollout or rollback is needed.
- **Compatibility shim**: preserve old imports, routes, methods, or data shape while callers move.
- **Strangler migration**: route one path or capability at a time to the new implementation.

## Stop And Reassess When

- Verification fails for reasons unrelated to the current slice.
- The slice requires a public API, schema, auth, billing, or deployment behavior change.
- A dependency cycle, ownership conflict, or hidden caller changes the planned order.
- The diff includes unrelated refactors, generated output, or broad formatting churn.
- The next safe step is unclear.

## Handoff

- Use `todo-first` to track the slice list and status during execution.
- Use `multi-session-planning` when the broader dependency and decision map extends beyond implementation slices or one work session.
- Use `session-handoff` when a verified slice or checkpoint must be resumed by another session, agent, or tool.
- Use `code-change-workflow` to understand existing behavior before the first slice.
- Use `code-refactoring` when the slice is behavior-preserving cleanup.
- Use `test-driven-development` inside slices whose behavior can be expressed as an automated test.
- Use `testing-strategy` when choosing the right verification depth.
- Use `verification-before-completion` before marking a slice or the overall change complete.
- Use `pipeline-review` at stage boundaries that require an independent acceptance decision.
- Use `project-architecture-review` when the work needs architecture options before slicing.
- Use stack-specific skills for implementation details inside a slice.
