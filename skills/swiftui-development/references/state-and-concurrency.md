# SwiftUI State and Concurrency

Use this reference for data flow, Observation, property wrappers, asynchronous work, and lifecycle behavior.

## Assign Ownership First

Classify each value:

- immutable input from a parent;
- transient view state owned by this view;
- shared feature state owned by an observable model or store;
- editable projection into state owned elsewhere;
- dependency supplied by composition or environment;
- derived display value that should be computed rather than stored.

Do not select a property wrapper before deciding ownership.

## Observation by Deployment Target

For a project whose supported OS and Swift version allow Observation:

- own an `@Observable` reference in private `@State` when its lifetime belongs to the view;
- use `@Bindable` only where bindings to an injected observable model are required;
- keep observation dependencies narrow so unrelated model changes do not invalidate large view trees.

For code using `ObservableObject`:

- use `@StateObject` when the view creates and owns the object;
- use `@ObservedObject` for an object whose lifetime is owned elsewhere;
- use `@EnvironmentObject` only when the existing app intentionally establishes that shared dependency.

Do not convert an entire feature from one observation model while making an unrelated UI fix. Follow project conventions until migration is explicitly in scope.

## Wrapper Rules

- Keep `@State` and `@FocusState` private.
- Do not wrap a passed value in `@State`; that captures initial state instead of tracking the parent.
- Use `@Binding` when a child is allowed to mutate a parent's value. Prefer a value plus action closure when mutation should remain controlled by the owner.
- Keep read-only inputs as plain properties.
- Use environment values for truly ambient context, not as a general service locator.
- Avoid mutable reference defaults or freshly created values in custom environment keys.

## Feature State

Represent meaningful phases explicitly:

```swift
enum LoadState<Value> {
    case idle
    case loading
    case loaded(Value)
    case empty
    case failed(message: String)
}
```

Adapt the exact cases to the feature. Avoid independent booleans that permit impossible combinations such as loading and failed at the same time.

## Structured Concurrency

- Isolate UI-facing state owners to `@MainActor`.
- Start view-lifetime work with `.task` and key replaceable work with `.task(id:)` where appropriate.
- Store a task only when another owner must cancel or await it explicitly.
- Check cancellation before committing expensive or stale results.
- Avoid unstructured tasks in button actions when a feature model or store should own the effect.
- Do not use detached tasks to bypass actor errors.
- Make values transferred between actors safely transferable and keep non-Sendable framework objects on their owning actor.

For search or rapidly changing input:

1. capture the current query;
2. cancel or supersede previous work;
3. debounce only when user experience requires it;
4. ignore results that no longer match current intent;
5. surface a deliberate empty, error, or retry state.

## Dependencies and Errors

Inject network, persistence, clock, identity, notification, analytics, and system-service capabilities through the architecture already used by the project. Translate infrastructure errors before displaying them. Keep user-facing copy, recovery action, logging, and retry policy separate.

Do not silently discard cancellation and do not display cancellation as a user error.

## Review Checklist

- One owner exists for each mutable value.
- Derived values are not redundantly stored.
- Observation matches the deployment target and object lifetime.
- Bindings expose only intended mutations.
- UI state updates run on the main actor.
- Every effect has a lifetime, cancellation path, and stale-result policy.
- Loading, empty, offline, failure, and retry behavior cannot form contradictory state.
