# Production Web Review Checklist

Load only the sections relevant to the changed surface. Verify behavior in a browser when code inspection cannot prove it.

## Semantics, Keyboard, and Focus

- Native links navigate and retain standard open-in-new-tab behavior; native buttons perform actions.
- Every interactive control is reachable and operable by keyboard in a logical order.
- Focus is visible, dialogs manage and restore focus, and dynamic updates are announced when needed.
- Headings, landmarks, labels, tables, lists, and accessible names reflect the visible structure.
- Decorative content stays out of the accessibility tree; color is not the only status cue.

## Forms and Mutations

- Labels activate their controls; autocomplete, input type, input mode, and names support browsers and assistive tools.
- Paste, password managers, one-time codes, validation, and submission work without trapping the user.
- Errors appear next to affected fields, focus moves to a useful recovery point, and destructive actions have confirmation or undo.
- Pending actions prevent accidental duplicates while preserving a clear label and progress state.
- Optimistic updates define rollback or reconciliation and announce failure accessibly.

## Navigation and State

- Shareable filters, tabs, pagination, and expanded views use URL state when deep links or history should preserve them.
- Back, forward, refresh, scroll restoration, and direct navigation retain expected context.
- Loading, empty, sparse, dense, error, offline, unauthorized, and not-found states provide a next step.
- Hydration or client takeover does not erase input, focus, scroll, or server-rendered meaning.

## Responsive, Touch, and Content Resilience

- Required mobile, desktop, intermediate, zoomed, and ultra-wide layouts avoid clipping and accidental scrollbars.
- Touch targets, spacing, safe areas, mobile input sizes, and keyboard overlays remain usable.
- Long, short, localized, user-generated, and right-to-left content follow the product support matrix.
- Tables, charts, media, skeletons, and navigation reflow intentionally instead of hiding critical information.

## Motion, Theme, and Visual System

- Motion communicates state or hierarchy, is interruptible where appropriate, and respects reduced motion.
- Animations favor compositor-friendly properties and avoid broad `transition: all` behavior.
- Light, dark, forced-colors, high-contrast, and browser chrome behavior match the supported theme matrix.
- Tokens, component variants, nested radii, borders, shadows, imagery, icon treatment, and typography remain coherent.

## Images, Fonts, and Performance

- Images reserve dimensions, use appropriate loading priority and responsive sources, and preserve meaningful alternative text.
- Fonts have intentional preload, subset, fallback, and layout-shift behavior.
- Large lists, expensive input loops, layout reads/writes, and main-thread work are measured or bounded.
- Network and CPU throttling are used when performance claims affect the review; do not infer runtime quality from source alone.
- Console, failed requests, layout shift, and obvious rerender loops are checked on the reviewed states.

## Reporting Boundary

Separate framework-independent correctness from project conventions and brand preferences. Name the applicable source for every project-specific rule. Do not enforce a third-party brand's copy, typography, or aesthetic preference as a universal web requirement.
