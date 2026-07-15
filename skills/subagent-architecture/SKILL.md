---
name: subagent-architecture
description: Proactively design and route reliable multi-agent workflows by deciding when to delegate, discovering available roles, selecting the smallest useful team, defining file and decision ownership, sequencing dependencies, specifying handoff contracts, and arbitrating parallel results. Use whenever the runtime exposes subagents or custom agents and a task contains multiple bounded workstreams, even when the user did not explicitly request delegation; also use for agent teams, parallel research or implementation, multi-reviewer work, competing debugging hypotheses, and coordinated fan-out and fan-in execution.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Subagent Architecture

## Activation

- When the runtime exposes subagents or custom agents, proactively evaluate delegation even if the user did not ask for it.
- Delegate when two or more concrete, bounded workstreams can proceed independently and the expected speed, isolation, or evidence gain exceeds coordination cost.
- Keep tightly coupled work, tiny tasks, architecture ownership, destructive decisions, and the final completion judgment with the parent.
- Respect an explicit request not to delegate. If no suitable role or subagent capability exists, continue locally without blocking.
- Discover roles from the runtime and select them by description and required capability; never assume that a named role exists on every tool.

## Workflow

1. Define the single parent objective, acceptance evidence, authority boundary, and shared mutable state.
2. Inspect the available subagent capabilities and role descriptions before choosing whether and where to delegate.
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
- Read [references/global-auto-delegation.md](references/global-auto-delegation.md) when installing concise global routing instructions for Codex or OpenCode without relying on a project `AGENTS.md`.

## Handoff

- Use `agent-creator-design` for individual agent prompt design.
- Use `agent-introspection-debugging` when traces indicate routing, ownership, handoff, loop, or context failures in an agent team.
- Use `todo-first` for visible execution status.
- Use `multi-session-planning` when the dependency and ownership map spans several work sessions.
- Use `session-handoff` for evidence-linked continuation across agents, tools, or sessions.
- Use `context-governance` for durable lessons and reusable decisions that should outlive the current task.
- Use `code-review` after integrating multi-agent implementation.
