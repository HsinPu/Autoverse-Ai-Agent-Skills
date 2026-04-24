---
name: agent-reach-ops
description: Cross-platform web research workflow for searching and reading current content across social, video, code, and RSS sources. Use when the task needs multi-source research, transcripts, or platform-specific web extraction.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Agent Reach Ops

Use this skill when a task needs broad web coverage.

## Workflow

1. Identify the target platform first.
2. Use the native channel or fallback that best fits the source.
3. Capture links, timestamps, and source-specific context.
4. Prefer direct extraction over summaries when evidence matters.
5. Keep temp files out of the repo workspace.

## Rules

- Search the right platform, not the nearest one.
- Respect source-specific auth and cookie requirements.
- Prefer evidence from the original source over secondary mirrors.
- Keep outputs structured and source-linked.

## Handoff

- For shorter outputs from sources, use `summary-ops`.
- For evidence-backed synthesis, use `web-research-ops`.
