---
name: summary-ops
description: Summarization workflow for extracting concise summaries or transcripts from URLs, local files, podcasts, and videos. Use when a link, audio/video file, or long text needs a short summary, transcript, or quick triage.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Summary Ops

Use this skill when the goal is to compress long content into usable notes.

## When To Use

- Summarize articles, pages, transcripts, podcasts, or long files
- Extract text from URLs or media without hand-transcribing everything
- Produce short notes for research triage or review
- Convert long content into a machine-readable summary when needed

## Workflow

1. Decide whether the task needs summary, transcript, or extract-only output.
2. Prefer source URLs or files over pasted content when available.
3. Keep the output short, factual, and faithful to the source.
4. If the content came from a video or podcast, mention that the result is a best-effort transcript or summary.
5. If the task needs deep research or cross-source reading, hand off to `web-research-ops`.

## Rules

- Preserve names, numbers, and quoted claims carefully.
- Do not invent missing context.
- Distinguish summary from transcript.

## Quality Gate

- The output is concise and source-faithful.
- Key points, names, and numbers survive compression.
- The user can tell what was summarized and what was extracted.

## Handoff

- For cross-source web research, use `web-research-ops`.
- For document cleanup or markdown conversion, use `markdown-writer`.
