---
name: agents-sdk-development
description: OpenAI Agents SDK development guide covering agents, instructions, tools, handoffs, guardrails, tracing, streaming, context, multi-agent workflows, testing, and production observability. Use when building or reviewing agentic applications with the OpenAI Agents SDK.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/Autoverse-Ai-Agent-Skills"
---

# Agents SDK Development

Use this skill when building or reviewing agentic workflows with the OpenAI Agents SDK, especially workflows that combine instructions, tools, handoffs, guardrails, streaming, and tracing.

## Core Scope

- Agent definitions, instructions, model settings, and output types
- Function tools, hosted tools, tool guardrails, and agents-as-tools
- Multi-agent handoffs, routing, and specialization boundaries
- Input/output guardrails, safety checks, and escalation behavior
- Tracing, spans, debugging, evaluation, and production monitoring

## Workflow

1. Describe the workflow in user outcomes, not agent roles.
2. Decide whether one agent with tools is enough before adding handoffs.
3. Define each tool contract, side effect, authorization requirement, and failure mode.
4. Add guardrails around risky inputs, outputs, and tool calls.
5. Enable tracing during development and review traces for tool loops, poor routing, and hidden failures.
6. Build small eval sets for routing, tool use, and final-answer quality.
7. Set limits for tool calls, retries, runtime, and cost before production.

## Agent Design Rules

- Keep instructions short, specific, and testable.
- Prefer deterministic application code for business rules.
- Use handoffs only when responsibilities are genuinely distinct.
- Keep shared context minimal and explicit.
- Avoid letting agents invent tool parameters that should come from trusted state.

## Tool Safety

- Validate tool arguments before execution.
- Check permissions inside tools, not only in the agent prompt.
- Make side-effecting tools idempotent where possible.
- Return structured tool errors that agents can recover from.
- Put approval gates around destructive, financial, external, or irreversible actions.

## Tracing And Observability

- Use traces to inspect model calls, tool calls, handoffs, guardrails, and custom events.
- Redact sensitive data from traces when needed.
- Track run outcome, latency, cost, tool count, handoff count, and guardrail triggers.
- Keep representative traces for regressions and incident review.

## Handoff

- Use `openai-api-development` for lower-level Responses API and SDK integration.
- Use `llm-application-delivery-workflow` when the agent must pass product, eval, security, cost, deployment, and post-release gates.
- Use `agent-introspection-debugging` when traces show looping, routing, tool, handoff, guardrail, or context failures.
- Use `rag-vector-search` for retrieval tools and knowledge grounding.
- Use `llm-evals` for agent eval datasets, trace grading, and regression checks.
- Use `karpathy-guidelines` when agent workflows are becoming overengineered.

## References

- OpenAI Agents SDK: `https://platform.openai.com/docs/guides/agents-sdk/`
- Agents SDK Tools: `https://openai.github.io/openai-agents-python/tools/`
- Agents SDK Handoffs: `https://openai.github.io/openai-agents-python/handoffs/`
- Agents SDK Tracing: `https://openai.github.io/openai-agents-python/tracing/`
