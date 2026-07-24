# SwiftUI Views and Navigation

Use this reference for view composition, identity, collections, layout, navigation, presentations, and previews.

## View Composition

- Keep `body` declarative and cheap.
- Extract a subview when it has its own state, a meaningful responsibility, repeated use, independent invalidation needs, or a large branch that obscures the parent.
- Prefer a dedicated `View` type over a large computed view property when independent identity and dependency tracking matter.
- Keep business rules, network access, parsing, sorting of large collections, and image decoding outside `body`.
- Use `ViewModifier`, styles, and small reusable components for repeated appearance or interaction.
- Bridge through representable types only when native SwiftUI cannot meet the requirement.

Avoid extracting every few lines. A local expression is appropriate when it remains simple and shares the parent's responsibility.

## Identity and Collections

- Give mutable models stable identity that outlives one rendering pass.
- Do not use offsets, indices, random identifiers, or mutable display text as persistent identity.
- Filter or transform collections before the `ForEach` hot path when the work is significant.
- Keep row structure stable and move row-specific state into the row when ownership belongs there.
- Use lazy containers for large scrollable data, then measure before adding further optimization.

Identity changes reset local state, animations, focus, and navigation. Treat `.id(...)` as a semantic reset tool, not a general refresh mechanism.

## Navigation

Model destinations as typed values when programmatic navigation, deep links, restoration, or tests require it.

```swift
enum Route: Hashable {
    case details(Item.ID)
    case settings
}
```

- Let the feature or coordinator own path mutations.
- Register destinations close to the navigation container that owns the path.
- Keep route values small and reconstruct destination data through a dependency when large models may become stale.
- Separate route decisions from destination rendering.

For simple user-driven navigation, a value-based `NavigationLink` may be enough. Do not introduce a global router for one local transition.

## Sheets and Covers

- Prefer item- or enum-driven presentation when each modal needs distinct data.
- Keep the presented view's save or cancel behavior explicit.
- Clear or replace presentation state from one owner.
- Avoid a collection of independent booleans that can present incompatible modals simultaneously.
- Test dismissal after success, failure, cancellation, and external state changes.

## Layout and Adaptation

- Use stacks, grids, frames, alignment guides, and container-relative APIs before reaching for broad geometry measurement.
- Support safe areas intentionally and avoid hardcoded screen dimensions.
- Test compact and regular widths, orientation where supported, long localized text, Dynamic Type, keyboard presentation, and split-view behavior.
- Keep touch targets usable and avoid clipping content when text grows.

## Previews

Make previews deterministic:

- use local fixture data and fake dependencies;
- include loading, content, empty, error, and long-text states;
- cover light and dark appearance plus representative text sizes;
- avoid production network, authentication, analytics, or mutable shared storage.

Previews improve iteration but do not replace a target build or behavior test.

## Review Checklist

- `body` contains no I/O or expensive repeated work.
- Subview boundaries follow responsibility and invalidation needs.
- Collection and navigation identities are stable.
- Route and presentation state has one owner.
- Deep links and restoration reconstruct valid state where required.
- Layout survives text scaling, localization, safe areas, and supported size classes.
- Previews are local, deterministic, and representative.
