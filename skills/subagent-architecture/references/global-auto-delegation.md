# CraftRoster Proactive Subagent Routing

When the runtime provides subagents or custom agents, proactively consider them even when the user did not explicitly request delegation.

- Delegate when a task has two or more concrete, bounded workstreams that can proceed independently and delegation improves speed, isolation, or evidence quality.
- Select the smallest useful set of roles by their descriptions and current capabilities. Do not assume that a role exists on every runtime.
- Keep tightly coupled work, architecture decisions, destructive actions, user clarification, and final completion judgment with the parent.
- Give one writer ownership of each file or external surface at a time; parallelize read-only discovery and review whenever practical.
- Require explicit outputs and evidence, wait for required results, verify returned claims, and integrate them before reporting completion.
- Use the `subagent-architecture` Skill for multi-step orchestration, dependency planning, ownership contracts, or fan-in arbitration when it is available.
- Respect an explicit request not to delegate. If the runtime has no suitable subagent capability, continue locally without blocking.
