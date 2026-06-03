---
name: design-system
description: Design system generation and visual audit guide for extracting cohesive tokens, producing preview artifacts, reviewing UI consistency, and spotting generic AI-style design patterns. Use when starting a new project, auditing an existing codebase, preparing a redesign, reviewing styling PRs, or diagnosing when the UI feels visually off.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Design System

Use this skill when the task is about the system behind the UI, not just one screen.

## Modes

### 1. Generate a design system

Use when starting a new project, standardizing a redesign, or extracting tokens from an existing codebase.

- Inspect existing CSS, Tailwind `@theme`, CSS variables, styled-components, or component styles.
- Extract colors, typography, spacing, radii, shadows, borders, breakpoints, and motion rules.
- Prefer existing source tokens over inventing new values.
- Read [reference/generate.md](reference/generate.md) when you need the generation workflow or output contract.

Expected outputs:

- `design-tokens.json`
- `DESIGN.md`
- `design-preview.html`

### 2. Audit a visual system

Use when reviewing a codebase, styling PR, or redesign candidate.

- Score the UI across color, typography, spacing, component consistency, responsiveness, dark mode, animation, accessibility, density, and polish.
- Tie every finding to concrete examples and, when possible, `file:line`.
- Read [reference/review.md](reference/review.md) for the audit rubric and reporting format.

### 3. Slop check

Use when the UI feels generic, over-decorated, or visually off.

- Call out AI slop patterns such as gratuitous gradients, glassmorphism with no purpose, generic hero sections, random accents, placeholder typography, and weak hierarchy.
- Prefer a short list of high-signal fixes over vague critique.
- Read [reference/review.md](reference/review.md) for the slop-check checklist.

## Handoff

- For implementing a specific screen or component, pair with `frontend-design`, `tailwind-development`, or `css-development`.
- Keep the system semantic: use base tokens, semantic tokens, and component tokens only when necessary.
- If an existing design system already exists, extend it instead of replacing it.
