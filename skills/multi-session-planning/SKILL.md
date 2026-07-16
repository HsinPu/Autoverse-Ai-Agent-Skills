---
name: multi-session-planning
description: Plan work that spans multiple sessions, agents, tools, or milestones by mapping decisions, dependencies, ready work, unknown regions, ownership, checkpoints, and replanning triggers. Use when a task cannot be completed safely in one context window or one verified implementation slice and needs a durable execution map without pretending unresolved work is already specifiable.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/Autoverse-Ai-Agent-Skills"
  reference-source: "mattpocock/skills"
  reference-license: "MIT"
  reference-revision: "e9fcdf95b402d360f90f1db8d776d5dd450f9234"
---

# Multi-Session Planning

Build a durable map for long-running work while keeping the next executable step honest and small.

## When This Adds Value

Use this Skill when the work has several decision or dependency layers, will cross context boundaries, has multiple owners, or contains areas that cannot yet be described as implementation tasks.

Use `todo-first` for a live task list inside one session. Use `incremental-implementation` when an approved code change only needs safe implementation slices.

## Workflow

1. Define the outcome, non-goals, success evidence, constraints, and planning horizon.
2. Inventory known decisions, discoverable facts, executable work, unresolved choices, external dependencies, and deliberately deferred areas.
3. Create nodes for decisions and work units. Connect only real prerequisite relationships.
4. Identify milestones that produce reviewable artifacts or reduce meaningful uncertainty.
5. Determine the current executable set: items whose prerequisites, authority, environment, and acceptance evidence are available now.
6. Assign one owner for each item. Mark parallel-safe, sequential, or shared-state work.
7. Select the next session around one primary decision or independently verifiable outcome; attach bounded research subtasks only when they inform it.
8. Define the checkpoint and handoff evidence required before the session closes.
9. Replan when evidence invalidates an assumption, a dependency changes, ownership conflicts, or the next item cannot be specified honestly.

## Node Types

| Type | Meaning | Ready when |
|---|---|---|
| Decision | A choice that changes downstream scope or design | Evidence and an authorized owner are available |
| Discovery | A fact can be resolved through bounded inspection or research | Scope and proof source are clear |
| Delivery | An independently verifiable artifact or behavior can be produced | Dependencies and acceptance evidence are satisfied |
| External | Another system, person, approval, budget, or credential is required | The dependency is fulfilled and current |
| Deferred | Intentionally outside the active planning horizon | A named trigger brings it back into scope |

Do not convert an unresolved decision into a delivery task just to make the plan look complete.

## Ownership And Parallelism

- Give each mutable artifact one active owner at a time.
- Parallelize read-only discovery and independent artifacts.
- Keep work sequential when items share state, require an earlier decision, or modify overlapping files.
- Record who can approve, who can execute, and who only supplies evidence.
- Stop duplicate work when two sessions discover they own the same decision or artifact.

## Checkpoint Contract

Every session boundary should record:

- node or milestone completed;
- decisions accepted or still open;
- artifacts changed and current revision;
- verification passed, failed, or skipped;
- newly discovered dependencies or exclusions;
- next executable item and its prerequisites;
- plan changes and why they were needed.

Use `session-handoff` for the compact continuation record rather than copying the full plan into conversation history.

## Output

Produce a decision-and-work map, dependency relationships, milestones, current executable set, ownership and parallelism notes, next-session charter, checkpoints, and replanning triggers. Keep unknown areas visibly unknown.

Store the map in an existing project planning location only when the user requests a durable artifact or the active workflow explicitly owns that document. Otherwise return it inline, state that it is not yet durable across sessions, and use `session-handoff` if continuation is required. Do not invent a repository directory merely to satisfy the word "durable."

## Handoff

- Use `requirements-deep-dive` for unresolved stakeholder choices.
- Use `domain-modeling` for language, invariants, lifecycle, and ownership decisions.
- Use `spec-flow` to turn approved outcomes into issue-ready work units.
- Use `subagent-architecture` to execute parallel-safe units with agent ownership.
- Use `incremental-implementation` for verified code-change slices.
- Use `session-handoff` at every cross-session continuation point.
