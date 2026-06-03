---
name: spec-flow
description: Spec-driven development workflow for turning requirements into a concise spec, task breakdown, and execution path. Use when a request needs structured decomposition, implementation planning, or a document-first development flow.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Spec Flow

Use this skill to turn vague work into an executable plan.

## Workflow

1. Restate the goal and confirm the intended outcome.
2. Split the request into spec, tasks, dependencies, and risks.
3. Decide what must be built now and what can wait.
4. Keep the plan short enough to execute without drift.
5. Update the spec as implementation details change.

## Rules

- Prefer explicit scope over broad solution sketches.
- Keep spec text concrete and testable.
- Separate assumptions from confirmed facts.

## Handoff

- For formal technical specs, use `specification-authoring`.
- For implementation refactoring, use `code-refactoring` or a stack-specific skill.
