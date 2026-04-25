---
name: terminal-ops
description: Evidence-first repository execution workflow for running commands, checking repo state, debugging failures, and verifying narrow fixes. Use when the user needs exact command output, git state, or a proven local change.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Terminal Ops

Use this skill when proof matters.

## Workflow

1. Inspect the repo state before editing.
2. Read the failing surface before changing anything.
3. Run the smallest useful command that proves or disproves the fix.
4. Re-run the same proof after the change.
5. Report exactly what was executed and verified.

## Rules

- Prefer repo-local scripts over ad hoc commands.
- Do not claim a fix until verification passes.
- Keep the scope narrow and evidence-based.
- Do not touch adjacent code, comments, or formatting unless the task requires it.
- If the task is unclear, state the assumption or stop and ask before making broad changes.
- Treat every changed line as something that should trace directly to the request.

## Handoff

- For git-specific work, use `git-operations`.
- For command-oriented task delegation, use `coding-agent`.
