---
name: accessibility-testing
description: Test web and mobile interfaces for accessibility through WCAG-oriented audits, keyboard navigation, focus behavior, semantic structure, zoom and reflow, contrast, reduced motion, and hands-on screen-reader workflows for VoiceOver, NVDA, JAWS, TalkBack, and platform accessibility APIs. Use when validating an implemented interface, reproducing an accessibility defect, preparing a release, or defining verifiable remediation criteria.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Accessibility Testing

## Workflow

1. Define supported platforms, assistive technologies, viewport and zoom matrix, critical journeys, and target conformance level.
2. Run automated checks to find detectable issues, then treat them as leads rather than proof of accessibility.
3. Inspect semantics, landmarks, headings, names, roles, states, descriptions, relationships, and status announcements.
4. Complete each critical journey using keyboard or switch-equivalent input without pointer assistance.
5. Test representative journeys with supported screen readers and native controls.
6. Validate contrast, text spacing, reflow, target size, orientation, reduced motion, error recovery, and dynamic updates.
7. Report barriers by affected users and journey impact with reproducible remediation and retest steps.

## Rules

- Prefer native elements and behavior before ARIA.
- Do not infer screen-reader usability from the accessibility tree alone.
- Test both reading and interaction modes where the assistive technology distinguishes them.
- Verify focus placement, restoration, visibility, and non-trapping behavior.
- Avoid claiming complete WCAG conformance from a limited sample.
- Separate confirmed barriers from items requiring additional device or user research.

## Evidence

Record browser or app version, operating system, assistive technology and version, viewport, zoom, input method, route, data state, exact steps, expected behavior, actual announcement or interaction, and captured evidence.

## References

- Read [references/screen-readers-and-wcag.md](references/screen-readers-and-wcag.md) for platform test matrices, essential screen-reader commands, keyboard journeys, common failure patterns, and severity guidance.

## Handoff

- Use `frontend-design-review` for broader visual and UX review.
- Use `frontend-testing` for automated component coverage.
- Use `mobile-app-testing` for device and lifecycle matrices.
- Use `browser-compatibility-testing` for browser-specific behavior.
