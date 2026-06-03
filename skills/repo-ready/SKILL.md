---
name: repo-ready
description: Repository setup and hygiene workflow for adding professional structure, documentation, CI/CD, quality tooling, and platform configuration. Use when starting a repo, hardening an existing one, or adding README, templates, linting, badges, or release automation.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: MIT
---

# Repo Ready

Use this skill when the task is repo setup or repo hygiene.

## Workflow

1. Inspect the stack and current repo state.
2. Add only the files that fit the project stage and platform.
3. Make every generated file actionable, not placeholder-based.
4. Prefer minimal, stack-specific defaults over generic boilerplate.
5. Verify the repo still builds, tests, or lint checks if the task changes code.

## Rules

- Include only what the repo actually needs.
- Avoid empty templates and TODO stubs.
- Keep docs aligned with the repo's real commands and paths.
- Treat CI, branching, and release config as first-class repo hygiene.

## Handoff

- For README-specific work, use `git-readme-writer`.
- For general docs formatting, use `markdown-writer`.
