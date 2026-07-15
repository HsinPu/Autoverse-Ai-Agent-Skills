# Anti-Generic UI Review

Use this as a visual-direction preflight after a direction exists and before it is handed to implementation. Use `frontend-design-review` for an independent review of completed UI. The signals below are prompts for investigation, not universal bans.

## Direction and Hierarchy

- Can a reviewer describe the product and intended audience without reading the brief?
- Is the main action or message dominant for a reason, or merely larger?
- Does each section have a distinct information job?
- Is the signature idea visible in structure, typography, imagery, or interaction rather than only in decoration?

## Repetition Signals

Investigate when the interface relies heavily on:

- a centered headline, gradient background, and two buttons regardless of content;
- repeated equal-width cards with identical emphasis;
- pills for labels, filters, statuses, and navigation without semantic distinction;
- cards nested inside cards because boundaries were not designed;
- arbitrary glows, glass effects, or floating shapes that do not guide attention;
- icon-and-caption rows that could belong to any product;
- decorative dashboards or metrics unsupported by real data needs.

Keep a pattern when it improves comparison, scanning, consistency, or task completion. Change it when it is only a default inherited from templates.

## System Coherence

- Typography roles are limited, readable, and consistently applied.
- Color roles have semantic meaning and adequate contrast.
- Spacing, radii, borders, and elevation come from a small intentional vocabulary.
- Imagery shares composition, crop, lighting, and subject-treatment rules.
- Motion uses a consistent timing family and communicates hierarchy or state.
- Mobile behavior is recomposed rather than mechanically shrunk.

## Product Reality

- Realistic long, short, empty, error, loading, and localized content has been considered.
- Controls remain semantic, editable, keyboard-operable, and understandable without animation.
- Names, logos, testimonials, customers, metrics, and claims are real, approved, or visibly marked as placeholders.
- Existing routes, actions, data, analytics, and permissions are not silently changed by the visual concept.

## Review Outcome

Classify findings as:

- **Mismatch:** conflicts with product, audience, or preservation constraints.
- **Incoherence:** breaks the selected system or visual intent.
- **Default:** lacks a contextual reason and resembles a reusable template.
- **Incomplete:** fails at a viewport, state, content extreme, or accessibility mode.
- **Intentional:** unusual or familiar choice that is supported by evidence.

Recommend the smallest change that strengthens the intended direction. Do not redesign the interface during review unless the current direction has failed its context or feasibility gate.
