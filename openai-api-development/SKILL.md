---
name: openai-api-development
description: OpenAI API development guide covering Responses API, model selection, structured outputs, function calling, tools, files, streaming, multimodal inputs, error handling, rate limits, cost controls, and safe production integration. Use when building, reviewing, or debugging applications that call OpenAI APIs.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# OpenAI API Development

Use this skill when implementing or reviewing an application that calls OpenAI APIs directly from a backend, worker, CLI, or trusted server-side environment.

## Core Scope

- Responses API, Chat Completions migration, and SDK usage
- Model selection, reasoning effort, latency, quality, and cost tradeoffs
- Structured outputs, JSON schemas, function calling, and tool design
- Streaming, multimodal inputs, files, image/audio/text workflows, and long-running jobs
- Retries, rate limits, idempotency, observability, and production safety

## Workflow

1. Identify the user-facing task and choose the smallest API surface that fits it.
2. Select the model intentionally based on reasoning need, latency, modality, and budget.
3. Define inputs, instructions, tools, and output schema before writing glue code.
4. Keep API keys and privileged calls server-side.
5. Add retries, timeouts, rate-limit handling, logging, and cost controls.
6. Validate outputs with schemas or explicit checks before using them in downstream actions.
7. Add evals or golden tests for prompts that affect product behavior.

## API Design Rules

- Prefer the Responses API for modern stateful, multimodal, tool-using workflows.
- Use structured outputs when the application expects machine-readable data.
- Use function calling for app-owned operations, not as a substitute for authorization checks.
- Keep tool schemas narrow and stable; include only parameters the tool really needs.
- Never let model output directly become SQL, shell, file paths, emails, payments, or privileged actions without validation.

## Production Checks

- Redact secrets, tokens, PII, and user content from logs where needed.
- Track prompt version, model, latency, token usage, tool calls, and failure modes.
- Use backoff for retryable errors and avoid retrying unsafe side effects blindly.
- Put budgets around loops, tool calls, streaming duration, and output size.
- Handle refusal, partial output, invalid JSON, timeout, and rate-limit cases explicitly.

## Handoff

- Use `agents-sdk-development` for multi-step agent workflows with tools, handoffs, and tracing.
- Use `rag-vector-search` for retrieval-grounded applications.
- Use `llm-evals` for regression testing, graders, and prompt quality checks.
- Use `security-code-review` for prompt injection, secret handling, or tool safety reviews.

## References

- OpenAI Models: `https://developers.openai.com/api/docs/models`
- OpenAI Structured Output: `https://developers.openai.com/api/docs/guides/structured-output`
- OpenAI Function Calling: `https://developers.openai.com/api/docs/guides/function-calling`
- OpenAI Streaming: `https://developers.openai.com/api/docs/guides/streaming`
