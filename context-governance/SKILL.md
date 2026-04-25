---
name: context-governance
description: Context and lessons governance workflow for managing agent memory, context budget, and skill navigation. Use when a workflow needs to keep notes, prune repetition, or maintain reusable project memory.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Context Governance

Use this skill to keep agent work focused and reusable.

## Workflow

1. Capture only the durable lesson or note.
2. Drop repeated context that no longer changes the decision.
3. Separate memory, task notes, and final deliverables.
4. Review nearby skills before inventing a new pattern.
5. Prefer a small number of clear memory entries over long narratives.

## Rules

- Keep context short and searchable.
- Promote reusable guidance into project memory when it helps future tasks.
- Avoid duplicating the same lesson in multiple places.

## Handoff

- For task-level learning logs, use `self-improvement`.
- For multi-step planning or execution tracking, use `todo-first`.
