# Swift Async, Parallel, and Isolation Testing

Use this reference for asynchronous functions, callbacks, repeated events, cancellation, actor isolation, and flaky parallel execution.

## Contents

- [Classify the Asynchronous Contract](#classify-the-asynchronous-contract)
- [Await Directly or Bridge Once](#await-directly-or-bridge-once)
- [Confirm Event Counts](#confirm-event-counts)
- [Cancellation Coverage](#cancellation-coverage)
- [Parallel Independence](#parallel-independence)
- [Serialization Policy](#serialization-policy)
- [Actor Isolation](#actor-isolation)
- [Flake Diagnosis](#flake-diagnosis)

## Classify the Asynchronous Contract

| Contract | Test approach |
|---|---|
| One async result or error | Call and `await` it directly |
| One legacy completion callback | Wrap with a checked continuation when no async API exists |
| A known number of event callbacks | Use a confirmation with an explicit count |
| Values over time | Consume an `AsyncSequence` or controlled stream |
| Long-running cancellable work | Start through an owned task and assert cancellation effects |

Do not use time-based sleep as the primary signal that asynchronous work probably finished.

## Await Directly or Bridge Once

Test an async API by awaiting the real result in an `async` test:

```swift
@Test
func loadsProfile() async throws {
    let profile = try await ProfileClient.stubbed.load(id: "A-17")
    #expect(profile.status == .active)
}
```

When a legacy API exposes only one completion callback, create one narrow adapter with a checked continuation:

```swift
func awaitLegacyValue(from loader: LegacyLoader) async throws -> Data {
    try await withCheckedThrowingContinuation { continuation in
        loader.load { result in
            continuation.resume(with: result)
        }
    }
}
```

The adapter must reach exactly one resume path for success and failure. If the legacy operation supports cancellation, also arrange for cancellation to unregister the callback and finish the adapter instead of leaving its continuation suspended.

## Confirm Event Counts

Use `confirmation` when the observable contract is callback delivery rather than a returned value:

```swift
@Test
func publishesAtLeastOneUpdate() async {
    await confirmation(
        "Receives an update",
        expectedCount: 1...
    ) { received in
        let observation = Updates.shared.observe { _ in
            received()
        }
        defer { observation.cancel() }

        await Updates.shared.refresh()
    }
}
```

- Pass an integer such as `expectedCount: 2` when extra or missing callbacks are both defects.
- Pass a lower-bounded range such as `1...` when one or more events are valid.
- Use a bounded range only when both limits are part of the behavior.
- Install the observer before triggering the event and remove it before the confirmation scope exits.

The confirmation body must not return until the operation has had its complete opportunity to publish the expected events; `confirmation` does not wait for callbacks that arrive afterward.

Do not use an unbounded range with no lower limit: zero callbacks would then provide no useful proof.

## Callback and Event Safety

A continuation adapter must resume exactly once on success, failure, and any terminal cancellation path. Keep it small and remove callback registrations when the test finishes.

For multi-event behavior:

- define expected count and ordering;
- ensure the observation is active before triggering the event;
- isolate counters and captured mutable values safely;
- stop the producer after the required terminal condition;
- fail on unexpected extra events when they violate the contract.

Use `swift-concurrency` when the production callback bridge or stream lifecycle is itself unsafe.

For multiple concurrent producers, keep captured mutable state inside an actor or another synchronization-safe owner:

```swift
actor EventLog<Value: Sendable> {
    private var values: [Value] = []

    func append(_ value: Value) {
        values.append(value)
    }

    func snapshot() -> [Value] {
        values
    }
}
```

If the callback itself cannot `await`, adapt it to an `AsyncStream` or use a small lock-protected bridge. Avoid spawning untracked tasks solely to mutate a counter because the test can finish before those tasks do.

## Cancellation Coverage

Verify:

- the cancellation request reaches the operation;
- expensive loops and underlying APIs observe it;
- cleanup runs;
- no stale result mutates state afterward;
- cancellation is not transformed into an ordinary user error;
- owned tasks and observers release their parent.

Inject a controllable clock or suspension point for retry, debounce, timeout, and polling tests. Avoid real wall-clock delays.

## Parallel Independence

Assume the runner may schedule tests concurrently and without a stable order.

Each test should own:

- mutable models and repositories;
- database namespace or in-memory store;
- temporary directory and file names;
- stub server state;
- environment overrides;
- tasks, continuations, and observers.

Resetting one global after a test is weaker than avoiding the shared global because another test may access it before cleanup.

## Serialization Policy

Use serialization only when a real resource cannot yet be isolated, such as a migration test against one process-wide store.

Document:

- the shared resource;
- why per-test isolation is not currently possible;
- the affected suite only;
- the owner and removal milestone;
- a separate parallel-safe fast path where practical.

Do not serialize unrelated suites or the whole target to make a flaky failure disappear.

`@Suite(.serialized)` orders that suite's contained tests, parameterized cases, and nested suites relative to one another; unrelated suites may still run concurrently. On `@Test`, `.serialized` only changes the ordering of parameterized cases and has no effect on a non-parameterized test.

Use a global no-parallel runner option only for diagnosis or a deliberately isolated integration lane, not as the permanent repair for shared mutable state.

## Actor Isolation

- Mark a test `@MainActor` only when the API under test requires main-actor access.
- Keep parsers, domain rules, and non-UI services outside the main actor.
- Access actor-owned results through their isolated API.
- Do not capture a mutable local variable from concurrent callbacks without safe ownership.
- Reproduce actor reentrancy or stale-result behavior with controlled suspension points rather than relying on scheduling luck.

## Flake Diagnosis

1. Run the single failing argument or test.
2. Run its suite repeatedly and with neighboring tests.
3. Compare destinations, plans, environment, and dependency state.
4. Identify timing, order, shared resource, actor, cancellation, or external-service coupling.
5. Replace the uncontrolled dependency or add an observable synchronization point.
6. Remove temporary retries or serialization and repeat the original run.

## Completion Checklist

- Async results are awaited or confirmed through a deterministic terminal signal.
- Continuations cannot leak or resume twice.
- Confirmation counts express exact, minimum, or bounded event semantics.
- Cancellation and cleanup are asserted.
- Tests do not share mutable fixtures.
- Main-actor isolation reflects the production contract.
- Serialization is narrow, documented, and temporary.
- The corrected test passes repeatedly without sleep-based timing.
