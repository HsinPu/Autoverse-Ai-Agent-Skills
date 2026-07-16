---
name: project-architecture-review
description: Project architecture review workflow for auditing existing repositories across languages and frameworks, mapping entry points, module boundaries, dependency direction, data flow, configuration, tests, and deployment constraints. Use when a user says a project architecture feels wrong, says 專案架構不好 or 架構設計需要調整, asks for the best or most suitable architecture, wants to compare restructuring options before coding, or needs an incremental architecture migration plan.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/Autoverse-Ai-Agent-Skills"
---

# Project Architecture Review

Use this skill before implementation when the user wants to understand whether a project's architecture is healthy and how it should evolve.

## Workflow

1. Identify project type, runtime, framework, entry points, and existing conventions.
2. Map current boundaries: UI/API/CLI, application flow, domain logic, data access, infrastructure, configuration, tests, and deployment.
3. Find architecture risks: unclear ownership, circular dependencies, framework leakage, hardcoded policy, mixed concerns, hidden side effects, weak seams for testing, and costly release paths.
4. Compare 2-3 realistic target shapes instead of declaring one universal best architecture.
5. Recommend the lowest-risk direction that fits project size, team habits, change frequency, and migration cost.
6. Split the migration into small verifiable slices with rollback or stopping points.

## Review Areas

- Repo shape, package layout, build scripts, and generated vs source files.
- Dependency direction and whether high-level policy depends on low-level details.
- Feature, module, layer, and bounded-context boundaries.
- Data flow across request handlers, commands, jobs, events, persistence, and external APIs.
- Configuration, secrets, constants, environment loading, and hardcoded values.
- Test boundaries, fixtures, integration points, and architecture guardrails.
- Deployment, migration, observability, and operational constraints.

## Output Shape

- **Current state**: concise map of how the project is organized today.
- **Main risks**: concrete architecture issues with file or module evidence.
- **Options**: compare realistic alternatives and tradeoffs.
- **Recommendation**: one preferred target direction with rationale.
- **Migration plan**: ordered slices, expected tests, and validation commands.
- **Handoffs**: stack-specific skills needed for implementation details.

## Handoff

- Use `domain-modeling` when architecture boundaries depend on business language, invariants, lifecycle, or consistency ownership.
- Use `code-change-workflow` when tracing an existing behavior path before edits.
- Use `code-refactoring` when the target architecture is chosen and the work is behavior-preserving cleanup.
- Use `python-development`, `java-architecture`, `typescript-development`, `vue-development`, `spring-development`, or another stack skill for language/framework details.
- Use `database-design` for schema ownership, persistence boundaries, or data migration design.
- Use `api-contract-design` for public API boundaries, versioning, pagination, idempotency, and compatibility.
- Use `spec-flow` or `specification-authoring` when the recommendation should become a formal implementation spec.

For deeper checklists and architecture options, read [reference/architecture-review.md](reference/architecture-review.md).
