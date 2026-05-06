---
name: github-actions-ci
description: GitHub Actions CI workflow guide for designing, writing, debugging, and reviewing workflow YAML, jobs, matrix builds, caching, artifacts, permissions, secrets, pull request checks, and release automation. Use when creating or fixing GitHub Actions pipelines rather than general repository hygiene.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# GitHub Actions CI

Use this skill when the task is specifically about GitHub Actions workflows.

## Workflow

1. Identify the event, branch policy, required checks, and commands the workflow must run.
2. Keep jobs minimal: install, cache, lint, test, build, package, and publish only when needed.
3. Choose runners, matrices, services, artifacts, and cache keys based on the actual stack.
4. Set least-privilege `permissions` and keep secrets out of logs, artifacts, and PR output.
5. Verify YAML syntax, trigger behavior, dependency caching, and failure visibility.

## Rules

- Prefer explicit commands from the repo over guessed package scripts.
- Pin third-party actions to stable versions; use SHAs for sensitive workflows when appropriate.
- Do not grant write permissions unless a job truly publishes, comments, tags, or deploys.
- Split slow optional jobs from required fast feedback when the project can support it.
- Treat CI as product safety: failures should be actionable, not noisy.

## Handoff

- For broader repo hygiene and templates, use `repo-ready`.
- For release verification after deployment, use `deployment-operations`.
- For GitHub API, PR, issue, or check inspection, use `github-operations`.
