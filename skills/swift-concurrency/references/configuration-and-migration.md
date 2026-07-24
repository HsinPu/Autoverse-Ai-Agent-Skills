# Swift Concurrency Configuration and Migration

Use this reference before interpreting migration-sensitive diagnostics or changing target-wide settings.

## Establish the Effective Configuration

Inspect every affected target rather than assuming one project-wide mode.

| Concern | Xcode evidence | Swift package evidence |
|---|---|---|
| Swift language mode | `SWIFT_VERSION` and resolved build settings | Manifest language-mode declaration and compiler arguments |
| Strict checking | `SWIFT_STRICT_CONCURRENCY` | Strict-concurrency experimental setting or explicit compiler flags |
| Default actor isolation | `SWIFT_DEFAULT_ACTOR_ISOLATION` | Package target default-isolation setting |
| Approachable concurrency | `SWIFT_APPROACHABLE_CONCURRENCY` | The corresponding individual upcoming features |
| Upcoming behavior | `SWIFT_UPCOMING_FEATURE_*` | `.enableUpcomingFeature(...)` declarations |

Do not infer language mode from `swift-tools-version` alone. Capture the resolved configuration, including per-target overrides and CI command-line flags.

Also record:

- Xcode, Swift, SDK, and minimum OS versions;
- application, extension, test, and package target boundaries;
- dependency revisions and their concurrency annotations;
- Objective-C, C, delegate, notification, Core Data, Combine, and callback interoperability;
- warnings already suppressed with `@preconcurrency` or unsafe annotations.

## Choose the Migration Boundary

Start with a leaf target or feature whose dependencies are already compatible. Avoid enabling stricter checking across the whole workspace until diagnostics are classified.

Use this sequence:

1. Record a clean baseline build and focused test result.
2. Update or inventory dependencies before compensating for their old annotations.
3. Enable the narrowest diagnostic mode that reveals useful work for one target.
4. Group findings into isolation, sendability, task lifetime, continuation or stream bridging, and test-support categories.
5. Fix one category in a small reviewable slice.
6. Rebuild the same target and run its tests.
7. Expand to the next target only when the current boundary is clean and its public API is safe for dependents.

If a target exposes callbacks, mutable reference types, or unannotated protocols publicly, stabilize that boundary before migrating downstream callers.

## Resolve Diagnostics in Ownership Order

Use this priority:

1. Decide which actor or context owns mutable state.
2. Correct API isolation and protocol requirements.
3. Define which values may cross isolation domains.
4. Repair task structure, cancellation, and lifetime.
5. Migrate callbacks, delegates, streams, and reactive pipelines.
6. Tighten tests and remove temporary suppressions.

Fixing `Sendable` conformance before ownership is known often produces unsafe annotations or unnecessary copies.

## Dependency Compatibility

Before applying `@preconcurrency`:

- check the current dependency release and migration notes;
- determine whether only one imported module or API surface is affected;
- wrap unsafe interoperability behind a local boundary when practical;
- document the pinned version and the condition for removing the annotation.

Do not make the application responsible for proving an entire third-party library safe. Keep any compatibility assertion narrow.

## Callback and Queue Migration

Preserve these contracts when replacing callbacks or dispatch queues:

- whether completion is delivered exactly once;
- callback executor or queue;
- cancellation and timeout behavior;
- ordering and reentrancy;
- progress or multiple-value delivery;
- object lifetime and cleanup;
- error mapping.

Use checked continuations for one-result APIs and streams for repeated values. Do not wrap a callback in an unowned task when the underlying operation still needs explicit cancellation.

## Temporary Exception Ledger

For every temporary concurrency exception, record:

| Field | Required evidence |
|---|---|
| Location | Target, file, and symbol |
| Mechanism | Exact annotation or unsafe API |
| Reason | Dependency or interoperability constraint |
| Invariant | Why concurrent access remains safe |
| Verification | Test, assertion, sanitizer, or review evidence |
| Removal | Dependency version, feature flag, or migration milestone |

An exception without a removal condition is permanent risk, not a migration step.

## Completion Gate

- The migrated target builds with the same settings used in CI.
- New warnings are not hidden by broader target-level suppression.
- Public APIs express their intended isolation and value-transfer rules.
- Tests cover cancellation, actor hops, errors, and lifetime-sensitive behavior.
- Unsafe annotations are either removed or present in the exception ledger.
- The change can be reverted independently from unrelated architecture or product work.
