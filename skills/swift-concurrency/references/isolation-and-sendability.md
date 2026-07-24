# Swift Isolation and Sendability

Use this reference to assign mutable-state ownership and make cross-isolation transfer safe.

## Draw the Isolation Map

For each affected type or function, record:

- owned mutable state;
- current actor or context;
- callers and callbacks;
- values entering and leaving;
- suspension points;
- protocol requirements and framework constraints.

One mutable resource should have one synchronization owner. A network response, persistence object, cache, view model, and global registry may require different domains.

## Select the Owner

| Situation | Preferred boundary |
|---|---|
| UI-facing mutable state and UI commands | `@MainActor` |
| Asynchronously accessed shared mutable state | A dedicated actor |
| Synchronous short critical sections | A supported lock or `Mutex` |
| Immutable computation with no isolated state | Nonisolated function or value type |
| Legacy executor requirement | A narrow adapter; custom executor only with evidence |

Do not put CPU-heavy or blocking work on the main actor merely because its result updates UI. Separate the work from the final UI mutation.

Use `nonisolated` only when the implementation does not read or mutate isolated state. When newer toolchains change caller-isolation inheritance, confirm enabled features before relying on that behavior.

## Actor Reentrancy

An actor may process other work while an isolated method is suspended. Therefore:

1. validate inputs and current state;
2. capture immutable values needed by external work;
3. suspend;
4. re-check any state-dependent precondition;
5. commit the result only if the operation is still current.

Use operation identifiers, versions, or explicit state transitions when an older request must not overwrite a newer one.

Keep transactions that must be indivisible inside one isolated, non-suspending operation. Do not hold a lock across `await`.

## Sendable Decision Sequence

When a diagnostic reports unsafe transfer:

1. Identify the source and destination isolation domains.
2. Ask whether the value needs to cross at all.
3. Prefer an immutable value representation containing only safely transferable fields.
4. For shared mutable state, move operations behind an actor instead of transferring the object.
5. For context-bound framework data, transfer an identifier or snapshot and reacquire the object in the destination context.
6. Add explicit `Sendable` conformance only after every stored member and generic constraint is justified.

Value semantics alone do not guarantee safe transfer if a stored property contains a mutable reference.

## Reference Types and Closures

- Prefer final immutable classes or actors for reference semantics that cross domains.
- Treat a `@Sendable` closure as a transfer boundary: captured mutable variables and non-Sendable references need redesign, isolation, or immutable capture.
- Avoid storing an escaping callback without defining its executor, lifetime, and sendability contract.
- For delegates, create an isolation-aware adapter rather than marking the delegate object unchecked.
- Keep global mutable state actor-isolated or replace it with an injected owner.

## Protocol Conformance

Before changing a conformance, decide whether each requirement:

- reads actor-owned state;
- mutates actor-owned state;
- is a pure value operation;
- is called by a framework with a fixed executor contract.

Use an isolation-aware conformance when the toolchain and protocol contract support it. Mark only genuinely independent requirements `nonisolated`. Do not make state indirectly accessible through a nonisolated helper.

## Context-Bound Framework Objects

Keep objects such as managed persistence entities on the context that owns them. Across actors or contexts, prefer:

- stable identifiers;
- immutable domain values;
- request objects describing the desired operation;
- an actor or repository method that performs work within the owning context.

For Core Data, pass `NSManagedObjectID` or a value snapshot and refetch in the destination context. Do not claim `NSManagedObject` is safe by adding `@unchecked Sendable`.

## Unsafe Mechanisms

`@unchecked Sendable` is acceptable only when synchronization is already correct but invisible to the compiler. Document:

- every mutable field protected;
- the exact lock, queue, actor, or immutability invariant;
- whether subclasses or external code can violate it;
- tests or stress evidence;
- the planned safer replacement.

Use `nonisolated(unsafe)` only for similarly proven global or static access. Use `MainActor.assumeIsolated` only when an external API guarantees main-actor execution and a runtime assertion or test protects that assumption.

## Review Checklist

- Every mutable resource has one named owner.
- Actor selection reflects responsibility rather than compiler convenience.
- No invariant silently spans an `await`.
- Cross-domain values are immutable and safely transferable.
- Protocol conformances match their real execution contract.
- Global state and callbacks have explicit isolation.
- Unsafe annotations include an auditable invariant and removal condition.
