# Swift Concurrency Verification and Performance

Use this reference after defining the intended isolation and task-lifetime model.

## Build Evidence

Build the exact affected application, extension, package, and test targets with the same configuration used by CI.

Capture:

- toolchain and SDK version;
- language mode and concurrency-related settings;
- build command or Xcode scheme and destination;
- diagnostic count before and after;
- any warning promoted to an error in CI.

A clean editor or static scan does not replace Xcode or `swift build`.

## Focused Test Matrix

| Risk | Minimum proof |
|---|---|
| Actor-owned state | Concurrent calls preserve the declared invariant |
| Cancellation | Work stops, cleanup occurs, and no stale result is committed |
| Reentrancy | State changed during suspension is revalidated |
| Task group failure | Siblings and partial results follow the declared policy |
| Continuation bridge | Success, failure, cancellation, and duplicate-callback paths terminate once |
| Async stream | Buffering, finish, error, cancellation, and producer cleanup behave as designed |
| Main-actor state | Mutations occur through the intended isolated API |
| Lifetime | Owner and task deallocate after the terminal event |

Use Swift Testing or XCTest according to the repository's existing target and toolchain. Do not migrate the whole test framework as part of a concurrency fix.

## Determinism

- Inject clocks, sleep behavior, identifiers, network clients, persistence, and event sources where the test needs control.
- Prefer observable state transitions and completion signals over arbitrary delays.
- Use serial execution only when the behavior itself is intentionally serialized, not to conceal shared test state.
- Repeat stress-sensitive tests enough to exercise interleavings, but keep one deterministic assertion path for CI.
- Reset global or actor-owned fixtures between tests.

For legacy XCTest code, use async-aware fulfillment APIs inside async tests rather than blocking waits.

## Runtime Diagnostics

Use the tool that answers the suspected failure:

- compiler isolation diagnostics for static boundary violations;
- Thread Sanitizer where the target and scenario support it;
- Instruments and Swift concurrency views for task, actor, and executor behavior;
- Memory Graph or Allocations for retained owners and tasks;
- signposts for operation lifetime, actor hops, and latency;
- debugger task and queue inspection for a reproducible stall.

Do not infer correctness solely from a lack of crashes. Do not infer actor ownership from the current thread name.

## Performance Workflow

1. Reproduce latency, contention, excessive task creation, priority inversion, main-actor blocking, or memory growth.
2. Record a baseline with a representative workload and device or simulator.
3. Locate the dominant cost: blocking I/O, CPU work, actor serialization, repeated suspension, unbounded fan-out, buffer growth, task churn, or redundant UI hops.
4. Apply one targeted change.
5. Repeat the same measurement and compare.

Possible corrections include:

- moving blocking or CPU-heavy work away from the UI owner;
- batching actor operations without suspending through an invariant;
- bounding task-group concurrency;
- reducing unnecessary executor hops;
- cancelling obsolete work earlier;
- using a bounded stream buffer;
- replacing repeated polling with an event source;
- reducing task creation in hot loops.

Do not replace actors with locks, add detached tasks, or remove isolation based on intuition alone.

## Review Finding Order

Report:

1. data races or unsafe transfer;
2. incorrect isolation or protocol contracts;
3. cancellation, lifetime, continuation, or stream termination defects;
4. actor reentrancy and stale-result bugs;
5. deadlock, blocking, or starvation hazards;
6. measured performance regressions;
7. optional modernization.

Separate compile-time errors, proven runtime defects, plausible risks, and style preferences.

## Completion Evidence

- Exact targets build under the intended strictness.
- Focused async and lifetime tests pass.
- Cancellation and error paths have been exercised.
- Temporary unsafe annotations are documented.
- No unrelated warnings or architecture changes were bundled.
- Performance claims include comparable before-and-after evidence.
