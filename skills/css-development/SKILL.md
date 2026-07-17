---
name: css-development
description: CSS development guide covering cascade management, selectors, responsive design, layout systems, tokens, and maintainable styling architecture. Use when writing, reviewing, or refactoring CSS for production interfaces.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# CSS Development

Use this skill when the work directly changes CSS, style architecture, selectors, layout, responsive behavior, or design tokens.

## Workflow

1. Inspect existing styling conventions before adding new selectors or tokens.
2. Identify whether the problem is cascade, specificity, layout, responsiveness, theming, or component state.
3. Prefer the project's current architecture: CSS modules, global CSS, Tailwind layers, CSS variables, styled components, or framework conventions.
4. Make the smallest style change that fixes the visual or maintainability issue.
5. Verify affected states across relevant breakpoints, themes, hover/focus/disabled states, and reduced-motion preferences.

## Reference Routing

- Cascade and specificity: read [reference/cascade-and-specificity.md](reference/cascade-and-specificity.md).
- Selectors and architecture: read [reference/selectors-and-architecture.md](reference/selectors-and-architecture.md).
- Responsive behavior: read [reference/responsive.md](reference/responsive.md).
- Flexbox, Grid, and layout choice: read [reference/layout.md](reference/layout.md).
- CSS variables and semantic tokens: read [reference/tokens.md](reference/tokens.md).

## Rules

- Avoid `!important` unless the repo already requires it or the override boundary is explicit.
- Prefer semantic tokens over repeated literal colors, spacing, shadows, and radii.
- Keep selectors stable, shallow, and scoped to the owning component or layer.
- Do not fix a layout bug by relying on fragile magic pixel values when a structural layout rule is available.

## Handoff

- For unresolved art direction or page composition, use `taste-skill` or `design-consultation`; use `frontend-design` for production implementation after the direction is approved.
- For Tailwind-specific work, use `tailwind-development` or `tailwind-patterns`.
- For system-wide token extraction or audit, use `design-system`.
