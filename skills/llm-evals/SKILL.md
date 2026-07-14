---
name: llm-evals
description: LLM evaluation guide covering golden datasets, prompt regression tests, graders, rubrics, LLM-as-judge, trace grading, RAG metrics, agent evals, online feedback, cost, latency, and release gates. Use when measuring or improving AI application quality.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# LLM Evals

Use this skill when evaluating prompts, AI features, RAG systems, agents, model upgrades, or production behavior changes.

## Core Scope

- Golden datasets, test cases, rubrics, human labels, and reference outputs
- Prompt regression, model comparison, release gates, and quality dashboards
- Automated graders, string checks, semantic similarity, score model graders, and trace grading
- RAG retrieval metrics, answer faithfulness, citation quality, and freshness
- Agent tool-use evals, routing evals, guardrail evals, and cost/latency tracking

## Workflow

1. Define the product behavior that must improve or must not regress.
2. Build a small representative dataset before tuning prompts or changing models.
3. Separate task success criteria from style preferences.
4. Choose graders that match the failure mode: exact, rubric, semantic, human, or trace-based.
5. Run baseline, candidate, and regression comparisons.
6. Inspect failures manually before trusting aggregate scores.
7. Turn recurring failures into new dataset rows.

## Dataset Design

- Include common cases, edge cases, adversarial cases, and known past failures.
- Keep examples versioned with the prompt, model, tool set, and retrieval configuration.
- Use reference answers when correctness matters.
- Include negative examples where the correct behavior is refusal, escalation, or "not enough information."
- For agents, include expected tool use, forbidden tool use, and final outcome.

## Grader Choices

- Use string checks for exact fields, IDs, labels, and required phrases.
- Use semantic similarity for paraphrasable answers, but inspect false positives.
- Use rubric-based model graders when quality is subjective but criteria can be explicit.
- Use human review for high-stakes or ambiguous examples.
- Use trace grading when the path matters, such as tool sequence, handoff, or retrieval evidence.

## Metrics

- Track pass rate, score distribution, regression count, latency, token cost, tool-call count, and error rate.
- For RAG, track retrieval recall, citation support, groundedness, and stale-source failures.
- For agents, track task completion, wrong tool calls, unsafe tool calls, handoff accuracy, and guardrail triggers.
- Do not ship based on average score alone; inspect critical failures separately.

## Handoff

- Use `openai-api-development` for model and prompt integration.
- Use `llm-application-delivery-workflow` to place eval results inside a release and rollback decision.
- Use `agent-introspection-debugging` to turn failed traces into causal hypotheses and regression cases.
- Use `autoresearch` when one stable metric should drive controlled prompt, model, retrieval, or configuration experiments.
- Use `agents-sdk-development` for trace grading and agent workflow evals.
- Use `rag-vector-search` for retrieval-specific evals.
- Use `testing-strategy` for deciding where evals fit into CI and release gates.

## References

- OpenAI Evals: `https://platform.openai.com/docs/guides/evals/evaluating-model-performance-beta`
- OpenAI Graders: `https://platform.openai.com/docs/guides/graders`
- OpenAI Agent Evals: `https://platform.openai.com/docs/guides/agent-evals`
- OpenAI Trace Grading: `https://platform.openai.com/docs/guides/trace-grading`
