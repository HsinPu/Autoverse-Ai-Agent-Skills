---
name: solution-discovery
description: Solution discovery workflow for turning an unclear software problem into an approved design direction through goals, constraints, alternatives, tradeoffs, and explicit decision checkpoints. Use before specification or implementation when the desired outcome is known but the solution, scope, or architecture direction is not yet agreed.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "obra/superpowers"
  reference-license: "MIT"
  reference-revision: "d884ae04edebef577e82ff7c4e143debd0bbec99"
---

# Solution Discovery

Turn a problem statement into a decision that can safely enter specification work.

## Workflow

1. Restate the problem, intended outcome, affected users, and explicit non-goals.
2. Separate confirmed facts from assumptions, constraints, preferences, and open questions.
3. Gather only the evidence needed to compare viable directions.
4. Present two or three materially different options when real alternatives exist. State benefits, costs, risks, reversibility, and operational effects.
5. Recommend the smallest direction that satisfies the outcome. Explain why the rejected options are weaker for the current constraints.
6. Review the proposed direction in digestible sections and obtain explicit approval for consequential decisions.
7. Preserve the approved direction as a compact decision record.

## Decision Record

Record:

- problem and desired outcome;
- selected direction and decision owner;
- confirmed constraints and assumptions;
- alternatives considered and rejection reasons;
- accepted risks and unresolved questions;
- approval status and the next artifact to produce.

## Boundaries

- Do not produce implementation tasks before the direction is sufficiently agreed.
- Do not turn a single missing fact into a broad design exercise.
- Do not present cosmetic variations as distinct alternatives.
- Do not treat silence or lack of objections as approval.
- Stop when a required business, safety, or architecture decision lacks an authorized owner.

## Handoff

- Use `ask-questions-if-underspecified` when the user explicitly requests a question-first clarification process.
- Use `requirements-deep-dive` when several consequential choices need a structured interview and repository facts should be separated from stakeholder decisions.
- Use `domain-modeling` when competing options depend on terminology, invariants, ownership, or lifecycle rules.
- Use `throwaway-prototyping` when a bounded executable experiment is the cheapest reliable way to compare directions.
- Use `project-architecture-review` when the options depend on evidence from an existing repository or architecture.
- Use `design-consultation` when the unresolved direction is specifically visual frontend design.
- Use `spec-flow` after the solution direction is approved and needs acceptance criteria and executable tasks.
