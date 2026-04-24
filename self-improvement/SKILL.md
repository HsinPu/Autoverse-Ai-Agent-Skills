---
name: self-improvement
description: Continuous improvement workflow for logging learnings, errors, and feature requests into project-local memory files. Use when a command fails, the user corrects an answer, a tool behaves unexpectedly, or a better recurring approach is found.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Self-Improvement

Use this skill to capture repeatable lessons and mistakes.

## Workflow

1. Log the issue or learning while the context is fresh.
2. Record enough detail to reproduce or apply the lesson later.
3. Mark the entry with priority, status, and area.
4. Promote broadly useful lessons into project memory files when appropriate.
5. Revisit existing entries before repeating a similar task.

## Rules

- Keep entries specific and searchable.
- Separate errors, learnings, and feature requests.
- Link related entries when the same pattern repeats.
- Promote reusable lessons into long-lived project guidance.

## Handoff

- For general repo memory patterns, use `memory-setup` if the project has a memory system.
- For code changes driven by the learning, use `code-refactoring` or the relevant stack skill.
