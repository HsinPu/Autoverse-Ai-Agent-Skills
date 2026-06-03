---
name: deployment-operations
description: Production deployment and release verification workflow for shipping builds, managing rollout and rollback, running smoke checks, and confirming post-deploy health. Use when code needs to be deployed to an environment or a release needs operational verification.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Deployment Operations

Use this skill when shipping a build and proving the release is healthy.

## Workflow

1. Identify the target environment, artifact, and deploy path.
2. Check config, secrets, migrations, and access before rollout.
3. Deploy using the repo's documented release path.
4. Run smoke checks on the critical user journey and health endpoints.
5. Inspect logs, metrics, and error rates after the change lands.
6. Roll back or stop the rollout if verification fails.

## Rules

- Prefer the existing deploy mechanism over ad hoc commands.
- Treat config and migrations as part of the release.
- Keep the rollout scope as small as possible.
- Do not declare success until post-deploy checks pass.

## Handoff

- For repo setup and release automation, use `repo-ready`.
- For local command execution and proof, use `terminal-ops`.
- For GitHub releases or workflow checks, use `github-operations`.
