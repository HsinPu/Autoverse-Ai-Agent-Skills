---
name: agent-introspection-debugging
description: Agent execution diagnosis workflow for reconstructing traces, locating the earliest behavioral divergence, classifying failures across instructions, context, routing, tools, guardrails, retrieval, and synthesis, and turning confirmed causes into regression evals. Use when an agent loops, chooses the wrong tool, loses context, misroutes a handoff, violates an output contract, or succeeds inconsistently and traces or structured logs are available.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
reference-source: affaan-m/ECC
reference-license: MIT
---

# Agent Introspection Debugging

Reconstruct what the agent observed and decided before changing prompts, tools, or orchestration.

## Workflow

1. Define the expected outcome, allowed actions, forbidden actions, and completion signal for the failing run.
2. Capture the exact run identity, application revision, model, instructions, tool versions, context inputs, configuration, and environment.
3. Reproduce the failure when safe. Preserve the original trace and avoid changing several variables before establishing a baseline.
4. Rebuild the execution timeline from model calls, retrieved context, tool requests and responses, handoffs, guardrails, retries, and termination events.
5. Mark the earliest event where observed behavior diverged from the outcome contract. Treat later errors as consequences until evidence proves otherwise.
6. Classify the divergence with [references/agent-failure-taxonomy.md](references/agent-failure-taxonomy.md).
7. Rank falsifiable hypotheses and run one discriminating check at a time. Record the evidence that confirms or rejects each hypothesis.
8. Propose the smallest intervention at the owning layer: instructions, context assembly, retrieval, tool contract, runtime, routing, guardrail, or termination policy.
9. Re-run the original case and add a representative regression case before declaring the failure resolved.

Use [references/trace-review-template.md](references/trace-review-template.md) to keep the diagnosis reproducible.

## Evidence Rules

- Separate the user's input, system instructions, assembled context, model output, tool runtime behavior, and application policy.
- Quote or identify the exact trace event supporting each claim; do not infer hidden reasoning.
- Distinguish an incorrect decision from missing information, a malformed contract, an unavailable tool, and an external failure.
- State confidence and unresolved evidence gaps explicitly.
- Redact secrets, personal data, access tokens, and sensitive retrieved content from shared reports.

## Boundaries

- Do not redesign the agent architecture before locating a confirmed failure owner.
- Do not treat every bad final answer as a prompt problem.
- Do not modify production state merely to reproduce a failure without authorization and rollback controls.
- Do not use this skill for generic browser, Python, database, or infrastructure debugging without an agent execution path.

## Handoff

- Use `agents-sdk-development` for SDK-specific tracing, tools, handoffs, and guardrail implementation.
- Use `systematic-debugging` when the causal failure extends beyond the agent trace or requires broader competing-hypothesis work.
- Use `llm-evals` to convert confirmed failures into datasets, graders, and release gates.
- Use `observability-engineering` or `logging-patterns` when the required diagnostic signals do not exist.
- Use `subagent-architecture` only when evidence confirms a routing, ownership, or fan-in design problem.
