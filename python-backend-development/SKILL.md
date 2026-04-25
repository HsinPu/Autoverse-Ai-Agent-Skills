---
name: python-backend-development
description: Python backend development guide covering Django, Flask, ASGI/WSGI apps, routers, middleware, settings, ORM, migrations, background workers, and server-side web app structure. Use when building or refactoring Python web backends or DB-backed services, and when the task is framework structure or application flow rather than API contract design.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Python Backend Development

Use this skill when the task is a Python web backend, service, or server-side application.

## When To Use

- Build Django, Flask, or ASGI/WSGI applications
- Organize routers, views, middleware, settings, and app modules
- Wire ORM models, repositories, migrations, and background workers
- Design server-side request flow, dependency wiring, and app startup

## Boundaries

- Use `api-contract-design` for request/response shapes, pagination, idempotency, and versioning.
- Use `python-development` for general Python architecture, packaging, typing, and style.
- Use `python-automation-scripting` for local CLI or filesystem automation.

## Workflow

1. Identify the framework and entry points.
2. Separate HTTP/UI concerns from domain and data access.
3. Keep settings and environment loading explicit.
4. Wire dependencies through constructors or framework DI.
5. Keep migrations, background jobs, and startup hooks visible.
6. Verify the request path with a focused integration test.

## Framework Choice

| Stack | Use When | Notes |
|---|---|---|
| Django | Full web app with ORM and admin | Use app separation, settings modules, migrations |
| Flask | Lightweight app or service | Prefer factory pattern and blueprints |
| ASGI / FastAPI | Async service or typed API | Keep route handlers thin |

## Handoff

- For API surface and consumer compatibility, hand off to `api-contract-design`.
- For deployment and rollout checks, hand off to `deployment-operations`.
- For general Python coding conventions, hand off to `python-development`.

- See [reference/backend-workflows.md](reference/backend-workflows.md) for deeper guidance.
