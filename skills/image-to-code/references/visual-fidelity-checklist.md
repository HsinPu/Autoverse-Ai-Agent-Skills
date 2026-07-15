# Visual Fidelity Checklist

Use this checklist during each render-and-compare pass. Fix high-impact structure before decorative detail.

## Comparison Authority

Use `visual-regression-testing` for the generic evidence matrix, measurement methods, thresholds, pairwise comparison, deviation status, and iteration stop decision. This checklist only supplies image-source stabilization and the order for repairing visual differences; it must not define a second acceptance gate.

## Stabilize the Comparison

- Render at the exact source CSS viewport only when it is known. Otherwise record the candidate viewport, pixel dimensions, inferred DPR/zoom, confidence, and constraint-based tolerance.
- Load the intended fonts and assets; wait for layout-affecting requests to settle.
- Freeze or disable non-essential animation and nondeterministic content.
- Use equivalent content, locale, state, and data density.
- Keep the reference image unchanged and label every generated revision.

## Pass 1: Geometry

- page shell, content width, gutters, and grid lines;
- section order, height, overlap, and major whitespace;
- hero copy/media ratio and focal point;
- header, navigation, footer, and fixed-position elements;
- overflow, clipping, and unexpected scrollbars.

## Pass 2: Hierarchy and Type

- heading scale, weight, width, line breaks, and baseline rhythm;
- body size, line height, measure, and contrast;
- action hierarchy and label prominence;
- content density and grouping;
- font fallback differences that alter geometry.

## Pass 3: Components and Spacing

- component dimensions and internal padding;
- alignment between labels, controls, icons, and media;
- gap rhythm within and between groups;
- border, divider, and surface boundaries;
- repeated component consistency.

## Pass 4: Visual Treatment

- palette and semantic color roles;
- radii, borders, shadows, transparency, texture, and gradients;
- icon style, optical size, and alignment;
- image crop, focal point, aspect ratio, and treatment;
- decorative layers that affect depth or emphasis.

## Pass 5: Behavior and Reflow

- hover, focus, active, selected, disabled, loading, empty, and error states;
- transitions communicate state and respect reduced motion;
- mobile composition follows content priority rather than merely shrinking;
- controls remain reachable, readable, and touch-friendly;
- long text, zoom, localization, and dynamic data do not break the design.

## Repair Priority

Consume deviation status from `visual-regression-testing`. Within a failing comparison cell, repair missing structure, behavior, accessibility, and severe clipping before hierarchy, component geometry, or decorative detail. Do not chase cosmetic offsets while a higher-impact difference remains. Report environment-driven differences through the owning comparison contract instead of disguising them with brittle offsets.
