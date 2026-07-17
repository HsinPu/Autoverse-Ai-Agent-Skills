---
name: domain-modeling
description: Build a technology-neutral model of business concepts, language, identity, invariants, state transitions, ownership, boundaries, and domain events from repository evidence and stakeholder decisions. Use when ambiguous terminology, conflicting rules, anemic data shapes, unclear bounded contexts, or hidden business invariants are causing design, specification, API, persistence, or implementation problems.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "mattpocock/skills"
  reference-license: "MIT"
  reference-revision: "e9fcdf95b402d360f90f1db8d776d5dd450f9234"
---

# Domain Modeling

Create a shared model that explains the business behavior before selecting framework or storage details.

## Workflow

1. Define the decision or implementation boundary that needs a domain model.
2. Collect evidence from requirements, conversations, code, schemas, APIs, tests, examples, support cases, and existing project documents.
3. Build a terminology ledger. Record competing meanings, aliases, overloaded terms, and terms that look similar but imply different rules.
4. Test each important concept with concrete examples, counterexamples, lifecycle changes, and boundary cases.
5. Classify concepts only when useful: actor, entity, value, policy, capability, process, aggregate, state, event, or external system.
6. Define identity, ownership, invariants, allowed transitions, commands, outcomes, and failure conditions.
7. Draw boundaries around language and consistency needs. Record translations where two contexts use different meanings.
8. Reconcile the proposed model with current code and documents. Mark intentional migration work separately from factual mismatches.
9. When the user requests documentation or the active workflow explicitly owns a domain artifact, persist accepted terminology and rules in the repository's existing convention as decisions are made. Otherwise return the model inline and recommend a location without writing it.
10. Route technical consequences to specifications, APIs, storage, events, tests, or implementation Skills.

## Modeling Record

For each important concept, capture:

| Field | Question |
|---|---|
| Name and aliases | What do domain participants actually call it? |
| Meaning | What makes this concept distinct? |
| Identity | Is continuity determined by identity or by all values? |
| Owner | Who or what is authoritative for changes? |
| Invariants | What must always remain true? |
| Lifecycle | Which states and transitions are valid? |
| Examples | Which concrete cases belong? |
| Counterexamples | Which similar cases do not belong? |
| Evidence | Which code, test, document, or decision supports it? |
| Open questions | Which unresolved choice changes the model? |

## Reasoning Rules

- Prefer domain language over framework, table, transport, or UI terminology.
- Do not force every concept into a DDD pattern; use the lightest representation that exposes the rules.
- Treat disagreement about a term as evidence of a missing boundary or decision, not a wording problem.
- Separate a current-state model from a desired-state model when a migration is planned.
- Do not infer business truth from a database shape alone.
- Use an ADR only for a durable, non-obvious decision with real alternatives and meaningful reversal cost.
- Follow existing repository paths and document conventions; do not create fixed context-map filenames by default.

## Consistency Checks

- Can every state transition name its preconditions, actor, result, and failure cases?
- Can two concepts with similar names be distinguished by examples?
- Do API, schema, UI, and test terminology refer to the same meaning?
- Are invariants enforced at the correct ownership boundary?
- Are cross-boundary translations explicit rather than hidden in mapping code?
- Does each emitted event describe a completed domain fact rather than an implementation instruction?

## Output

Return the terminology ledger, concept and boundary map, invariants, lifecycle or state-transition model, unresolved decisions, evidence links, and technical consequences. Distinguish confirmed facts, accepted decisions, hypotheses, and migration targets.

## Handoff

- Use `requirements-deep-dive` when a stakeholder decision or contradiction cannot be resolved from evidence.
- Use `project-architecture-review` for module and dependency boundaries in an existing repository.
- Use `api-contract-design` for transport-facing contracts.
- Use `database-design` for persistence consequences.
- Use `event-sourcing-cqrs` when temporal reconstruction or separate command/read models are justified.
- Use `spec-flow` to turn the accepted model into dependency-aware implementation work.
