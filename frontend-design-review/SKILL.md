---
name: frontend-design-review
description: Frontend design review guide for evaluating implemented UI, PRs, components, and pages against design quality, accessibility, responsive behavior, design-system compliance, visual hierarchy, motion, and production-grade craft. Use for UI code review, design-system audits, accessibility checks, responsive design checks, theme reviews, and detecting generic or inconsistent visual design.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Frontend Design Review

Use this skill when the review target is user-visible UI quality. Use `frontend-code-review` for functional frontend bugs, `design-system` for broader token/system audits, and `webapp-testing` for local browser verification.

## Review Focus

- **Frictionless flow**: primary action clarity, task completion path, empty/loading/error states, navigation exits.
- **Quality craft**: hierarchy, spacing, alignment, typography, color contrast, motion restraint, responsive fit.
- **Design-system compliance**: tokens, component variants, theme support, density, focus states, disabled states.
- **Trustworthy UX**: clear errors, transparent AI-generated content, safe destructive actions, predictable confirmations.
- **Accessibility**: keyboard flow, focus visibility, semantic markup, labels, contrast, reduced motion, screen-reader behavior.

## Workflow

1. Identify the screen, component, or flow and the user task it supports.
2. Compare implementation against available design system, Figma/specs, or existing product patterns.
3. Check desktop, mobile, overflow, loading, error, empty, disabled, hover, focus, and active states when relevant.
4. Separate blocking usability/accessibility regressions from visual polish.
5. Report issues with file/line references when reviewing code, and include UI state or viewport context when line references are not enough.

## Blocking Issues

- Primary task cannot be completed or has no clear next action.
- Keyboard users cannot reach or operate interactive controls.
- Focus state is missing on custom controls.
- Contrast is too low for essential text or controls.
- Responsive layout clips, overlaps, or hides essential content.
- Design-system component is bypassed in a way that breaks consistency or accessibility.
- Error or destructive-action flow can cause user data loss without clear recovery.

## Design Quality Checks

- Keep one dominant primary action per view unless the workflow truly needs alternatives.
- Preserve spacing rhythm and alignment across cards, forms, tables, and navigation.
- Use tokens and CSS variables instead of hardcoded colors, shadows, radii, and spacing when the project has a system.
- Check all component variants touched by the change, not only the happy path.
- Avoid generic AI-looking layouts: indistinct gradients, interchangeable cards, random glow effects, and weak hierarchy.

## Output

```markdown
## Frontend Design Review

### Blocking
- `file:line` <issue, impact, and fix>

### Major
- `file:line` <issue, impact, and fix>

### Minor
- `file:line` <polish or consistency suggestion>

### Checks
- Reviewed states: <states/viewports>
- Not checked: <gaps and why>
```

If no issues are found, state the reviewed scope and any states or viewports not verified.
