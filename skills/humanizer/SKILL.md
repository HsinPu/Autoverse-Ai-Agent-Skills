---
name: humanizer
description: Text editing workflow for removing AI-generated patterns and making writing sound more natural and human. Use when revising copy, summaries, comments, or docs that feel stiff, repetitive, promotional, or formulaic.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Humanizer

Use this skill when text sounds machine-made.

## Workflow

1. Strip inflated language and repetitive phrasing.
2. Replace vague claims with concrete detail.
3. Vary sentence length and rhythm.
4. Keep the original meaning and tone.
5. Add a human voice where the text needs it.

## Rules

- Remove promotional filler.
- Avoid rigid list-y prose unless it helps clarity.
- Prefer simple constructions over embellished ones.
- Keep the result natural, not just grammatically clean.

## Handoff

- For extracting and applying a specific organization or creator voice, use `brand-voice` before this final naturalness pass.
- For evidence-led long-form drafting and editorial checks, use `article-writing`.
- For final-answer polish, use `answer-writing`.
- For Markdown-heavy docs, use `markdown-writer`.
