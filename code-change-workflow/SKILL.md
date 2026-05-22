---
name: code-change-workflow
description: Pre-change code workflow for understanding existing behavior before editing. Use when modifying code in an existing project to inspect entry points, call chains, data flow, tests, constraints, and verification paths before making the smallest safe change.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Code Change Workflow

Use this skill before changing code in an existing project when the correct edit depends on understanding current behavior, flow, ownership, or verification paths.

## Core Scope

- Bug fixes, feature changes, refactors, and behavior adjustments in existing code
- Tasks with unclear entry points, data flow, state flow, or side effects
- Multi-file changes where a small edit can affect callers, tests, APIs, UI, or persistence
- Codebases where local conventions matter more than generic implementation advice

## Workflow

1. Read the request and local instructions such as `AGENTS.md`.
2. Inspect repository state and avoid mixing unrelated user changes into the task.
3. Locate the entry point: route, command, component, handler, service, job, test, or config.
4. Trace the current flow through callers, callees, data models, state, side effects, and error paths.
5. Identify existing tests, fixtures, scripts, logs, docs, or manual checks that prove behavior.
6. Define the smallest safe change that fits existing patterns.
7. Edit only the files needed for that change.
8. Run the narrowest useful verification, then broaden only if risk justifies it.
9. Report what flow was understood, what changed, and what was verified.

## What To Inspect First

- Entry points: routes, controllers, commands, event handlers, UI pages, jobs, hooks, or scripts.
- Boundaries: API contracts, database schema, auth checks, feature flags, environment variables, and external services.
- Data flow: input shape, validation, transformation, persistence, caching, and output shape.
- State flow: local state, stores, context, sessions, queues, transactions, retries, and background work.
- Error flow: exceptions, fallback behavior, user-visible errors, logging, metrics, and rollback behavior.
- Tests: unit, integration, e2e, snapshots, fixtures, mocks, smoke commands, and CI checks.

## Change Rules

- Do not edit before finding the relevant owner code path.
- Prefer local patterns over a new abstraction.
- Keep changes surgical; every edited line should trace to the request.
- Do not refactor adjacent code unless it is required to make the requested change safe.
- Preserve public contracts unless the user explicitly asked for a breaking change.
- If the change affects persistence, auth, billing, security, or public APIs, state the impact before editing when possible.

## Verification Rules

- For bug fixes, reproduce or identify the failing path before fixing when feasible.
- For UI changes, verify the affected screen or interaction, not only compile success.
- For API changes, verify request, response, error, and auth behavior.
- For data changes, verify migration/backfill/rollback assumptions.
- If tests are missing, use the best available smoke check and state the gap.
- Do not claim success without naming the verification that passed.

## Stop And Ask When

- The desired behavior is ambiguous and different interpretations require different code paths.
- The change could be destructive, security-sensitive, billing-related, or migration-heavy.
- Existing code contradicts the request and the safer direction is not obvious.
- Verification requires credentials, production access, or irreversible side effects.

## Handoff

- Use `karpathy-guidelines` for broader coding behavior, simplicity, and assumption handling.
- Use `terminal-ops` for command-driven proof and repo state checks.
- Use `code-refactoring` when the goal is behavior-preserving cleanup.
- Use `testing-strategy` when deciding how much verification is enough.
- Use language or framework skills for implementation details after the current flow is understood.
