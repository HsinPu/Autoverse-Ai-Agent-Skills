---
name: github-operations
description: GitHub workflow guide for issues, pull requests, releases, CI checks, and API queries via gh. Use when checking repo status, reviewing workflow runs, commenting on issues or PRs, or automating GitHub tasks from the terminal.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# GitHub Operations

Use this skill when the task lives on GitHub, not just in local git history or local branches.

## When To Use

- Check PR status, review comments, CI results, or release metadata
- Create, update, or inspect issues and pull requests
- Fetch repo metadata or run ad hoc queries through the GitHub API
- Re-run or inspect workflow jobs after a failed check

## Workflow

1. Confirm `gh` is authenticated and the repo is reachable.
2. Use the narrowest command that answers the question.
3. Prefer read-only commands first: `gh pr view`, `gh pr checks`, `gh run view`, `gh issue view`.
4. Use `gh api` only when the built-in command does not cover the query.
5. If the task is local git work, hand off to `git-operations`.

## Common Commands

- `gh auth status`
- `gh pr list`
- `gh pr view <num>`
- `gh pr checks <num>`
- `gh pr comment <num>`
- `gh issue list`
- `gh issue view <num>`
- `gh issue comment <num>`
- `gh run list`
- `gh run view <id> --log`
- `gh release list`
- `gh release view <tag>`
- `gh issue create`
- `gh api repos/:owner/:repo/...`

## Output

- Include the repo, issue, PR, or release reference in every answer.
- If a check failed, include the failing job and the next action.
- If auth is missing, say so immediately.

## Handoff

- For local commits, branches, or conflict resolution, use `git-operations`.
- For code review findings, use `code-review`.
