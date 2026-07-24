---
name: swiftui-development
description: SwiftUI implementation and review workflow for native iOS interfaces, covering Observation and property-wrapper ownership, unidirectional data flow, view composition and identity, NavigationStack and presentation state, structured concurrency and lifecycle cancellation, accessibility, localization, previews, testing, API availability, and rendering performance. Use when building, debugging, reviewing, or refactoring SwiftUI views and features; use ios-architecture when the primary decision is app or module architecture.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "AvdLee/SwiftUI-Agent-Skill"
  reference-license: "MIT"
  reference-revision: "f06d1437a3fbec7df6cdce93f77004e5409b31ee"
---

# SwiftUI Development

Build SwiftUI features with explicit state ownership, stable identity, lifecycle-safe effects, and verifiable platform behavior.

## Workflow

1. Inspect the deployment target, Xcode and Swift versions, enabled platform features, project architecture, test targets, and existing UI conventions.
2. Identify the feature states, state owner, injected dependencies, user actions, asynchronous work, navigation destinations, presentations, errors, and accessibility requirements.
3. Read only the relevant references:
   - [state-and-concurrency.md](references/state-and-concurrency.md) for Observation, property wrappers, dependency flow, tasks, and cancellation;
   - [views-and-navigation.md](references/views-and-navigation.md) for composition, identity, lists, layout, navigation, sheets, and previews;
   - [quality-and-performance.md](references/quality-and-performance.md) for accessibility, localization, compatibility, testing, diagnostics, and performance.
4. Implement the smallest native SwiftUI change that fits the current architecture. Bridge to UIKit only for capabilities that SwiftUI cannot provide safely.
5. Represent loading, content, empty, error, retry, offline, and permission states explicitly where they can occur.
6. Add or update focused tests and previews, then build the affected target. Exercise navigation, cancellation, Dynamic Type, VoiceOver labels, and deployment-target fallbacks in proportion to risk.

## Core Rules

- Keep view-owned state private. Use a binding only when a child must mutate state owned elsewhere.
- Choose Observation or `ObservableObject` from the actual deployment target and existing codebase; do not perform an unrelated framework-wide migration.
- Keep network calls, persistence, parsing, expensive transforms, and business policy out of `body`.
- Use stable model identity in `ForEach` and navigation paths. Never use an array offset as durable identity for mutable collections.
- Give feature work a structured task owner. Cancel obsolete searches, loads, and subscriptions when inputs or view lifetime change.
- Keep UI mutations on the main actor and make cross-actor values safe to transfer.
- Prefer semantic controls such as `Button`, `Toggle`, `TextField`, and `NavigationLink` over gesture-only imitations.
- Gate newer APIs with the correct availability boundary and provide a real fallback when the deployment target requires one.
- Measure rendering or scrolling problems before adding `Equatable`, manual caching, or identity overrides.

## Review Output

For reviews, report findings in this order:

1. incorrect state ownership or stale data;
2. lifecycle, concurrency, cancellation, or actor-isolation defects;
3. unstable identity, navigation, or presentation bugs;
4. accessibility and localization barriers;
5. measured or strongly evidenced performance problems;
6. optional readability and API-modernization improvements.

Separate correctness defects from preferences. Cite the affected view or symbol and propose the smallest direct fix.

## Verification

- Build the exact application or package target with the repository's normal Xcode or Swift command.
- Run focused unit, UI, or snapshot tests where the project already uses them.
- Verify previews use deterministic local data and do not require production services.
- Check the smallest supported OS, current OS, light and dark appearance, text scaling, reduced motion, common device widths, and interrupted tasks when those states are affected.
- Use Instruments, SwiftUI update diagnostics, or signposts for performance claims that cannot be established from code alone.
- Treat successful static inspection as incomplete when Xcode compilation or device behavior is the acceptance gate.

## Handoff

- Use `ios-architecture` for MVVM, MVI, TCA, Clean Architecture, module boundaries, dependency direction, or architecture migration.
- Use `mobile-app-testing` for device matrices, permissions, deep links, push notifications, purchases, lifecycle, and automation.
- Use `accessibility-testing` when the task requires an independent assistive-technology or WCAG-style audit.
- Use `app-store-release` for archives, signing, privacy declarations, TestFlight, and submission readiness.
