---
name: python-backend-development
description: Build, modify, fix, and review Python web backends and services using Django, Flask, FastAPI, ASGI/WSGI, routers, middleware, ORM, migrations, settings, or background workers. Use when Python server-side application flow or framework structure is the primary concern; pair with python-development for general Python implementation.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Python Backend Development

Use this skill when the task is a Python web backend, service, or server-side application.

## Python Baseline Gate

Before planning or editing Python backend code, read the sibling [`../python-development/SKILL.md`](../python-development/SKILL.md), even when the runtime omitted it from the initial Skill list. Keep this skill responsible for server framework structure and request flow; keep `python-development` responsible for Python language, package, typing, error, resource, and general implementation decisions. Add `python-testing-engineering` when Python test implementation is a material part of the request.

## When To Use

- Build Django, Flask, or ASGI/WSGI applications
- Organize routers, views, middleware, settings, and app modules
- Wire ORM models, repositories, migrations, and background workers
- Design server-side request flow, dependency wiring, and app startup

## Boundaries

- Use `api-contract-design` for request/response shapes, pagination, idempotency, and versioning.
- Use `project-architecture-review` for whole-project architecture diagnosis, target-shape comparison, or migration planning before backend implementation.
- Use `python-development` for Python package layout, packaging, typing, and style.
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
