# iOS Architecture Boundaries

Use this reference after selecting the architecture.

## Default Feature Boundary

Prefer feature-first organization, then add layers only where the feature needs them:

```text
App/
  Composition/
  Navigation/
Core/
  Networking/
  Persistence/
  Observability/
Features/
  Orders/
    Presentation/
    Domain/
    Data/
    Tests/
```

Do not create empty layers for symmetry. A small feature may need only a view, state owner, dependency protocol, and tests.

## MVVM

- View: render state, bind inputs, and send user intent.
- ViewModel: own screen state and coordinate feature dependencies.
- Services or repositories: perform network, persistence, clock, notification, and SDK work.
- Coordinator or route state: own cross-screen navigation when it exceeds local presentation.

Keep formatting close to presentation, but move reusable business rules into domain types or use cases. Split a ViewModel when it owns navigation, persistence, analytics policy, and several unrelated child features.

## MVI

- State: one explicit snapshot of renderable feature state.
- Intent or event: user and lifecycle input.
- Reducer: pure state transition.
- Effect handler: asynchronous work that feeds results back as events.
- Store: serialization, cancellation ownership, and state publication.

Keep reducers pure. Assign stable cancellation identities to replaceable work such as search. Do not hide state changes inside services or views.

## TCA

Model each feature with state, actions, reducer logic, dependencies, and scoped child features. Keep external I/O behind declared dependencies and test effect sequences with the version of TCA already pinned by the project.

Do not introduce TCA for one isolated screen in an otherwise framework-free app without an explicit adoption decision. Verify current APIs from the package revision instead of assuming examples from another TCA version compile.

## Clean Architecture

Dependency direction should be:

```text
Presentation -> Application/Use Cases -> Domain
Data adapters -----------------------> Domain ports
Composition root wires concrete dependencies
```

- Domain types express invariants without importing UI, networking, persistence, or analytics frameworks.
- Use cases coordinate domain behavior and capability-oriented ports.
- Data adapters translate transport and storage representations at the boundary.
- Presentation adapts use-case results into feature state.

Avoid one protocol per concrete type. Add a port where replacement, deterministic testing, or policy isolation provides real value.

## MVP and VIPER

Use MVP for a passive UIKit view:

- View protocol exposes rendering commands and user events.
- Presenter contains presentation decisions.
- Model or services provide data and business behavior.
- Coordinator owns navigation when flows extend beyond the screen.

Use VIPER when an existing UIKit module already benefits from separate View, Interactor, Presenter, Entity, Router, and assembly responsibilities. Keep each role narrow and test the Presenter and Interactor independently. Do not reproduce VIPER ceremony in SwiftUI solely to preserve names.

## Coordinator

Let the coordinator own route transitions, child-flow lifetime, deep-link interpretation, and UIKit presentation. Keep business state in the feature.

For SwiftUI, prefer typed route or path state that can be reconstructed. For UIKit, keep navigation-controller operations out of ViewModels and Presenters. Test route decisions without presenting real screens.

## Reactive Streams

Use Combine or RxSwift for streams that benefit from composition: realtime updates, debounced search, connectivity, or multi-source synchronization.

Make ownership explicit for subscriptions, scheduler or actor hops, backpressure, retry, and cancellation. Convert stream results into the primary presentation pattern's state instead of letting publishers leak through every layer.

## Dependency and Concurrency Boundaries

- Inject capabilities such as `OrdersClient`, `Clock`, `IDGenerator`, or `SessionStore`.
- Keep concrete URLSession, database, keychain, notification, and analytics implementations in adapters.
- Mark UI-facing state owners `@MainActor`.
- Use structured concurrency and make cancellation observable at feature boundaries.
- Avoid `Task.detached` unless independence from actor context and lifetime is intentional and documented.
- Make values crossing actors `Sendable` where applicable.
- Translate infrastructure errors into domain or presentation errors at the owning boundary.

## Testing Map

| Boundary | Primary proof |
|---|---|
| Domain rule | Pure unit test |
| Reducer or state transition | State/action sequence test |
| ViewModel or Presenter | Fake dependencies plus state/output assertions |
| Use case | Fake ports plus domain results and emitted effects |
| Adapter | Integration test against the actual protocol or storage mapping |
| Navigation | Route and deep-link decision test |
| SwiftUI rendering | Focused UI, snapshot, or accessibility test where maintained |
| Critical user journey | Small end-to-end device test |
