---
name: presentation-ops
description: Presentation workflow for creating and editing PowerPoint decks (.pptx) with slides, layout fidelity, and editable output. Use when a deck, slide, or presentation is the primary input or output, or when charts, diagrams, or templates need to be preserved.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Presentation Ops

Use this skill when a deck is the source or the deliverable.

## When To Use

- Create new slide decks or edit existing .pptx files
- Rebuild slides from content, screenshots, or references
- Preserve charts, diagrams, speaker notes, templates, or master layouts
- Fix overflow, overlaps, fonts, or layout issues

## Workflow

1. Decide whether to create, revise, or reconstruct.
2. Keep the deck editable and preserve existing themes when possible.
3. Check slide order, text fit, and visual balance on every modified slide.
4. Validate the output opens and renders without overlap or font substitution.
5. If the deck needs PDF export, hand off to `pdf-operations`.

## Rules

- Keep content editable; avoid flattening into images unless necessary.
- Maintain consistent fonts, spacing, and slide dimensions.
- Treat screenshots and PDFs as source material, not final form.

## Quality Gate

- Slides are readable and unbroken.
- Layout matches the intended structure.
- Any diagrams or charts remain legible and editable.

## Handoff

- For PDF export or distribution, use `pdf-operations`.
- For accompanying notes or summaries, use `markdown-writer`.
