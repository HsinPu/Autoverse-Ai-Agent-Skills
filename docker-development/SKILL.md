---
name: docker-development
description: Docker development workflow for Dockerfiles, multi-stage builds, Docker Compose, image optimization, build contexts, healthchecks, environment variables, volumes, networking, and container security. Use when containerizing an application, debugging Docker builds, or improving local container workflows.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Docker Development

Use this skill when the task involves Docker images or local container workflows.

## Workflow

1. Identify the runtime, build artifacts, ports, env vars, persistent data, and external services.
2. Write the smallest Dockerfile that builds reproducibly and keeps runtime layers lean.
3. Use multi-stage builds to separate tooling, dependencies, tests, and production runtime.
4. Define Compose services only for dependencies and local workflows the project actually needs.
5. Validate image build, startup, healthcheck, logs, networking, and shutdown behavior.

## Rules

- Keep build context small with `.dockerignore`.
- Do not bake secrets, local credentials, or environment-specific config into images.
- Prefer non-root runtime users when the base image and app support it.
- Pin base image families deliberately; avoid `latest` for reproducible builds.
- Treat healthchecks, signals, and logs as part of container readiness.

## Handoff

- For Kubernetes deployment manifests, use `kubernetes-operations`.
- For CI builds and image publishing, use `github-actions-ci`.
- For production rollout verification, use `deployment-operations`.
