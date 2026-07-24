# Swift Test Parameterization, Traits, and Plans

Use this reference when consolidating repeated cases, organizing cross-suite metadata, or designing local and CI test selections.

## Contents

- [Decide Whether to Parameterize](#decide-whether-to-parameterize)
- [Use the Arguments API](#use-the-arguments-api)
- [Preserve Selective Reruns](#preserve-selective-reruns)
- [Model Test Cases Explicitly](#model-test-cases-explicitly)
- [Apply Built-In Traits](#apply-built-in-traits)
- [Scope Known Issues](#scope-known-issues)
- [Declare and Apply Tags](#declare-and-apply-tags)
- [Test Plan Design](#test-plan-design)
- [Xcode Navigation and Reports](#xcode-navigation-and-reports)

## Decide Whether to Parameterize

Use one parameterized test when:

- every case follows the same arrange, act, and assert sequence;
- only input and expected output vary;
- each case has a useful diagnostic description;
- every argument has a stable matching identity when selective rerun is required;
- the resulting case list remains easy to understand.

Keep separate tests when cases require different control flow, dependencies, or failure explanations.

## Use the Arguments API

Pass one collection to `@Test(arguments:)` when each element is one independently reported case:

```swift
@Test(arguments: 1...3)
func acceptsRetryCount(_ count: Int) {
    #expect(RetryPolicy(count: count).isValid)
}
```

Use `CaseIterable.allCases` when the behavior is a universal property of every enum case:

```swift
enum Currency: String, CaseIterable, Sendable {
    case usd
    case eur
}

@Test(arguments: Currency.allCases)
func supportsEveryCurrency(_ currency: Currency) {
    #expect(Quote.supports(currency))
}
```

Passing two collections directly creates their Cartesian product. Use it only when every combination has meaning:

```swift
@Test(
    arguments: [Currency.usd, .eur],
    [CustomerTier.standard, .premium]
)
func quotesEveryCurrencyAndTier(
    currency: Currency,
    tier: CustomerTier
) {
    #expect(Quote.make(currency: currency, tier: tier).amount >= 0)
}
```

Swift Testing accepts at most two argument collections directly. For three or more related values, or when only selected combinations are valid, package the inputs in a tuple or small `Sendable` scenario type:

```swift
struct FormatScenario: Sendable {
    let locale: AppLocale
    let cents: Int
    let expected: String
}

@Test(arguments: [
    FormatScenario(locale: .enUS, cents: 1000, expected: "$10.00"),
    FormatScenario(locale: .deDE, cents: 1000, expected: "10,00 €")
])
func formatsPrice(_ scenario: FormatScenario) {
    #expect(
        PriceFormatter.format(cents: scenario.cents, locale: scenario.locale)
            == scenario.expected
    )
}
```

A dictionary is also a collection of key-value pairs and can be passed as arguments when mapping semantics are natural and iteration order is irrelevant. Prefer an explicit tuple or scenario array when stable case presentation matters.

Use `zip` when two collections are intentionally paired one-to-one and their equal length is guaranteed:

```swift
let locales: [AppLocale] = [.enUS, .deDE]
let expectedDisplays = ["$10.00", "10,00 €"]

@Test(arguments: zip(locales, expectedDisplays))
func formatsKnownLocales(_ locale: AppLocale, expected: String) {
    #expect(PriceFormatter.format(cents: 1000, locale: locale) == expected)
}
```

Prefer a scenario type when unequal lengths could silently truncate `zip`, when values need names, or when the fixture will grow.

## Preserve Selective Reruns

Swift Testing can selectively run a parameterized case only when every argument in that case can be matched deterministically. The runner checks these conformances in precedence order:

1. `CustomTestArgumentEncodable`;
2. `RawRepresentable` whose `RawValue` conforms to `Encodable`;
3. `Encodable`;
4. `Identifiable` whose `ID` conforms to `Encodable`.

If any argument satisfies none of these paths, the test can still be parameterized, but that individual case cannot be selected for an isolated rerun.

Use `CustomTestArgumentEncodable` when a large or unstable domain value needs a smaller identity:

```swift
struct CheckoutScenario: Sendable, CustomTestArgumentEncodable {
    let id: String
    let itemCount: Int
    let expectedTotal: Int

    func encodeTestArgument(to encoder: some Encoder) throws {
        var container = encoder.singleValueContainer()
        try container.encode(id)
    }
}
```

The encoded form must be stable and unique among the cases in that test. Encode only fields needed to identify the case; do not use randomized values, localized descriptions, timestamps, or mutable object state.

## Model Test Cases Explicitly

Prefer colocated scenario values:

```text
(input, expected)
(request, expectedStatus, expectedBody)
(locale, amount, expectedDisplay)
```

Use explicit tuples or small scenario structs when values must stay paired. Parallel arrays combined with `zip` can silently lose coverage if their lengths differ, and separately reordered enum case lists can misalign expectations.

Use a Cartesian product only when every combination is meaningful. Otherwise select intentional pairs to prevent a large, slow, low-signal matrix.

Keep expected values independent. Do not derive the oracle with the same rule or branch structure used by production code.

Do not hide cases inside a loop in one non-parameterized test:

```swift
// Avoid: one failure obscures the case identity and cannot be rerun alone.
@Test
func formatsEveryScenario() {
    for scenario in formatScenarios {
        #expect(format(scenario.input) == scenario.expected)
    }
}
```

Pass `formatScenarios` to `@Test(arguments:)` so each case receives its own report entry and, when its arguments support deterministic matching, its own rerun target.

## Parameterization Review

- Keep argument data close to the test unless several tests intentionally share one governed fixture set.
- Use domain names rather than anonymous booleans or numeric flags.
- Keep parameter descriptions readable in Xcode reports.
- Avoid `if` or `switch` branches that reproduce production behavior inside the test.
- Split exceptional cases from the common parameterized path when their expected behavior differs.
- Use all enum cases only for a universal property, not for a hidden case-to-result mapping.

## Apply Built-In Traits

| Purpose | Appropriate metadata |
|---|---|
| Human-readable report label | Display-name trait |
| Cross-suite selection | Tag |
| Platform or environment condition | Availability or enabled/disabled condition |
| Tracked temporary failure | Known-issue scope or bug-linked trait |
| Execution budget | Time-limit trait |
| Unavoidable shared-resource ordering | Narrow serialization |

Apply suite-level traits only when every contained test inherits the same meaning. A broad trait can silently change many tests.

Every disabled or quarantined test needs a reason, owner, and exit condition. Prefer preserving execution and report signal with a known-issue mechanism when the failure is expected but still informative.

Use current toolchain-supported traits directly on `@Test` or `@Suite`:

```swift
@Test(
    "Remote quote returns within its budget",
    .enabled(if: Runtime.hasNetwork),
    .timeLimit(.minutes(1)),
    .bug("https://tracker.example.test/APP-42")
)
func remoteQuoteCompletes() async throws {
    #expect(try await QuoteClient.live.fetch() != nil)
}

@Test(.disabled(if: Runtime.isMaintenanceWindow, "Service unavailable"))
func serviceHealthCheck() async throws {
    #expect(try await HealthClient.live.status() == .ready)
}
```

Use `.disabled("reason")` for an unconditional temporary skip. Trait conditions may be evaluated more than once, so keep them deterministic and free of destructive side effects. When several conditions are present, all must permit execution.

Use `.timeLimit(.minutes(...))`; the current Swift Testing API uses minute-granularity time limits rather than ordinary Swift `Duration` seconds.

## Scope Known Issues

Use `withKnownIssue` around only the operation whose issue is understood. Keep unrelated failures outside the scope:

```swift
@Test
func refreshesCachedQuote() throws {
    try withKnownIssue(
        "APP-42: cache refresh can lose its file",
        isIntermittent: true
    ) {
        try QuoteCache.live.refresh()
    } when: {
        Runtime.isAffected
    } matching: { issue in
        issue.error is QuoteCache.FileMissingError
    }

    #expect(QuoteCache.live.lastKnownQuote != nil)
}
```

- Leave `isIntermittent` at its default when the issue is expected to reproduce; set it to `true` only when absence of the issue should not itself be reported.
- Use `when:` for a deterministic affected-platform or configuration precondition.
- Use `matching:` to accept only the known issue shape; unmatched issues must still fail the test.
- Keep both closures free of side effects because the matcher or condition may be evaluated more than once.
- Track an owner, bug, and exit condition. Remove the scope when the defect is fixed.

## Declare and Apply Tags

Declare reusable tags as members of `Tag`, then apply them with `.tags(...)`. A suite tag is inherited by its contained tests and nested suites.

```swift
extension Tag {
    @Tag static var smoke: Self
    @Tag static var billing: Self
}

@Suite(.tags(.billing))
struct InvoiceTests {
    @Test(.tags(.smoke))
    func createsDraftInvoice() {
        #expect(Invoice.draft.lines.isEmpty)
    }
}
```

Do not create aliases outside `Tag` extensions; the runner will not recognize them as separately declared tags.

## Tag Taxonomy

Keep a small stable vocabulary tied to workflow, for example:

- `core` for fast required checks;
- `integration` for real adapter or storage coverage;
- `regression` for a protected defect;
- `network` for controlled service interaction;
- `quarantined` for temporary CI isolation.

Tags supplement feature suites; they do not replace them. Avoid personal, temporary, or ambiguous labels.

## Test Plan Design

Define plans around feedback speed and dependencies:

| Plan | Typical selection | Intended use |
|---|---|---|
| Fast | Core unit and regression tags | Local iteration and pull requests |
| Integration | Storage, network adapters, migrations | Scheduled or gated integration runs |
| Release | Required core, regression, and selected integration coverage | Release candidate evidence |
| Quarantine | Known unstable cases kept visible | Repair queue, never the only run |

Record include and exclude rules explicitly. Do not rely on fragile test-name matching when stable tags can express the selection.

When a plan contains several selected tags, choose the match rule deliberately:

- **All tags** requires a test to carry every selected tag and is Xcode's default.
- **Any tags** matches a test carrying at least one selected tag.

Check the plan preview after changing include, exclude, or match rules; a small logic change can unintentionally remove required release coverage.

## Xcode Navigation and Reports

- Switch the Test Navigator grouping to **Tag** to inspect and run a cross-suite category.
- Use the tag-aware filter field for focused local runs.
- Open a failed parameterized case and rerun that argument before rerunning the whole suite.
- In the Test Report, group failures by tag, bug, destination, and argument to distinguish one bad case from a systemic dependency or configuration problem.
- Keep the same tag selection in local plans, CI, and release evidence when they are intended to prove the same gate.

## Report Triage

1. Check whether failures cluster by tag, argument, destination, or dependency.
2. Open one representative case and reproduce it alone.
3. Re-run the containing suite or plan to detect shared-state dependence.
4. Correct the common cause.
5. Remove obsolete bug links, disables, serialization, or quarantine rules.

## Completion Checklist

- Repetition is reduced without hiding materially different behaviors.
- Parameter cases cannot silently lose alignment.
- Expected values are independent from the implementation.
- Traits are scoped to the smallest correct test or suite.
- Conditions are deterministic and time limits use supported minute granularity.
- Tag vocabulary is stable and documented through usage.
- Xcode any/all tag matching is selected intentionally and previewed.
- Local, CI, integration, and release plans have distinct purposes.
- Disabled and known-issue coverage has a tracked exit path.

## Official API References

- [Implementing parameterized tests](https://developer.apple.com/documentation/testing/parameterizedtesting)
- [`CustomTestArgumentEncodable`](https://developer.apple.com/documentation/testing/customtestargumentencodable)
- [Known issues](https://developer.apple.com/documentation/testing/known-issues)
