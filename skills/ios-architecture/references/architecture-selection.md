# iOS Architecture Selection

Use this reference when the architecture is not already fixed or a requested pattern may not fit.

## Compare the Real Constraints

| Pattern | Strong fit | Main cost | Typical UI fit |
|---|---|---|---|
| MVVM | Screen or feature state with modest effect coordination | ViewModels can become mixed-responsibility objects | SwiftUI and UIKit |
| MVI | Explicit state machines, event replay, deterministic transitions | More state and reducer ceremony | SwiftUI; adaptable to UIKit |
| TCA | Composable state, effects, navigation, and deterministic store tests | External dependency and a meaningful learning curve | SwiftUI first; UIKit possible |
| Clean Architecture | Stable domain policy and replaceable infrastructure | Layer and mapping overhead | UI-independent |
| MVP | Passive UIKit views and explicit presenter commands | Protocol and view-update boilerplate | UIKit first |
| VIPER | Existing large UIKit modules with strict role separation | High ceremony and wiring cost | UIKit first |
| Coordinator | Reusable flows, deep links, and navigation ownership | Coordinator lifecycle can become another state system | SwiftUI, UIKit, or mixed |
| Reactive | Realtime feeds, search pipelines, or event-stream composition | Cancellation, scheduler, and error semantics can become opaque | Supporting concern for either UI stack |

## Decision Sequence

1. Preserve the existing feature pattern when it remains understandable, testable, and compatible with the new behavior.
2. If the main problem is domain or infrastructure coupling, choose Clean Architecture for those layers and then choose one presentation pattern.
3. If every user event must produce an explicit, testable state transition, choose MVI or TCA.
4. Choose TCA over framework-free MVI only when its dependency and team workflow are accepted or already established.
5. If the feature has ordinary screen state and a small number of effects, choose MVVM.
6. For a passive UIKit screen, consider MVP. Use VIPER only when existing module conventions or scale justify the extra roles.
7. Add Coordinator when flow reuse, deep links, restoration, or UIKit presentation ownership is the actual problem.
8. Add a reactive layer when stream composition is central; do not rename an otherwise ordinary feature "Reactive Architecture" merely because it uses Combine.

## Fit Check

Before committing, answer:

- Which OS versions, UI frameworks, and targets must coexist?
- What is the smallest boundary that needs architectural treatment: one screen, a feature, a package, or the whole app?
- Is state mostly local UI state, shared feature state, or an app-wide state machine?
- How many concurrent effects, subscriptions, retries, and cancellation paths exist?
- Must navigation be deep-linkable, restorable, reusable, or shared between SwiftUI and UIKit?
- Are domain rules valuable outside the UI or current persistence implementation?
- Which dependencies may be added, and which conventions is the team already able to maintain?
- What tests must be deterministic without network, time, storage, or system services?

Return `fit` only when the chosen pattern improves these constraints without disproportionate ceremony. Otherwise return `mismatch`, name the closest alternative, and explain the trade-off.

## Combination Rules

Use one owner per concern:

- Clean Architecture owns dependency direction between domain, application, and infrastructure.
- MVVM, MVI, TCA, MVP, or VIPER owns presentation behavior for a feature.
- Coordinator owns flow and navigation orchestration.
- Reactive pipelines own stream transformation, scheduling, and cancellation.

Do not combine two presentation patterns inside the same steady-state feature. During migration, mark old and new boundaries and prevent new dependencies from flowing back into the old design.
