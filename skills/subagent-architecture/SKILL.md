---
name: subagent-architecture
description: Design reliable multi-agent workflows by deciding when to delegate, selecting team size and roles, defining file and decision ownership, sequencing dependencies, specifying message and handoff contracts, and arbitrating parallel results. Use when a task needs subagents, agent teams, parallel research or implementation, multi-reviewer work, competing debugging hypotheses, or coordinated fan-out and fan-in execution.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Subagent Architecture

## Workflow

1. Define the single parent objective, acceptance evidence, authority boundary, and shared mutable state.
2. Keep work local unless a subtask is concrete, bounded, independently useful, and cheaper to delegate than to coordinate.
3. Build a dependency graph and classify each work unit as parallel-safe, sequential, or parent-owned.
4. Choose the smallest team that covers distinct responsibilities without duplicate context or shared-file races.
5. Assign explicit inputs, allowed files or systems, decisions, stop conditions, and output evidence.
6. Define message types and fan-in rules before agents begin.
7. Validate returned claims against current artifacts, resolve conflicts, integrate, and run end-to-end checks.

## Ownership Rules

- Give one agent exclusive write ownership for each file or external surface at a time.
- Keep architecture decisions, destructive actions, user clarification, and final completion judgment with the parent.
- Parallelize independent evidence gathering, separate components, or competing hypotheses.
- Serialize schema, dependency, shared configuration, generated catalog, and integration changes.
- Treat agent reports as leads until verified against files, tests, or external state.

## Subagent Contract

```text
Role:
Objective:
Inputs and current evidence:
Owned files or systems:
Forbidden scope:
Required output and proof:
Stop conditions:
```

## Fan-In

- Deduplicate findings by root cause rather than wording.
- Resolve contradictory results through a discriminating check, not voting.
- Reject outputs that changed unowned state or lack the required proof.
- Re-plan when a returned result changes dependencies or invalidates another assignment.
- Stop idle agents after their output is integrated or made obsolete.

## References

- Read [references/team-patterns.md](references/team-patterns.md) when choosing team composition, communication messages, parallel-debugging structure, multi-reviewer fan-in, or file-ownership policy.

## Handoff

- Use `agent-creator-design` for individual agent prompt design.
- Use `todo-first` for visible execution status.
- Use `context-governance` for durable decisions and long-running handoffs.
- Use `code-review` after integrating multi-agent implementation.
