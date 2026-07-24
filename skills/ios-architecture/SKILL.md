---
name: ios-architecture
description: iOS and Swift application architecture workflow for selecting, designing, reviewing, or incrementally migrating SwiftUI, UIKit, or mixed codebases. Use when deciding between MVVM, MVI, TCA, Clean Architecture, VIPER, MVP, Coordinator, or reactive patterns; defining feature and module boundaries, dependency injection, navigation ownership, state and effect flow, persistence boundaries, concurrency rules, or architecture-focused tests; or diagnosing architectural drift in an existing Xcode project.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "efremidze/swift-architecture-skill"
  reference-license: "MIT"
  reference-revision: "4b9700786471acdda88fbe24adec69a1a17ceba4"
---

# iOS Architecture

Choose the smallest architecture that gives the app clear ownership, test seams, and safe evolution.

## Workflow

1. Inspect the deployment target, Swift and Xcode versions, app entry point, targets, packages, feature folders, routing, persistence, services, and tests.
2. Classify the work as a new feature, app-wide design, architecture review, or migration. Record whether the UI is SwiftUI, UIKit, or mixed.
3. Map current ownership for UI state, business rules, navigation, asynchronous effects, dependencies, data access, caching, and external SDKs.
4. Capture constraints: feature size, state-machine complexity, offline or realtime behavior, team familiarity, dependency tolerance, and conventions that must remain compatible.
5. Read [architecture-selection.md](references/architecture-selection.md), name one primary pattern, and state `fit` or `mismatch` with concrete reasons.
6. Read [architecture-boundaries.md](references/architecture-boundaries.md) for the selected pattern and produce feature-specific files, types, protocols, and composition points.
7. For existing code, read [migration-and-review.md](references/migration-and-review.md) and move one behavior-preserving vertical slice at a time.
8. Verify dependency direction, state ownership, cancellation, error paths, navigation, persistence behavior, and focused tests before recommending broader adoption.

## Selection Rules

- Preserve a reasonable existing pattern instead of creating a second architecture inside one feature.
- Use MVVM as a simple screen-level option, not as an automatic answer for every app.
- Use MVI when explicit state transitions and deterministic event handling are the main requirement.
- Use TCA only when the codebase already uses it or the team accepts its dependency, concepts, and testing model.
- Use Clean Architecture for domain and infrastructure separation; pair it with one presentation pattern rather than treating it as a competing screen pattern.
- Treat Coordinator as navigation ownership and Reactive as stream composition. Combine either with a primary feature pattern only when that boundary is explicit.
- Prefer MVP or VIPER mainly when UIKit conventions, passive views, or existing module boundaries make them a lower-risk fit.
- Avoid app-wide ceremony for a small CRUD flow or one stable screen.

## Required Deliverable

Return:

- current architecture and constraints;
- selected primary pattern, optional supporting pattern, and fit result;
- feature or module tree with concrete file names;
- state, action, dependency, navigation, domain, and data ownership;
- concurrency, cancellation, retry, offline, and error behavior;
- test seams and the narrowest useful verification;
- incremental migration steps and rollback points when existing code changes;
- architecture-specific PR checks.

Do not provide only a pattern definition or generic folder diagram. Tie every proposed boundary to a real feature responsibility.

## Guardrails

- Keep UI-bound mutable state isolated to the main actor.
- Keep domain policy independent of SwiftUI, UIKit, persistence frameworks, HTTP clients, analytics SDKs, and app lifecycle callbacks.
- Model dependencies by capability and inject clocks, identifiers, storage, network, and external services where deterministic tests need control.
- Give each asynchronous task an owner and cancellation point. Do not let detached work outlive the feature accidentally.
- Keep navigation state serializable or reconstructable when deep links, restoration, or multi-window behavior require it.
- Define one composition root per target or module boundary. Avoid service locators hidden behind global singletons.
- Do not introduce a package, rewrite, or module split without stating its adoption and migration cost.

## Handoff

- Use `swiftui-development` for SwiftUI state wrappers, view composition, navigation APIs, accessibility, previews, and rendering performance.
- Use `project-architecture-review` when the decision spans multiple platforms, languages, services, or repositories.
- Use `incremental-implementation` for a multi-slice migration after the target architecture is approved.
- Use `mobile-app-testing` for device, lifecycle, permission, deep-link, offline, and automation coverage.
- Use `app-store-release` for signing, privacy declarations, archives, TestFlight, and App Store submission.
