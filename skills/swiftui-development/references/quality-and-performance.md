# SwiftUI Quality and Performance

Use this reference for accessibility, localization, compatibility, tests, diagnostics, and performance work.

## Accessibility

- Use semantic controls instead of rebuilding them with gestures.
- Give icon-only and custom controls meaningful labels, values, traits, hints, and actions.
- Hide decorative images from the accessibility tree.
- Group child elements according to how a VoiceOver user should understand and operate them.
- Support Dynamic Type without truncating essential content or overlapping controls.
- Respect reduced motion and avoid encoding meaning only through color, position, or animation.
- Check focus order, modal focus containment, adjustable controls, and error announcements.

Verify with the platform accessibility inspector and VoiceOver for important journeys; modifier inspection alone is insufficient.

## Localization

- Keep user-visible strings in the project's localization system.
- Use locale-aware formatting for dates, numbers, currency, units, and lists.
- Avoid string concatenation that prevents translators from reordering grammar.
- Test long translations, right-to-left layout where supported, plural rules, and interpolated values.
- Keep accessibility labels and errors localized along with visible text.

## API Compatibility

- Establish the minimum deployment target before selecting APIs.
- Prefer the current non-deprecated API available to the supported target.
- Use `#available` at the narrowest useful boundary and implement a behaviorally valid fallback.
- Do not add an availability check whose fallback cannot compile for the minimum target.
- Verify evolving SwiftUI and framework signatures against the SDK and dependency revisions used by the repository.
- Keep unrelated deprecation migrations out of a focused fix unless they block compilation or correctness.

## Testing

Use the cheapest level that proves the behavior:

- pure unit tests for formatting, validation, reducers, and domain rules;
- model or store tests for state transitions, cancellation, errors, and dependency effects;
- view inspection, snapshot, or accessibility tests only when the repository supports a maintainable tool;
- XCUITest for critical navigation, system integration, permissions, or regressions not observable below the device boundary.

Test loading, empty, failure, retry, stale responses, rapid repeated input, dismissal, backgrounding, and restoration when the feature can encounter them.

## Performance Workflow

1. Reproduce the hitch, excessive update, memory growth, slow launch, or scrolling problem.
2. Capture evidence with Instruments, signposts, SwiftUI update diagnostics, or a focused benchmark.
3. Locate the expensive owner: state fan-out, repeated computation, image work, layout, collection identity, main-thread I/O, or uncontrolled effects.
4. Apply one targeted change.
5. Capture the same measurement again and compare.

Common corrections include:

- narrowing observed dependencies;
- preventing equivalent state assignments;
- moving transforms and decoding out of `body`;
- passing smaller immutable values to child views;
- using lazy containers for large content;
- cancelling obsolete work;
- downsampling and caching images at the appropriate boundary.

Do not add `AnyView`, `.id(UUID())`, global caches, custom equality, or manual memoization as speculative fixes. Each can hide ownership problems or introduce stale UI.

## Completion Checklist

- The affected target builds with the repository's supported Xcode version.
- Focused tests pass.
- Loading, empty, error, cancellation, and navigation states behave correctly.
- VoiceOver labels and Dynamic Type are usable.
- Localized content and supported layouts do not clip.
- Newer APIs are gated with tested fallbacks.
- Performance claims include before-and-after evidence when performance was the task.
