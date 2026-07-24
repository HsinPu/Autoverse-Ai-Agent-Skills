---
name: swift-concurrency
description: Swift concurrency implementation, diagnosis, review, and migration workflow for async/await, structured tasks, actors, global actors, Sendable, cancellation, AsyncSequence, isolation diagnostics, data races, and Swift 6 strict-concurrency adoption. Use when Swift or Xcode reports actor-isolation, sending, or Sendable errors; when converting callbacks, queues, delegates, or reactive streams; when fixing task lifetime, cancellation, reentrancy, or flaky async behavior; or when reviewing concurrency correctness and performance. Use swiftui-development for primarily SwiftUI state and view-lifecycle work, and ios-architecture for app or module boundaries.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "AvdLee/Swift-Concurrency-Agent-Skill"
  reference-license: "MIT"
  reference-revision: "0d472de78225d2875283c35eaca1c060c493bdb3"
---

# Swift Concurrency

Make the isolation and lifetime model explicit before changing concurrency code.

## Workflow

1. Inspect the Xcode and Swift versions, deployment targets, package manifests, target build settings, enabled upcoming features, dependencies, and existing concurrency conventions.
2. Capture the exact compiler diagnostic, test failure, runtime symptom, or measured performance problem. Identify the affected symbol and call path.
3. Map the current isolation domains, values crossing them, task owner, child-task structure, suspension points, cancellation path, and expected lifetime.
4. Read only the relevant references:
   - [configuration-and-migration.md](references/configuration-and-migration.md) for language mode, strict checking, default isolation, dependency readiness, and staged Swift 6 adoption;
   - [isolation-and-sendability.md](references/isolation-and-sendability.md) for actors, `@MainActor`, `nonisolated`, reentrancy, `Sendable`, and unsafe escape hatches;
   - [tasks-and-streams.md](references/tasks-and-streams.md) for task selection, cancellation, continuations, `AsyncSequence`, `AsyncStream`, and stream lifetime;
   - [verification-and-performance.md](references/verification-and-performance.md) for focused async tests, deallocation checks, runtime evidence, and performance measurement.
5. Choose the smallest behavior-preserving correction. Separate isolation fixes from unrelated architecture, API cleanup, or UI refactors.
6. Build after each diagnostic category or target boundary, then run focused tests before expanding the migration.
7. Verify cancellation, error propagation, stale-result handling, deallocation, and actor reentrancy in addition to successful output.

## Tool Selection

| Requirement | Default tool | Boundary to verify |
|---|---|---|
| One sequential asynchronous operation | `async` / `await` | Caller isolation, cancellation, and error propagation |
| A fixed number of independent child operations | `async let` | Partial failure and implicit child lifetime |
| A dynamic collection of child operations | Task group | Result ordering, cancellation, and concurrency limits |
| Shared mutable state with asynchronous access | `actor` | Reentrancy and public isolation surface |
| UI-owned mutable state | `@MainActor` | Whether every isolated member is genuinely UI-bound |
| Synchronous protected state | A supported lock or `Mutex` | Deployment availability, lock scope, and no suspension while locked |
| Repeated asynchronous values | `AsyncSequence` or `AsyncStream` | Buffering, termination, producer cleanup, and consumer count |
| Bridging synchronous code into an async context | `Task` with an explicit owner | Inherited isolation and cancellation ownership |

Prefer structured child tasks. Use an unstructured task only when its owner, cancellation point, result handling, and lifetime remain explicit.

## Diagnostic Triage

| Symptom | Establish first | Preferred direction |
|---|---|---|
| A main-actor member is accessed from a nonisolated context | Whether the caller or callee owns UI state | Isolate the correct boundary or perform a narrow actor hop |
| Passing a value may cause a data race | Which isolation domains exchange the value | Keep it in one domain or transfer an immutable `Sendable` representation |
| An actor-isolated type cannot satisfy a protocol | Whether the protocol requirement needs isolated state | Use an isolation-aware conformance or make only truly independent requirements nonisolated |
| A task captures mutable or non-Sendable state | The task's creation context and synchronous prefix | Move ownership into an actor, capture a safe value, or redesign the API boundary |
| Results arrive after replacement or dismissal | Which owner should cancel obsolete work | Key, store, or scope the task to the owning feature and reject stale results |
| An async stream leaks or never finishes | Producer cleanup and termination behavior | Install termination handling and define exactly who finishes the stream |
| Core Data objects cross contexts or actors | The managed-object context that owns them | Transfer identifiers or immutable values, then refetch in the destination context |

Do not reason from thread names alone. Actor isolation, task structure, and suspension behavior are the primary correctness model.

## Safety Rules

- Do not add `@MainActor` broadly just to silence diagnostics.
- Do not use `Task.detached` to bypass inherited isolation or lifecycle ownership.
- Do not block an asynchronous context with semaphores, synchronous waits, or long lock-held work.
- Do not assume actor state remains unchanged across an `await`; revalidate invariants after suspension.
- Treat cancellation as a normal control path. Preserve `CancellationError` and do not present it as an ordinary user failure.
- Prefer immutable value transfer and capability-oriented APIs over sharing mutable reference objects.
- Keep framework objects on their required executor or context unless their contract explicitly permits transfer.
- Check toolchain and feature settings before recommending newer forms such as `@concurrent`, isolated conformances, or changed `nonisolated` behavior.

## Escape-Hatch Policy

For `@unchecked Sendable`, `@preconcurrency`, `nonisolated(unsafe)`, `MainActor.assumeIsolated`, custom executors, or detached tasks, require:

- the concrete interoperability or compatibility reason;
- the invariant that makes the operation safe;
- a focused test, assertion, or runtime check where possible;
- the dependency version or condition that permits removal;
- a named follow-up owner or review point.

Reject an escape hatch when an actor, immutable value, structured task, or API boundary can express the ownership safely.

## Required Deliverable

Return:

- confirmed toolchain and concurrency-related settings;
- exact symptom, affected target, symbol, and call path;
- current and intended isolation and task-lifetime map;
- root cause rather than only the compiler message;
- the smallest safe change and any compatibility cost;
- cancellation, error, reentrancy, and stale-result behavior;
- build, test, deallocation, and performance evidence;
- any temporary exception with its safety invariant and removal condition.

## Handoff

- Use `swiftui-development` when state wrappers, view identity, `.task`, navigation, accessibility, or SwiftUI rendering is the primary concern.
- Use `ios-architecture` when concurrency exposes unclear feature ownership, dependency direction, module boundaries, or a larger migration decision.
- Use `mobile-app-testing` for backgrounding, foregrounding, permissions, deep links, push notifications, purchases, network interruption, or device-level automation.
- Use `app-store-release` for build signing, archive validation, TestFlight, privacy declarations, or App Store submission.
