---
name: subagent-architecture
description: Subagent architecture and orchestration guidance for splitting complex work into focused agents, defining responsibilities, handoff contracts, context limits, and parallel or sequential execution. Use when designing or creating subagents, planning multi-agent workflows, or deciding whether a task should stay in one agent or be delegated.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Subagent Architecture

Use this skill when the work benefits from one or more focused subagents.

## Workflow

1. Check whether the task has separable parts, parallel branches, or high context cost.
2. Assign one responsibility per subagent and name the expected output.
3. Define inputs, limits, stop conditions, and handoff rules.
4. Choose sequential, parallel, or fan-in execution.
5. Merge the outputs, resolve conflicts, and verify the final result.

## Rules

- Prefer the smallest number of subagents that solves the task.
- Keep each subagent narrow, short-lived, and role-specific.
- Do not delegate trivial work or work that needs the same context end to end.
- Share only the minimum context needed for the delegated step.
- Add explicit isolation when a subagent handles untrusted content, secrets, or external data.
- Use deterministic output formats so handoffs are easy to combine.

## Subagent Brief

```text
Role: ...
Goal: ...
Inputs: ...
Constraints: ...
Output: ...
Stop when: ...
```

## Common Roles

- Research: collect sources, extract facts, and return concise bullets.
- Builder: implement one isolated change and report files touched.
- Reviewer: inspect output for bugs, risks, and missing checks.
- Coordinator: combine results and decide the next action.

## Handoff

- For system prompt wording, use `agent-creator-design`.
- For workflow planning and task decomposition, use `spec-flow`.
- For tracking multi-step work, use `todo-first`.
- For prompt and skill structure, use `skill-creator-design`.
