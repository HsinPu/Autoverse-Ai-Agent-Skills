# XCTest Migration and CI

Use this reference to move selected coverage to Swift Testing without losing signal or breaking workflows that remain XCTest-specific.

## Contents

- [Inventory Before Migrating](#inventory-before-migrating)
- [Keep XCTest Where It Owns the Capability](#keep-xctest-where-it-owns-the-capability)
- [Migration Sequence](#migration-sequence)
- [Concept Mapping](#concept-mapping)
- [Continue or Stop After Failure](#continue-or-stop-after-failure)
- [Runtime Cancellation and Skips](#runtime-cancellation-and-skips)
- [Setup and Teardown](#setup-and-teardown)
- [Attachments and Cross-Framework Helpers](#attachments-and-cross-framework-helpers)
- [Execution Isolation During Migration](#execution-isolation-during-migration)
- [CI Transition](#ci-transition)

## Inventory Before Migrating

Classify existing tests:

- pure unit and domain behavior;
- adapter and persistence integration;
- asynchronous callback or event behavior;
- `XCUIApplication` UI automation;
- performance measurement;
- Objective-C test code;
- shared setup, teardown, and global state;
- test-plan filters and CI reporting dependencies.

Move only categories whose supported toolchain and runner can preserve their behavior.

## Keep XCTest Where It Owns the Capability

Retain XCTest for:

- UI automation driven through `XCUIApplication`;
- XCTest performance and metric APIs;
- Objective-C-only coverage;
- framework or runner integrations not yet supported by Swift Testing;
- stable legacy suites whose conversion has no current benefit.

Both frameworks may coexist in one test target during migration. Keep assertions from each framework inside the matching test function.

One migration file may temporarily import both modules:

```swift
import Testing
import XCTest
```

Prefer assertions from the framework that owns each test. Newer toolchains provide XCTest and Swift Testing interoperability modes, but support and defaults depend on the toolchain and package tools version. If a shared helper crosses the boundary during migration, verify `SWIFT_TESTING_XCTEST_INTEROP_MODE` and the resulting issue severity in the same local and CI environments; do not assume a cross-framework assertion will fail the caller.

## Migration Sequence

1. Preserve a green baseline and record the exact plan and destination.
2. Convert one behavior or source file.
3. Replace assertion families with direct Swift expressions.
4. Use `#require` where later steps depend on a successfully produced value.
5. Declare tests and suites explicitly.
6. Replace duplicated cases with parameterized arguments.
7. Add tags, conditions, known issues, and time limits only where they improve operation.
8. Run the same local and CI selection before removing the XCTest version.

Do not mix production refactoring, broad test-framework conversion, and concurrency migration in one review slice.

## Concept Mapping

| XCTest concept | Swift Testing direction |
|---|---|
| `XCTestCase` method naming | Explicit test declaration |
| `XCTAssert*` family | `#expect` with a Swift expression |
| `XCTUnwrap` or prerequisite assertion | `#require` |
| `XCTFail("message")` | `Issue.record("message")` |
| `XCTestExpectation` and fulfillment | `confirmation` or an awaitable adapter |
| `XCTSkipIf` / `XCTSkipUnless` known before execution | `.disabled(if:)` / `.enabled(if:)` |
| Runtime `XCTSkip` | `try Test.cancel("reason")` |
| `XCTAttachment` | `Attachment` for supported Swift Testing targets |
| Repeated test methods | Parameterized test arguments |
| Category encoded in method names | Tags and suites |
| Expected temporary failure | Narrow known-issue handling |

Validate the exact API spelling against the project's Swift version rather than applying a blind text replacement.

## Continue or Stop After Failure

XCTest's `continueAfterFailure = false` is a test-wide switch. Replace it with a targeted `#require` at each prerequisite boundary so unrelated expectations can still report useful issues.

```swift
@Test
func submittedOrderHasReceipt() throws {
    let order = try Order.submit(validFixture)
    let receipt = try #require(order.receipt)

    #expect(receipt.lines.isEmpty == false)
    #expect(receipt.total >= 0)
}
```

Do not mechanically change every `XCTAssert*` to `#require`. Reserve required expectations for values or conditions without which subsequent statements are invalid.

## Runtime Cancellation and Skips

Use a condition trait when the eligibility decision is available before the test begins:

```swift
@Test(.enabled(if: Runtime.hasLocalDatabase))
func importsLegacyDatabase() throws {
    // ...
}
```

Use `Test.cancel` only when the test discovers at runtime that it cannot continue without failing:

```swift
@Test
func validatesProvisionedAccount() throws {
    guard let account = Provisioning.currentAccount else {
        try Test.cancel("No provisioned test account")
    }

    #expect(account.isTestOnly)
}
```

`Test.cancel` ends the current test or parameterized case and returns `Never`; keep the test function `throws`. Do not use cancellation to hide a failed precondition that the test owns. Missing fixtures, broken setup, or unavailable required services should normally remain failures.

## Setup and Teardown

Translate shared XCTest lifecycle hooks into explicit fixture ownership:

- construct value fixtures in the suite or test;
- create mutable resources per invocation;
- use reference or actor lifetime only when teardown semantics require it;
- perform explicit async cleanup for tasks, observers, files, and databases;
- avoid making suite initialization depend on production environment state.

Confirm that conversion does not introduce accidental shared state when tests begin running concurrently.

For instance tests, Swift Testing constructs a distinct suite value for each test function. Use the initializer for per-test setup:

```swift
@Suite
struct SessionTests {
    let session: Session

    init() {
        session = Session(environment: .test)
    }

    @Test
    func startsDisconnected() {
        #expect(session.isConnected == false)
    }
}
```

Use a class or actor suite only when identity or lifetime-based teardown is necessary. Its `deinit` may release synchronous resources, but it cannot perform awaited cleanup. Close async tasks, observers, files, and stores explicitly inside the test or an owned helper before the test returns.

## Attachments and Cross-Framework Helpers

Map `XCTAttachment` to Swift Testing's `Attachment` only after confirming the target toolchain supports the required value type and recorder. Preserve filename, format, privacy redaction, and result-bundle retention rather than performing a syntax-only conversion.

During gradual migration:

- keep XCUITest screenshots and activities in XCTest;
- prefer framework-neutral helpers that return values or throw typed errors;
- keep assertions at the calling test boundary where possible;
- if an assertion helper must be shared, pin and verify the interoperability mode in CI;
- compare issue severity and attachment visibility before deleting the XCTest version.

## Execution Isolation During Migration

Do not preserve incidental XCTest scheduling by marking every converted test `@MainActor`. Swift Testing uses Swift concurrency and normally runs tests in parallel; apply a global actor only when the tested API requires that isolation.

When a legacy suite depends on one shared resource, a narrow `@Suite(.serialized)` can protect the transition. Record the resource and removal condition, then isolate the fixture so serialization can be deleted.

Re-run converted tests beside their neighboring XCTest cases. Passing alone does not prove the migrated test is independent from target-level state or discovery behavior.

## CI Transition

During coexistence:

- ensure discovery includes both frameworks;
- preserve required destinations, sharding, coverage, and report export;
- map existing name-based selections to stable tags where supported;
- run old and new coverage together until equivalence is proven;
- monitor duration, failures, skipped cases, known issues, and quarantine size;
- keep a rollback path to the last working plan.

Do not declare migration complete from a successful local single-test run.

Use the repository's canonical commands. Typical entry points are:

```text
swift test
xcodebuild test -scheme <Scheme> -testPlan <Plan> -destination '<Destination>'
```

For an Xcode project, preserve the scheme, test plan, destination, configuration, coverage settings, and result-bundle collection used by CI. Compare discovered case counts and skipped tests before and after each migration slice rather than relying only on the process exit code.

## Completion Gate

- The converted behavior fails when its protected regression is reintroduced.
- Local and CI runs discover the intended number of cases.
- Unsupported UI, performance, and Objective-C coverage remains in XCTest.
- Setup, teardown, and parallel behavior remain deterministic.
- Plans and tags preserve required pull-request and release gates.
- Target discovery still includes both XCTest and Swift Testing during coexistence.
- The old duplicate is removed only after equivalent signal is demonstrated.

## Official API References

- [Migrating a test from XCTest](https://developer.apple.com/documentation/testing/migratingfromxctest)
- [`Test.cancel`](https://developer.apple.com/documentation/testing/test/cancel(_:sourcelocation:))
- [`Attachment`](https://developer.apple.com/documentation/testing/attachment)
