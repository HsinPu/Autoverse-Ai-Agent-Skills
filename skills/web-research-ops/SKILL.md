---
name: web-research-ops
description: Web research workflow for finding, checking, and synthesizing current information from the web. Use when a task needs fresh facts, source comparison, or evidence-backed answers from URLs and search results.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Web Research Ops

Use this skill when the task needs current, source-backed research.

## Workflow

1. Turn the request into a narrow research question.
2. Start with primary or authoritative sources.
3. Cross-check important claims against at least two sources.
4. Capture source URLs, dates, and any conflicts.
5. Separate verified facts from interpretation in the final answer.

## Rules

- Prefer current sources over stale summaries.
- Do not treat snippets or search previews as proof.
- Surface disagreement instead of smoothing it over.
- Keep citations or source notes alongside the findings.

## Handoff

- If the user only needs shorter source material, use `summary-ops`.
- If the evidence must support a market, audience, competitor, or positioning decision, use `market-research`.
- If an approved evidence set should become a sourced long-form publication, use `article-writing`.
- If the result should become notes or docs, use `markdown-writer`.
