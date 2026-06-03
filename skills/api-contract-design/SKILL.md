---
name: api-contract-design
description: API contract design workflow for defining request and response shapes, error models, pagination, idempotency, and versioning so APIs evolve safely without breaking consumers. Use when designing or reviewing a public API or service contract.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# API Contract Design

Use this skill when shaping an API that other clients will depend on.

## Workflow

1. Define the resource model and primary use cases.
2. Specify request and response shapes, including required and optional fields.
3. Standardize error models, status codes, and validation behavior.
4. Decide pagination, filtering, sorting, and idempotency rules.
5. Plan versioning and backward-compatibility rules before release.

## Rules

- Keep contracts explicit and stable.
- Prefer additive change over breaking change.
- Document nullability, defaults, and field evolution.
- Treat client compatibility as part of the design, not an afterthought.

## Handoff

- For implementation details in Spring APIs, use `spring-development`.
- For MCP tool surfaces, use `mcp-creator-design`.
- For spec documents, use `specification-authoring`.
