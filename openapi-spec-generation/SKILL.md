---
name: openapi-spec-generation
description: OpenAPI specification workflow for generating, updating, validating, and reviewing OpenAPI 3.1 specs from code or design-first contracts. Use when creating API specifications, documenting endpoints, generating SDK inputs, or keeping API contract files consistent with implementation.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# OpenAPI Spec Generation

Use this skill when the task is to create or maintain an OpenAPI specification.

## Workflow

1. Identify the API surface, version, authentication, and audiences that depend on the spec.
2. Model paths, operations, schemas, parameters, request bodies, responses, and errors explicitly.
3. Keep examples realistic and aligned with the implementation.
4. Validate the spec for consistency, completeness, and contract drift.
5. Update the spec when the implementation or API contract changes.

## Rules

- Treat the spec as a contract, not just documentation.
- Keep naming stable across request and response schemas.
- Include auth, pagination, errors, and reusable components when they matter to consumers.
- Avoid overfitting the spec to one client library or codebase layout.

## Handoff

- For API design decisions, use `api-contract-design`.
- For generated client/SDK work, use `python-api-client-development` or `typescript-development`.
- For endpoint doc comments, use `api-doc-comments`.
