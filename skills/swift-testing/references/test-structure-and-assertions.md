# Swift Test Structure and Assertions

Use this reference to choose the test framework, organize suites, build fixtures, and express failures clearly.

## Contents

- [Confirm Compatibility](#confirm-compatibility)
- [Declare Tests and Suites](#declare-tests-and-suites)
- [Suite Construction Constraints](#suite-construction-constraints)
- [Assertion Selection](#assertion-selection)
- [Throwing Outcomes](#throwing-outcomes)
- [Test-Specific Descriptions](#test-specific-descriptions)
- [Attach Diagnostic Artifacts](#attach-diagnostic-artifacts)

## Confirm Compatibility

Before using Swift Testing APIs, record:

- Swift and Xcode versions;
- Apple platform and minimum deployment targets;
- Swift package or Xcode test-target boundaries;
- whether `Testing`, XCTest, or both already run in CI;
- API availability differences across the supported toolchain.

Keep a working XCTest test when the current compiler or destination cannot execute the equivalent Swift Testing coverage.

## Declare Tests and Suites

Declare a non-parameterized test as a zero-argument Swift function marked with `@Test`. It may live at file scope or inside a type. A type containing tests is already a suite; add `@Suite` when it needs a display name or inherited traits.

```swift
import Testing
@testable import CheckoutCore

@Test("A new basket has no items")
func newBasketStartsEmpty() {
    #expect(Basket().items.isEmpty)
}

@Suite("Checkout")
struct CheckoutTests {
    @Test
    func rejectsAnEmptyBasket() {
        #expect(throws: CheckoutError.emptyBasket) {
            try Checkout.submit(Basket())
        }
    }

    @Suite
    struct Discounts {
        @Test
        func rejectsNegativePercentages() {
            #expect(throws: DiscountError.invalidPercentage) {
                try Discount(percentage: -1)
            }
        }
    }
}
```

Use nested suites for real domain hierarchy, not merely to reproduce the production folder tree. Keep global tests for small behaviors that do not benefit from suite state or traits.

## Suite Construction Constraints

When a suite contains instance test methods, the runner must be able to call a zero-argument initializer. That initializer may be implicit or explicit, synchronous or asynchronous, and throwing or non-throwing.

```swift
@Suite
struct RepositoryTests {
    let repository: MemoryRepository

    init() {
        repository = MemoryRepository(namespace: UUID())
    }

    @Test
    func startsWithoutRecords() {
        #expect(repository.records.isEmpty)
    }
}
```

The runner creates a separate suite instance for each instance test function. If a valid zero-argument construction path is impossible, use a static or file-scope test and build the fixture explicitly.

Suite types and their containing types must remain available on every supported runtime. Put `@available` on the individual `@Test` function whose behavior requires a newer platform.

```swift
@available(iOS 18, *)
@Test
func usesModernReceiptFormat() {
    #expect(ReceiptEncoder.modern.isSupported)
}
```

## Organize by Behavior

Prefer a feature or domain behavior over a one-to-one mirror of production types.

```text
CheckoutTests/
  Pricing
  Discounts
  PaymentAuthorization
  ReceiptFormatting
```

Use a suite when tests share a domain, traits, or lightweight fixture construction. Keep unrelated behaviors in separate suites even if their implementation lives in one production class.

Prefer value-oriented suite types unless reference identity, actor isolation, or teardown lifetime is necessary.

Apply platform availability at the smallest test-function boundary. Do not make an entire containing suite unavailable when only one behavior needs a newer OS.

## Assertion Selection

| Intent | Swift Testing mechanism |
|---|---|
| Check a value or predicate and continue | `#expect` |
| Require a value or condition before later steps | `#require` |
| Record an explicit unexpected path | `Issue.record` |
| Verify a thrown error or no throw | A throw-aware `#expect` form |
| Preserve visibility for a temporary expected failure | A narrow `withKnownIssue` scope |

Use natural Swift expressions so failure output can show the relevant subexpressions. Avoid duplicating XCTest assertion names inside a Swift Testing function.

Do not use a later optional chain as a substitute for a failed prerequisite. Unwrap or validate once, then make the dependent assertions readable.

## Throwing Outcomes

Let a throwing test function fail naturally when an unexpected error should stop the test. Use a throw-aware expectation when the error itself is the behavior under test or when later checks should continue.

```swift
enum DecodeFailure: Error, Equatable {
    case missingIdentifier
}

@Test
func decodeFailuresAreTyped() {
    #expect(throws: DecodeFailure.missingIdentifier) {
        try Decoder.decode([:])
    }

    #expect(throws: (any Error).self) {
        try Decoder.decode(["id": 17])
    }

    #expect(throws: Never.self) {
        try Decoder.decode(["id": "A-17"])
    }
}
```

Use a specific error value when equality is part of the contract, an error type when any instance of that type is acceptable, and `(any Error).self` only when the precise error is irrelevant. `Never.self` records an issue if the closure throws without halting later independent checks.

## Test-Specific Descriptions

When an expectation or parameterized case prints noisy domain values, add `CustomTestStringConvertible` in test code so reports show only diagnostic fields.

```swift
extension PriceQuote: CustomTestStringConvertible {
    var testDescription: String {
        "PriceQuote(currency: \(currency), amount: \(amount))"
    }
}
```

Keep this separate from production-facing `CustomStringConvertible` when customers, logs, or persistence need a different representation. Never include secrets, tokens, or personal data in a test description.

## Attach Diagnostic Artifacts

Use an `Attachment` when a bounded file, image, encoded value, or snapshot will make a failure materially easier to diagnose. The value must conform to `Attachable`; current toolchains provide default implementations for several standard and Foundation-backed types.

```swift
import Foundation
import Testing

struct CheckoutSnapshot: Codable, Attachable {
    let basketID: String
    let itemCount: Int
    let totalCents: Int
}

@Test
func recordsCheckoutSnapshot() {
    let snapshot = CheckoutSnapshot(
        basketID: "fixture-basket",
        itemCount: 2,
        totalCents: 1598
    )

    Attachment.record(snapshot)
    #expect(snapshot.totalCents == 1598)
}
```

Confirm `Attachment` and the chosen initializer or recorder against the project's Swift and Xcode versions before migrating an older target. Use a named `Attachment` when the file extension or report label affects how the artifact is encoded or displayed.

- Attach the smallest artifact that explains the failure.
- Remove or redact credentials, tokens, customer data, device identifiers, and production payloads.
- Keep the assertion as the pass/fail signal; an attachment is diagnostic evidence, not an assertion.
- Verify the scheme and CI preserve the result bundle and attachment lifetime you expect.
- Prefer XCUITest-owned screenshots for UI journeys that remain in XCTest.

## Test Observable Contracts

Good assertions target:

- returned values and errors;
- state transitions;
- emitted domain events;
- persisted or transmitted representations at a real boundary;
- calls to injected capabilities when interaction is the contract.

Avoid assertions against private storage, incidental call order, exact internal type layout, or implementation-only helper methods unless that structure is itself a supported contract.

## Fixture Ownership

Create mutable fixtures per test invocation. Shared read-only data may live at suite scope when it is cheap, immutable, and safe to reuse.

Prefer:

- builders or factories with explicit defaults;
- in-memory implementations for high-volume unit tests;
- temporary directories unique to one test;
- injected clocks, IDs, random sources, and clients;
- explicit cleanup for files, observers, tasks, and database state.

Avoid a fixture whose initializer performs uncontrolled network, keychain, notification, or production database work.

## Errors and Diagnostics

- Assert the specific error contract when callers depend on it.
- Use a prerequisite check before inspecting an error payload that might be absent.
- Keep known-issue scopes around only the failing behavior.
- Improve noisy domain-value descriptions in test code when reports cannot identify the difference.
- Include enough test or argument naming to locate the failed business case without reading the source.

## Review Checklist

- The test framework is supported by every required destination.
- `Testing` is imported only by test code.
- Suite structure describes behavior and has deterministic construction.
- Assertions distinguish independent checks from prerequisites.
- Fixtures do not share mutable state across tests.
- Failures show useful domain values and a clear regression.
- Throw expectations distinguish exact errors, any error, and no error.
- Instance suites have a callable zero-argument construction path.
- Availability is attached to individual tests where possible.
- Attachments are supported by the target toolchain, privacy-safe, bounded, and retained by the intended result workflow.

## Official API References

- [Testing for errors in Swift code](https://developer.apple.com/documentation/testing/testing-for-errors-in-swift-code)
- [`Attachment`](https://developer.apple.com/documentation/testing/attachment)
- [`Attachable`](https://developer.apple.com/documentation/testing/attachable)
