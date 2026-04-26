---
name: responsive-design
description: Responsive frontend layout guidance for breakpoints, fluid typography, container queries, and adaptive component behavior. Use when building or restyling web UI that must work well on mobile, tablet, and desktop, or when fixing layout issues across screen sizes.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Responsive Design

Use this skill to make layouts adapt cleanly across viewports.

## Workflow

1. Map the key viewport ranges and the screens that matter most.
2. Decide where the layout should stack, split, collapse, or reflow.
3. Set spacing, type scale, and component sizing for each breakpoint.
4. Prefer container queries for component-level adaptation when useful.
5. Verify touch targets, reading order, and density on small screens.

## Rules

- Do not just shrink desktop UI.
- Reorder hierarchy when mobile needs a different structure.
- Keep buttons, inputs, and nav usable with touch.
- Make responsive behavior intentional, not accidental.

## Handoff

- For Tailwind layout work, use `tailwind-patterns`.
- For CSS-level implementation, use `css-development`.
- For broader visual direction, use `frontend-design`.
