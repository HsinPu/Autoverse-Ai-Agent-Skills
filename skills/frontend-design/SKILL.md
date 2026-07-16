---
name: frontend-design
description: Production frontend implementation guide for turning an approved visual direction, design system, or image contract into semantic, responsive, accessible UI in the existing stack. Use when building or restyling components, pages, and applications after the visual direction is clear; use taste-skill or design-consultation first when art direction is unresolved.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/Autoverse-Ai-Agent-Skills"
---

# Frontend Design

Turn an approved visual direction into production UI without losing product behavior, accessibility, responsiveness, or maintainability. This Skill owns implementation craft; it does not reopen art direction that has already been selected.

## Inputs

Start from the strongest available design authority:

- an existing product design system;
- an approved visual direction or design specification;
- an implementation contract derived from a screenshot or mockup;
- repository behavior, content, and component conventions.

If the visual direction is unresolved, route to a design-direction Skill before writing substantial UI. Do not invent a second design system inside one page.

## Bundled Resources

- Read [reference/implementation-checklist.md](reference/implementation-checklist.md) for responsive, state, performance, and delivery checks.
- Read [reference/accessibility.md](reference/accessibility.md) when implementing keyboard behavior, focus, contrast, semantic HTML, or reduced motion.
- Read [reference/css-tokens.md](reference/css-tokens.md) when introducing or extending CSS variables and theme tokens.
- Read [reference/implementation-architecture.md](reference/implementation-architecture.md) when deciding component reuse, data binding, state ownership, optimistic behavior, or a boundary between page composition and shared UI.

## Workflow

### 1. Inspect the Existing Surface

Identify the target route or component, framework, styling system, design tokens, shared primitives, content source, state model, runtime commands, and repository instructions. Record behavior that must remain stable: navigation, forms, data flow, analytics, SEO metadata, permissions, and critical interactions.

Run or inspect the smallest relevant UI surface before changing it. Capture representative desktop and mobile evidence when practical and authorized.

### 2. Translate Direction into Rules

Convert visual intent into implementation decisions:

- typography roles, scale, line length, and font-loading fallbacks;
- semantic colors, contrast, theme behavior, and status roles;
- spacing rhythm, grid, content width, and layout constraints;
- radii, borders, shadows, surfaces, imagery, and icon treatment;
- component inventory, variants, state coverage, and ownership;
- breakpoint behavior and content-priority changes;
- motion purpose, timing family, and reduced-motion behavior.

Prefer project tokens and primitives. Add a token or variant only when it represents a reusable decision, not a one-off value hidden behind a new name.

### 3. Map Component, Data, and State Ownership

Before adding abstractions, classify each meaningful UI unit as reuse, extend, compose, or new. Record its real data source, loading and failure behavior, permissions, and the smallest owner for each state. Keep server state, shareable URL state, cross-surface application state, form state, and transient local interaction state distinct.

Do not duplicate server data into local state without a synchronization reason, hide shareable filters in component state, or create a global store for state that one component owns. Read [reference/implementation-architecture.md](reference/implementation-architecture.md) for the decision tables.

### 4. Build Semantic Components

- Use semantic HTML and native controls before custom replicas.
- Keep real text selectable and content separate from decoration.
- Preserve existing data and event contracts by default.
- Separate reusable components from page-specific composition.
- Keep decorative layers out of pointer and accessibility flows when appropriate.
- Cover hover, focus, active, selected, disabled, loading, empty, error, success, overflow, and permission states that the product can reach.

Avoid screenshot-shaped markup, full-page background mockups, brittle fixed positioning, and component abstractions that exist only to reduce line count.

### 5. Implement Responsive Behavior

Design reflow from content priority instead of scaling the desktop page. Check narrow mobile, representative desktop, and any intermediate width where navigation, columns, tables, or media change structure.

Use fluid sizing where it improves resilience, but keep deliberate constraints for readable line length, stable controls, media aspect ratios, and touch targets. Test long content, localization, zoom, empty states, and overflow.

### 6. Add Purposeful Motion

Use motion to explain hierarchy, state change, spatial relationship, or feedback. Concentrate expressive animation in a small number of meaningful moments; frequent product tasks should remain quick and predictable.

Respect reduced-motion preferences and ensure the interface remains understandable when animation is removed. Avoid adding a motion dependency when CSS or the project's existing library is sufficient.

### 7. Verify and Repair

Run proportionate type, lint, test, and build checks. Exercise the rendered UI at the required viewports and states, then inspect:

- hierarchy, spacing, alignment, typography, color, and asset treatment;
- keyboard flow, focus visibility, semantics, labels, contrast, zoom, and reduced motion;
- route behavior, data, forms, events, console output, failed requests, and layout shift;
- visual agreement with the approved direction, design system, or image contract.

Fix structural and behavioral problems before optical polish. Do not update persistent visual baselines merely because a comparison fails.

## Implementation Principles

- Choose patterns because they fit the content and product, not because they are fashionable or unusual.
- Familiar cards, grids, pills, gradients, and common fonts are acceptable when they are the clearest contextual choice.
- Distinctiveness should come from a coherent system and one recognizable idea, not unrelated effects.
- Accessibility and state completeness are part of the design, not a cleanup pass.
- Put data and state in the smallest durable owner that matches their lifecycle; derive values instead of synchronizing copies.
- Preserve a viable existing design system and avoid framework migrations outside the requested scope.
- Keep implementation complexity proportional to the approved visual direction and maintenance capacity.

## Deliverable

Report the implemented direction, changed files, reused or extended tokens and components, data and state ownership decisions, preserved behavior, verified viewports and states, test and browser evidence, known deviations, and unverified areas.

## Handoff

- Use `design-consultation` for a lightweight aesthetic plan when only palette, typography, spacing, or component tone is unresolved.
- Use `taste-skill` for deeper contextual art direction, design calibration, or anti-generic preflight; once its direction is locked, return here without reopening exploration.
- Use `image-to-code` when screenshots or recordings are the primary authority, and use `figma-to-code` when structured Figma evidence is the primary authority. Keep that source workflow as the orchestrator after its evidence contract is locked; load this Skill only as supporting production-implementation guidance and return verification evidence to the owning workflow.
- Use `frontend-design-review` for independent review after implementation.
- Use `ui-styling`, `tailwind-patterns`, or `tailwind-development` for specialized styling execution.
- Use `responsive-design` for complex reflow and `animation-best-practices` for motion-heavy behavior.
