---
name: shadcn-ui
description: shadcn/ui integration guide for installing components, composing forms, handling theming, and building React UI patterns with Tailwind and Radix. Use when the user wants to add, customize, or reason about shadcn/ui components or project conventions.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# shadcn/ui

Use this skill when building with shadcn/ui components.

## Workflow

1. Identify the component set, layout, and theme constraints.
2. Choose the right shadcn component and supporting primitives.
3. Compose the UI with Tailwind classes and keep variants consistent.
4. Handle forms, validation, dark mode, and responsive behavior deliberately.
5. Verify the output matches the project's design language.

## Rules

- Prefer existing shadcn patterns before custom wrappers.
- Keep class composition explicit and readable.
- Coordinate with the project's theme tokens and design system.
- Use component-driven patterns for forms, dialogs, nav, and tables.

## Handoff

- For Tailwind-specific styling rules, use `tailwind-development`.
- For overall visual polish, use `frontend-design`.
