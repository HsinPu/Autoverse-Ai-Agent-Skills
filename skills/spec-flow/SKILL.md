---
name: spec-flow
description: Spec-driven development workflow for turning clear requirements or an approved solution direction into a concise specification, acceptance criteria, task breakdown, and execution path. Use when a request needs structured decomposition, implementation planning, or a document-first development flow after the intended direction is understood.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Spec Flow

Use this skill to turn an agreed goal or design direction into an executable plan.

## Workflow

1. Restate the approved direction, goal, and intended outcome.
2. Split the request into spec, tasks, dependencies, and risks.
3. Decide what must be built now and what can wait.
4. Keep the plan short enough to execute without drift.
5. Update the spec as implementation details change.

## Rules

- Prefer explicit scope over broad solution sketches.
- Keep spec text concrete and testable.
- Separate assumptions from confirmed facts.

## Handoff

- Use `solution-discovery` first when the problem is understood but the solution direction is not approved.
- For formal technical specs, use `specification-authoring`.
- For implementation ownership, call-chain inspection, and the smallest safe edit, use `code-change-workflow`.
- For test scope and evidence planning, use `testing-strategy`.
- For implementation refactoring, use `code-refactoring` or a stack-specific skill.
