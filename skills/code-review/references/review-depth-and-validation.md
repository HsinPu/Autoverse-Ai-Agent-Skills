# Review Depth and Validation

Use this reference for standard or elevated reviews. Keep the main review proportional: risk signals decide evidence depth, while verified impact decides finding severity.

## Risk Profile

Evaluate these dimensions before reviewing:

| Dimension | Lower-risk evidence | Elevation signals |
|---|---|---|
| Exposure | Internal, bounded caller | Public endpoint, untrusted input, privileged automation, cross-tenant path |
| State and value | Ephemeral or easily rebuilt | Persistent data, money, entitlements, credentials, destructive operation |
| Contract | Private implementation detail | Public API, schema, event, CLI, installer, stored format, mixed-version behavior |
| Execution | Synchronous local behavior | Concurrency, retries, queues, distributed side effects, external execution or fetch |
| Reversibility | Fast rollback with no data conversion | Irreversible migration, backfill, upgrade boundary, delayed or costly recovery |
| Evidence | Clear requirement and representative tests | Ambiguous intent, missing integration evidence, environment-dependent behavior |
| Blast radius | One contained consumer | Shared library, many callers, multiple platforms, deployment-wide configuration |

Do not calculate risk from line count alone. A one-line authorization removal can be elevated; a large regenerated catalog can remain focused on its canonical source and packaging effect.

## Selecting Review Depth

### Focused

- Freeze the exact scope and intended behavior.
- Trace the directly affected contract and callers.
- Run or inspect the cheapest representative verification.
- Report qualifying findings and material limitations.

### Standard

- Perform separate intent/specification and implementation-safety passes.
- Trace all changed contracts and meaningful consumers.
- Use the coverage ledger below.
- Investigate history when one of the selective-history triggers applies.

### Elevated

- Perform the standard review plus the narrowest domain specialist.
- When independent execution is available and permitted, obtain at least one independent candidate pass; use more than one when distinct critical surfaces would otherwise share assumptions.
- Revalidate every blocking or high-impact candidate against the frozen baseline after aggregation.
- Record disagreement, unavailable runtime evidence, and unvalidated surfaces explicitly.
- Do not run destructive, exploitative, production, or externally mutating verification without separate authorization.

## Selective History

Use `git log`, `git show`, or `git blame` when:

- the current requirement or invariant is unclear;
- validation, authorization, fallback, compatibility, or cleanup logic was removed;
- a public or persisted contract changed;
- the change reverses or bypasses an earlier fix;
- surrounding comments and tests conflict with the diff;
- ownership or release ordering explains behavior that current code alone cannot.

Extract the prior invariant, why it existed, affected consumers, and whether the original conditions still apply. Treat commit messages and authorship as context, not proof. Avoid blanket blame on every changed line.

## Independent Candidate Validation

Give an independent reviewer the frozen baseline, requested intent, repository guidance, diff, and relevant source. Avoid supplying the expected verdict or the primary reviewer's reasoning when the environment can isolate them.

For each candidate:

1. Confirm the location exists on the reviewed head or working-tree baseline.
2. Trace a reachable input, state, caller, or attacker path.
3. Check framework behavior, validation, guards, tests, and other negative evidence.
4. Demonstrate the violated contract and observable impact.
5. Reject duplicate symptoms and pre-existing issues outside the requested change.
6. Mark the candidate `confirmed`, `rejected`, or `needs evidence`.

The final reviewer owns aggregation and severity. Do not keep a finding because several reviewers repeated it, and do not discard it merely because one reviewer disagreed.

## Review Coverage Ledger

For standard and elevated reviews, summarize coverage by behavior surface rather than dumping every filename:

| Surface | Status | Evidence or reason |
|---|---|---|
| `<contract, component, migration, platform, or runtime path>` | Reviewed | `<source, test, command, or trace>` |
| `<generated or vendored output>` | Derived | `<canonical source or generator checked>` |
| `<out-of-scope area>` | Skipped | `<why it is outside the frozen baseline>` |
| `<runtime, environment, or integration>` | Unavailable | `<missing access or evidence and its effect on confidence>` |

Use `Reviewed`, `Derived`, `Skipped`, and `Unavailable` consistently. The ledger records honest evidence boundaries; it is not a claim that every line or environment was inspected.
