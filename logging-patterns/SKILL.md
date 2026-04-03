---
name: logging-patterns
description: Logging guide for writing clean, consistent log statements with stable message patterns, sensible log levels, and low-noise context fields. Use when adding, refactoring, or reviewing application logs so messages stay readable, searchable, and easy to correlate.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Logging Patterns

Write logs that stay easy to scan in production and easy to search during debugging.

## Core Rules

- Keep the message short, static, and lowercase; avoid decorative punctuation.
- Put dynamic values in structured fields when the logger supports them. Otherwise append stable `key=value` pairs.
- Log one event per line. Do not mix start, result, and diagnosis in one message.
- Reuse the same wording for the same event across nearby code paths.
- Include only identifiers and facts that help triage, such as `requestId`, `userId`, `jobId`, `status`, and `durationMs`.
- If the logger already adds module, class, or file context, do not repeat that prefix in the message.
- Avoid dumping full payloads, secrets, tokens, HTML, or large objects unless the user explicitly needs diagnostic logging.

## Level Selection

- Use `debug` for local state, branch decisions, retry details, and temporary diagnostics.
- Use `info` for normal lifecycle events and important state changes.
- Use `warn` for unexpected but handled conditions, degraded behavior, and skipped work.
- Use `error` for failed operations that need attention; attach the error object separately when the logger supports it.

## Message Shape

- Prefer one of these stable patterns:
  - `<operation> started|completed|failed`
  - `<entity> created|updated|deleted`
  - `skip <operation> reason=<reason>`
  - `invalid <input> field=<field> reason=<reason>`
  - `<dependency> request started|completed|failed`
- Keep the verb consistent within the same flow. If one path says `payment authorized`, nearby paths should not switch to `payment auth success`.

## Workflow

1. Identify the event the log is describing.
2. Pick the level based on impact, not emotion.
3. Write a short static message using one canonical pattern.
4. Move dynamic values into structured fields or stable `key=value` pairs.
5. If editing existing code, normalize neighboring logs to the same pattern instead of adding a one-off message.

## Reference

- Need concrete good and bad examples, fallback formatting, or cleanup patterns for messy logs: see [reference/message-patterns.md](reference/message-patterns.md).
