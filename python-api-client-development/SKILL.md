---
name: python-api-client-development
description: Python API client and SDK development guide covering OpenAPI-based clients, auth handling, pagination, retries, error mapping, transport setup, and generated client maintenance. Use when building or refactoring a Python client library or SDK that talks to an external HTTP API, including LobeHub OpenAPI-style integrations.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Python API Client Development

Use this skill when the task is to build or maintain a Python SDK or HTTP API client.

## When To Use

- Build a typed client for an HTTP API or OpenAPI spec
- Add auth, pagination, retries, timeouts, or transport configuration
- Map remote errors into local exceptions or result types
- Maintain generated client code or hand-written SDK wrappers
- Prepare a client library for reuse by other Python code

## Boundaries

- Use `python-backend-development` for server-side app structure.
- Use `python-packaging-release` for versioning, wheels, and publishing.
- Use `python-security-hardening` for trust boundaries and secret handling.
- Use `python-testing-engineering` for test implementation details.

## Workflow

1. Identify the remote API contract and the smallest useful surface.
2. Decide sync, async, or both.
3. Make auth, base URL, and timeouts explicit.
4. Wrap pagination and retries in reusable helpers.
5. Map remote errors into stable client exceptions.
6. Verify the client against representative API responses.

## Client Rules

- Prefer a narrow, typed surface over a giant generic wrapper.
- Keep request and response models explicit.
- Normalize transport and serialization behavior in one place.
- Preserve useful remote error details without leaking sensitive data.
- Keep generated code isolated from custom hand-written logic when possible.

## Handoff

- For packaging and publishing the SDK, hand off to `python-packaging-release`.
- For hardening secrets and trust boundaries, hand off to `python-security-hardening`.
- For transport or service-side implementation details, hand off to `python-backend-development`.

- See [reference/api-client-workflows.md](reference/api-client-workflows.md) for deeper guidance.
