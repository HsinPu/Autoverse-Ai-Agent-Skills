---
name: git-advanced
description: Advanced Git workflow guide for worktrees, bisect, interactive rebase, recovery, hooks, and history repair. Use when a Git task needs deeper control than basic commits, branches, merges, or push/pull flows.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Git Advanced

Use this skill when the task needs advanced Git control.

## Workflow

1. Confirm the repo state and the exact goal before changing history.
2. Choose the narrowest advanced command path:
   - worktrees for parallel branches or isolated checkouts
   - bisect for regression hunting
   - rebase for history cleanup or commit shaping
   - reflog / reset / restore for recovery
   - hooks for commit or workflow enforcement
3. Prefer the safest non-destructive option first.
4. Explain the impact before any history rewrite or recovery step.
5. Verify the result with the smallest proof that the repo is healthy again.

## Rules

- Do not use advanced commands when a basic git flow is enough.
- Treat history rewrite as a deliberate action, not a default.
- Preserve unrelated user changes unless the user explicitly asks otherwise.
- Use worktrees instead of ad hoc directory copies when parallel work is needed.

## Handoff

- For ordinary commits, branches, and conflict handling, use `git-operations`.
- For GitHub issues, PRs, and `gh` workflows, use `github-operations`.
