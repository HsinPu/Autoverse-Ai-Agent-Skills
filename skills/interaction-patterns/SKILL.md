---
name: interaction-patterns
description: Navigation interaction guidance for web UIs, covering tab overflow, scroll behavior, view transitions, progressive disclosure, and other movement-heavy interface patterns. Use when designing or fixing navigation, scrolling, or transition interactions that need to feel coherent across desktop and mobile.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Interaction Patterns

Use this skill when the work is about navigation and movement.

## Workflow

1. Identify the interaction surface: tabs, scroll regions, panels, or transitions.
2. Decide how overflow should behave on desktop and mobile.
3. Keep the transition readable and predictable.
4. Preserve keyboard and touch access for every interaction.
5. Verify motion, focus, and scroll behavior together.

## Rules

- Prefer clear defaults over clever motion.
- Keep active and selected state obvious.
- Avoid horizontal overflow unless it is intentional.
- Do not let transitions hide available content.

## Handoff

- For motion polish, use `animation-best-practices`.
- For responsive layout, use `responsive-design`.
- For state and loading behavior, use `react-ui-patterns`.
