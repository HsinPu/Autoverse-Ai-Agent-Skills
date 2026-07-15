---
name: session-handoff
description: Create and resume a compact, evidence-linked handoff for work that must continue in another agent, tool, or session. Use when pausing non-trivial work, approaching a context boundary, transferring ownership, or resuming from a prior handoff that must be checked against the current repository revision and working tree.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
reference-source: mattpocock/skills
reference-revision: e9fcdf95b402d360f90f1db8d776d5dd450f9234
reference-license: MIT
---

# Session Handoff

Preserve only the state a new worker needs to continue safely, then verify that state before resuming.

## Create A Handoff

1. Identify the next worker, expected continuation point, and requested outcome.
2. Capture workspace identity, branch, revision, dirty-state summary, active environment, and relevant tool constraints.
3. Record completed work, accepted decisions, current evidence, failed or skipped checks, blockers, and unresolved questions.
4. Name the exact next safe action and its done condition.
5. Link to existing specs, decisions, diffs, commits, logs, or artifacts instead of duplicating their contents.
6. Name the Skills or roles likely needed next and explain the route briefly.
7. Remove secrets, credentials, tokens, personal data, and unnecessary copied content.
8. Store the handoff where the user or repository convention requires. If no durable file is requested or conventional, return it inline rather than inventing a new project directory.

Read [references/handoff-record.md](references/handoff-record.md) when a durable Markdown handoff is needed.

## Resume From A Handoff

1. Treat the handoff as a dated claim, not current truth.
2. Verify workspace, branch, revision, dirty state, referenced files, task status, and external dependencies.
3. Compare the stated next action with current user intent and repository instructions.
4. Mark stale, missing, or contradictory claims before continuing.
5. Reconstruct only the minimum context needed for the next safe action.
6. Update or close the handoff after material progress if the workflow will cross another session boundary.

## Quality Rules

- Keep current state separate from history and future suggestions.
- Include exact verification commands and observed results when they affect confidence.
- Do not call work complete merely because a handoff exists.
- Do not copy whole specifications, diffs, logs, or conversations into the handoff.
- Do not hide dirty files or unverified assumptions.
- Do not include secrets even if the next worker is expected to have equivalent access.
- Prefer one explicit next action over a vague list of possibilities.

## Handoff

- Use `todo-first` for live in-session progress tracking.
- Use `multi-session-planning` for the longer dependency map and session sequence.
- Use `context-governance` for durable lessons that should outlive the task.
- Use `terminal-ops` to refresh repository and command evidence.
- Use `git-operations` only when a Git action is authorized.
