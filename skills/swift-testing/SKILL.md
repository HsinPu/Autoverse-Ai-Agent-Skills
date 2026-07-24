---
name: swift-testing
description: "Native Swift test design, implementation, review, debugging, and migration workflow for the Swift Testing framework and XCTest. Use when adding unit or integration tests, choosing #expect or #require, organizing suites, creating parameterized tests, applying traits and tags, testing async or actor-isolated code, fixing parallel-test flakiness, configuring Xcode test plans, or incrementally migrating XCTest. Use mobile-app-testing for device and end-to-end behavior, and swift-concurrency when the production isolation model is the primary problem."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "AvdLee/Swift-Testing-Agent-Skill"
  reference-license: "MIT"
  reference-revision: "798e9b1a2bcac164d4f0c781908199e754f0bab6"
---

# Swift Testing

Prove behavior with tests that remain deterministic, parallel-safe, and useful in Xcode and CI.

## Workflow

1. Inspect the Swift and Xcode versions, supported platforms, package or Xcode test targets, schemes, test plans, CI commands, and frameworks already used.
2. Define the behavior, regression, failure mode, and cheapest test level that can prove it. Separate unit, integration, UI automation, performance, and release-device concerns.
3. Classify the task as new coverage, test review, flaky-test diagnosis, XCTest migration, or test-plan and CI design.
4. Read only the relevant references:
   - [test-structure-and-assertions.md](references/test-structure-and-assertions.md) for framework selection, suites, fixtures, `#expect`, `#require`, errors, attachments, and availability;
   - [parameterization-traits-and-plans.md](references/parameterization-traits-and-plans.md) for test arguments, traits, tags, known issues, filtering, and Xcode plans;
   - [async-parallel-and-isolation.md](references/async-parallel-and-isolation.md) for async work, callbacks, events, actors, cancellation, parallel safety, and flakiness;
   - [xctest-migration-and-ci.md](references/xctest-migration-and-ci.md) for coexistence, phased conversion, XCTest-only capabilities, and CI gates.
5. Give each test its own dependencies and mutable state. Inject clocks, identifiers, randomness, storage, network, and event sources when deterministic control is required.
6. Implement the smallest test or migration slice that proves the stated behavior. Do not refactor unrelated production architecture to make one assertion compile.
7. Run the exact test target and representative plan or destination, inspect the failure report, and verify the test fails for the intended regression before accepting it.

## Framework Boundary

| Need | Preferred owner |
|---|---|
| New Swift unit or integration coverage on a supported toolchain | Swift Testing |
| Existing XCTest suite with no immediate migration value | XCTest |
| `XCUIApplication` UI automation and system journeys | XCTest / XCUITest |
| XCTest performance measurement APIs | XCTest |
| Objective-C test code or unsupported framework integration | XCTest |
| A target under gradual conversion | Swift Testing and XCTest side by side |

Do not migrate a whole suite merely to use newer syntax. Preserve working coverage while moving one behavior or file at a time.

## Core Rules

- Import `Testing` only from test targets.
- Make each test prove one observable behavior, not private implementation structure.
- Use `#expect` for independent checks and `#require` when later test steps need a prerequisite value.
- Use parameterized tests when the assertion logic is identical across inputs; keep expected outcomes independent from the implementation being tested.
- When selective reruns matter, give every parameter argument a stable encodable identity; readable display text alone is insufficient.
- Assume tests may execute concurrently and in an unspecified order.
- Give each invocation isolated fixtures. Avoid mutable globals, shared singletons, common files, and reused database state.
- Apply `@MainActor` only when the system under test genuinely requires main-actor isolation.
- Await asynchronous APIs directly. Use deterministic event or callback synchronization instead of arbitrary sleeps.
- Treat `.serialized` as a narrow compatibility measure with a stated reason and removal path.
- Keep disabled tests, known issues, time limits, bug links, tags, and CI filters visible and actionable.
- Attach only bounded diagnostic artifacts, never secrets or personal data, and verify that CI preserves the result bundle needed to inspect them.

## Failure and Flake Triage

For a failing or flaky test, capture:

1. test identifier, argument case, destination, plan, and toolchain;
2. whether the product behavior is wrong, the expectation is wrong, or the test environment is unstable;
3. shared state, timing, ordering, actor, external-service, and fixture dependencies;
4. the smallest reproduction and rerun strategy;
5. evidence that the correction removes the cause rather than suppressing the signal.

Do not fix flakiness by adding retries, sleeps, blanket main-actor isolation, or suite-wide serialization before isolating the cause.

## Required Deliverable

Return:

- confirmed framework, target, toolchain, plan, and destination;
- behavior and risk being tested;
- proposed test file, suite, cases, arguments, and assertions;
- dependency, fixture, isolation, and cleanup strategy;
- async, cancellation, error, and parallel-execution coverage;
- XCTest coexistence or migration steps when applicable;
- exact commands or Xcode actions and fresh results;
- any disabled, serialized, or known-issue scope with owner and exit condition.

## Handoff

- Use `swift-concurrency` when actor ownership, `Sendable`, task lifetime, continuations, or cancellation must first be corrected in production code.
- Use `swiftui-development` when the primary task is SwiftUI state, navigation, previews, accessibility, or rendering behavior.
- Use `mobile-app-testing` for simulators and devices, permissions, lifecycle transitions, deep links, push notifications, purchases, or full user journeys.
- Use `testing-strategy` when the decision spans test levels, coverage goals, environments, ownership, and organization-wide quality gates.
- Use `test-driven-development` when implementation should proceed through an explicit red-green-refactor loop.
