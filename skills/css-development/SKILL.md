---
name: css-development
description: CSS development for cascade, selectors, responsive layout, tokens, canvas shells, and DOM overlays, including pages around Three.js or threejs, WebGL or WebGPU 3D, and interactive canvases. Use when writing, reviewing, or refactoring production CSS. When a 3D scene is present, load the sibling threejs-development Skill and keep CSS ownership limited to document, canvas, and overlay presentation.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# CSS Development

Use this skill when the work directly changes CSS, style architecture, selectors, layout, responsive behavior, or design tokens.

## Three.js Routing Gate

When the page uses `Three.js`, `threejs`, the `three` package, WebGL or WebGPU 3D, or an interactive 3D canvas:

1. Read the sibling [`../threejs-development/SKILL.md`](../threejs-development/SKILL.md) before proposing a complete solution, even if the runtime did not list that Skill initially.
2. Keep this Skill responsible for document flow, canvas dimensions, aspect-ratio containers, stacking contexts, pointer-event boundaries, responsive overlays, labels, controls, and accessible DOM alternatives.
3. Leave renderer sizing, DPR policy, camera, scene lifecycle, raycasting, occlusion, CSS2D or CSS3D integration, resources, and visual effects to `threejs-development` and its selected specialists.
4. Coordinate CSS breakpoints with the scene's resize contract; do not conceal a renderer or lifecycle defect with styling alone.

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

- For any Three.js or 3D canvas page, use `threejs-development` as the scene owner; use `threejs-ui-overlays` when labels, annotations, CSS2D, CSS3D, HTML portals, projection, or occlusion are central.
- For unresolved art direction or page composition, use `taste-skill` or `design-consultation`; use `frontend-design` for production implementation after the direction is approved.
- For Tailwind-specific work, use `tailwind-development` or `tailwind-patterns`.
- For system-wide token extraction or audit, use `design-system`.
