# Swift Tasks and Async Streams

Use this reference for task structure, cancellation, callback bridges, and repeated asynchronous values.

## Choose the Smallest Structure

| Shape | Use |
|---|---|
| Ordered dependent steps | Sequential `await` |
| Small fixed set of independent results | `async let` |
| Dynamic children collected within one scope | Throwing or non-throwing task group |
| One owned bridge from synchronous code | Stored or scoped `Task` |
| Multiple values over time | `AsyncSequence`, `AsyncStream`, or `AsyncThrowingStream` |

Do not create a task merely because a function is async. Propagate `async` to the owning call site when possible.

## Task Ownership

For every unstructured task, answer:

- who creates it;
- who stores or awaits it;
- what event cancels it;
- whether it may outlive the creator;
- where its error and result go;
- which actor its synchronous prefix uses;
- what values it captures.

If none of these owners can be named, the task should usually become structured work or move behind a longer-lived service.

`Task.detached` does not inherit actor context, task-local values, or structured lifetime in the same way as an ordinary child. Reserve it for intentionally independent work with safely transferable inputs and an explicit result path.

## Entry Isolation

Examine statements before the first suspension:

- If the prefix touches UI-owned state, the task must begin on the main actor.
- If the prefix is independent work, avoid forcing it onto the main actor.
- If the toolchain supports explicit `@concurrent`, confirm its language-mode and feature requirements before using it.
- Prefer an async API whose isolation expresses the work over repeated manual actor hops.

Do not assume a task starts on a background thread. Reason about actor inheritance and the called async function's isolation.

## Cooperative Cancellation

Cancellation is a request. Long-running work must observe it.

- Let cancellation-throwing APIs propagate `CancellationError`.
- Add `Task.checkCancellation()` or `Task.isCancelled` checks around expensive loops and non-cancelling APIs.
- Cancel sibling work when one failure makes remaining results useless.
- Stop retry, debounce, polling, and backoff loops promptly.
- Clean up delegates, observations, continuations, file handles, and producer callbacks.
- Do not convert cancellation into a retry or visible error unless product behavior explicitly requires it.

For replaceable work such as search, capture an operation identity or compare current intent before applying a result.

## Task Groups

- Add only child work that belongs to the group's scope.
- Decide whether result order follows completion or input order.
- Limit fan-out when inputs may be large or downstream capacity is bounded.
- Define partial-failure policy before starting children.
- Do not mutate shared nonisolated collections from child tasks; collect results through the group or an actor.
- Verify that cancellation reaches underlying operations, not only the Swift child task.

## One-Shot Callback Bridges

Use a checked continuation only when the source API produces one terminal result.

The adapter must guarantee:

- exactly one resume across success, error, timeout, and cancellation;
- no path that forgets to resume;
- cleanup of callback registrations;
- documented executor behavior;
- cancellation bridging when the source API supports cancellation.

If progress or repeated events are meaningful, use a stream instead.

## AsyncStream Lifecycle

Define:

- one producer and the intended number of consumers;
- bounded or unbounded buffering and drop policy;
- who calls `finish()` or finishes with an error;
- `onTermination` cleanup;
- behavior when the consumer cancels;
- behavior when values arrive after termination.

An `AsyncStream` iterator is not automatically a broadcast system. When multiple consumers require every event, use a deliberately designed multicast owner or an appropriate dependency.

Prefer a bounded buffer for an untrusted or faster producer. Record whether oldest or newest values may be dropped.

## Streams and Reactive Migration

Use a one-shot async method for a single result and a sequence for time-varying values. Do not reproduce a long Combine or Rx pipeline mechanically if ordinary tasks and state transitions express the behavior more clearly.

Add Swift Async Algorithms only when operations such as debounce, throttle, merge, or channel semantics are actually needed and the dependency is approved. Preserve scheduler, buffering, ordering, error, and cancellation behavior during migration.

## Lifetime and Memory

- A task retaining its owner until completion may be correct for short work; prove that long-lived or infinite work terminates.
- Weak capture alone does not define cancellation or producer cleanup.
- Store observation tasks when the owner must cancel them during teardown.
- Verify deallocation after dismissal, replacement, sign-out, or feature shutdown.
- Avoid accidental self-retention inside stream termination and callback closures.

## Review Checklist

- Structured concurrency is used wherever parent-child lifetime applies.
- Every unstructured task has an owner and terminal path.
- Cancellation reaches loops, retries, and underlying APIs.
- Continuations resume exactly once.
- Stream buffer and termination semantics are explicit.
- Consumer count matches the stream design.
- Long-lived tasks and producers release their owners.
