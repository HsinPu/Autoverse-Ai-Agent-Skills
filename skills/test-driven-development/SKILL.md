---
name: test-driven-development
description: Test-driven development workflow for implementing observable behavior through strict RED-GREEN-REFACTOR cycles and small verified increments. Use when adding or changing behavior that can be expressed with automated tests, especially regression fixes, public contracts, business rules, and behavior-preserving refactors; skip non-executable documentation and exploratory throwaway work.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "obra/superpowers"
  reference-license: "MIT"
  reference-revision: "d884ae04edebef577e82ff7c4e143debd0bbec99"
---

# Test-Driven Development

Let an observable behavior and its failing test lead each implementation increment.

## Red-Green-Refactor Cycle

1. Define one externally meaningful behavior and choose the smallest test level that can prove it.
2. Write one focused test against the public contract or stable boundary.
3. Run the test and confirm RED for the intended reason. Repair the test setup when it fails for an unrelated reason.
4. Write the minimum production code required to satisfy that behavior.
5. Run the focused test and confirm GREEN, then run the nearest affected suite.
6. Refactor only while the relevant checks remain green.
7. Repeat with the next behavior until the acceptance criteria are covered.

## Existing-Code Rules

- Add a characterization test before changing poorly documented behavior when preserving it matters.
- Add a regression test that reproduces a confirmed bug before implementing its fix.
- Keep one behavior per cycle so a failure identifies the responsible increment.
- Prefer public outcomes over private implementation details.

## Guardrails

- Do not write production code before observing the intended test fail unless the work is explicitly exempted.
- Do not weaken assertions, over-mock the behavior under test, or encode the current implementation merely to obtain GREEN.
- Do not continue when RED has the wrong cause or GREEN cannot be explained.
- Keep documentation, generated files, exploratory spikes, and non-executable configuration outside a forced TDD cycle.

## Handoff

- Use `testing-strategy` to choose the appropriate test level, fixtures, and overall test mix.
- Use `python-testing-engineering` for Python RED-GREEN test implementation and `python-development` for the corresponding production-code increment.
- Use the relevant language or framework testing skill for other implementation details.
- Use `code-change-workflow` to identify the owner path and affected boundaries before the first cycle.
- Use `incremental-implementation` when the work requires several independently verified slices.
- Use `systematic-debugging` when a test fails for an unknown reason or the implementation does not produce the predicted result.
- Use `verification-before-completion` after all cycles to run the broader acceptance checks and inspect repository state.
