---
name: design-consultation
description: Frontend design consultation for defining visual direction, including color palette, typography, spacing, layout, motion, and component style. Use when a task needs an explicit aesthetic plan before implementation or when restyling a screen, page, dashboard, or component so it feels intentionally designed rather than generic.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Design Consultation

Use this skill to choose the visual direction before coding.

## Workflow

1. Clarify the product goal, audience, and tone.
2. Pick one aesthetic direction and define the color palette, type scale, spacing rhythm, surface treatment, and button style.
3. Decide the layout logic and hierarchy for the key screen states.
4. Keep the system consistent across desktop and mobile.
5. Hand off the direction to implementation skills.

## Rules

- Prefer one cohesive palette over mixed styles.
- Make primary and secondary buttons visually distinct.
- Use spacing and typography to create hierarchy, not decoration.
- If the product already has a design system, extend it instead of replacing it.

## Handoff

- For screen implementation, use `frontend-design`.
- For system extraction or audit, use `design-system`.
- For Tailwind-specific execution, use `tailwind-patterns` or `tailwind-development`.
