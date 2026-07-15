---
name: spec-flow
description: Turn clear requirements or an approved solution direction into acceptance criteria, dependency-aware work items, and an executable delivery path. Use for implementation planning, issue-ready vertical slices, readiness analysis, and delivery sequencing after the intended direction is understood; use specification-authoring instead when the requested deliverable is a formal technical specification with a prescribed document structure.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
reference-source: mattpocock/skills
reference-revision: e9fcdf95b402d360f90f1db8d776d5dd450f9234
reference-license: MIT
---

# Spec Flow

Convert an agreed direction into work that can be understood, scheduled, verified, and safely revised.

## Workflow

1. Restate the approved outcome, scope, non-goals, constraints, and source decisions.
2. Define observable acceptance criteria and the evidence required to prove each one.
3. Identify behavioral, data, API, migration, release, and operational boundaries.
4. Build a dependency graph before assigning order or owners.
5. Split work into the smallest independently verifiable units that still deliver end-to-end value.
6. Mark each unit ready, blocked, or deferred; record the exact prerequisite for blocked work.
7. Review task granularity, dependency direction, rollout risk, and exclusions before publishing or executing the plan.
8. Update the spec and dependency graph when implementation reveals a changed fact or invalid assumption.

## Work-Item Design

Prefer a vertical slice that includes the behavior, contract, implementation, and proof needed for one usable outcome. Avoid splitting only by technical layer when doing so creates several unverifiable half-features.

For broad mechanical migrations, use expand-migrate-contract instead:

1. expand the contract or introduce compatibility;
2. migrate producers and consumers in safe groups;
3. prove no callers depend on the old form;
4. contract the compatibility surface.

Read [references/task-contract.md](references/task-contract.md) when producing issue-ready tasks, dependency graphs, or acceptance/evidence fields.

## Readiness Rules

A work item is ready only when:

- its owned outcome and exclusions are clear;
- every prerequisite is satisfied or explicitly included;
- acceptance evidence can be produced without relying on unfinished siblings;
- authority, environment, fixtures, and external access are available;
- the task does not require an unresolved product, architecture, safety, or migration decision.

Do not hide an unresolved decision inside an implementation ticket. Route it back to discovery or the authorized decision owner.

## Quality Rules

- Use stable task IDs and explicit `blocked_by` links.
- Describe behavior and evidence rather than brittle step-by-step file edits.
- Name likely owner paths only when they are verified and useful for orientation.
- Keep refactoring, behavior changes, formatting churn, and cleanup separable when they have different risk.
- Include rollback, compatibility, or recovery work when a slice changes persisted data, public contracts, or deployment behavior.
- Treat approval of task granularity as separate from approval to perform consequential external actions.

## Output

Produce:

- concise specification and non-goals;
- acceptance criteria with evidence;
- dependency graph or ordered work-item table;
- ready, blocked, and deferred sets;
- key risks, decision owners, and replanning triggers;
- first safe executable unit, or explicit blocker evidence when the ready set is empty.

## Handoff

- Use `solution-discovery` first when the direction is not approved.
- Use `requirements-deep-dive` when critical choices or contradictions need a deliberate interview.
- Use `domain-modeling` when terminology, invariants, ownership, or state transitions are unclear.
- Use `specification-authoring` for formal technical specifications.
- Use `multi-session-planning` when the dependency map will span several work sessions or parallel owners.
- Use `code-change-workflow` to trace implementation ownership before editing.
- Use `incremental-implementation` to execute the approved slices with verification checkpoints.
