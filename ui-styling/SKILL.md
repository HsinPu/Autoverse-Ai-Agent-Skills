---
name: ui-styling
description: UI styling guide for composing shadcn/ui, Radix, and Tailwind components with polished color, button, form, and layout patterns. Use when building or restyling React UI components that need consistent spacing, theme-aware colors, and accessible visual polish.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# UI Styling

Use this skill when refining React UI components.

## Workflow

1. Pick the base component and decide the variant hierarchy.
2. Define colors, border, radius, shadow, and button states from the theme.
3. Tune spacing, alignment, labels, and content density so the component reads cleanly.
4. Verify hover, focus, disabled, loading, and active states.
5. Keep the styling consistent with the surrounding screen and design system.

## Rules

- Keep variants small and intentional.
- Prefer theme tokens and existing component primitives.
- Make primary buttons visually distinct from secondary actions.
- Avoid over-styled components that fight the system.

## Handoff

- For shadcn-specific composition, use `shadcn-ui`.
- For broader Tailwind utilities, use `tailwind-patterns` or `tailwind-development`.
- For higher-level visual direction, use `frontend-design`.
