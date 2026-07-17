---
name: todo-first
description: Runtime-neutral task-planning and progress-tracking guide for multi-step or non-trivial work. Use when work has 3+ meaningful steps, spans files or commands, includes verification, requires many tool calls, risks losing context, or bundles several requests. Track it with Codex update_plan, another runtime's native todo or plan mechanism, or an inline checklist when no planning tool is available; skip planning overhead for trivial or purely informational requests.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Todo-First Execution

Keep the current plan visible and accurate without coupling the workflow to one agent runtime.

## Choose The Planning Mechanism

Use the first available mechanism that the active runtime supports:

1. In Codex, use `update_plan`.
2. In another runtime, use its native todo, task, or plan tool.
3. When no planning tool exists, maintain a short inline Markdown checklist in working updates.

Do not claim to have called a tool that is unavailable. Do not pause a task merely because the preferred planning tool does not exist.

## When To Plan

Create a plan when the work:

- has three or more meaningful steps;
- spans multiple files, systems, commands, or deliverables;
- includes tests, builds, reviews, deployment checks, or other verification;
- contains dependencies, approval gates, risky operations, or several user requests;
- is likely to cross many tool calls or lose important context.

Skip a plan for one-step edits, short factual answers, simple lookups, or work whose next action and completion condition are already obvious.

For borderline cases, start work directly. Create a plan after exploration only if the discovered scope warrants one.

## Write Useful Plan Items

- Use a concrete verb and an observable outcome.
- Keep items independently understandable and verifiable.
- Prefer 3-8 meaningful items over a list of micro-steps.
- Include the relevant verification as a plan item.
- Keep research, decisions, implementation, and validation distinct when they have different completion evidence.
- Mark blocked or cancelled work explicitly when the mechanism supports it; otherwise note the reason beside the checklist item.

Good items:

- Locate the settings-page entry point.
- Add dark-mode state and persistence.
- Run focused tests and inspect the final diff.

Weak items:

- Work on the feature.
- Do stuff.
- Finish everything.

## Maintain Progress

1. Start with all planned items pending unless the runtime uses different native states.
2. Mark only the active item in progress when the mechanism supports an active state.
3. Mark an item complete only after its outcome and required evidence exist.
4. Update the plan when scope, dependencies, or facts change; do not preserve a stale plan for appearance.
5. Record why an item is blocked, deferred, or cancelled.
6. Before finishing, reconcile every item with the actual result and call out skipped verification.

## Inline Checklist Fallback

When no planning tool is available, use a compact checklist such as:

```markdown
- [x] Inspect the current behavior and owner files.
- [ ] Implement the smallest safe change. (active)
- [ ] Run focused validation and review the diff.
```

Refresh the same checklist instead of emitting disconnected copies. Keep detailed reasoning and logs outside it.

## Long-Running Work

Use `multi-session-planning` when the dependency map spans several sessions, agents, tools, or milestones. Use `session-handoff` before transferring or pausing non-trivial work. A live plan tracks execution; it does not replace durable decisions, evidence, or a continuation record.

## Quality Check

- Does each item state a meaningful outcome?
- Is the active item clear?
- Does completion match observed evidence?
- Has the plan changed when reality changed?
- Is the mechanism native to the current runtime, with an inline fallback when needed?
