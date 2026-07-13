# Agent Team Patterns

## Contents

- Team sizing
- Communication messages
- Parallel debugging
- Parallel implementation
- Multi-reviewer fan-in
- Shutdown and recovery

## Team Sizing

Use one parent plus the fewest specialists that produce independent evidence.

| Shape | Use when | Avoid when |
|---|---|---|
| Parent only | One execution path owns the task | Delegation would duplicate context |
| Parent + researcher | External evidence can be gathered independently | Research decisions change implementation scope continuously |
| Parent + 2-3 builders | Components and files are isolated behind stable contracts | Builders share schema, configuration, or generated output |
| Parent + reviewers | Distinct security, correctness, UX, or operations lenses matter | Review standards or diff range are undefined |
| Competing debuggers | Hypotheses can be tested independently | Investigators must mutate the same runtime state |

## Message Types

- `ASSIGN`: objective, inputs, owned scope, output, stop conditions
- `EVIDENCE`: fact with source, command, file, or artifact
- `DECISION_NEEDED`: alternatives and the exact parent choice required
- `RISK`: potential scope, security, or integration issue
- `BLOCKED`: failed prerequisite and attempted alternatives
- `COMPLETE`: deliverable, proof, changed state, and remaining uncertainty
- `CANCEL`: reason the work is obsolete and cleanup required

Do not use status-only messages such as “working” or “done” as evidence.

## Parallel Debugging

1. Freeze the symptom, reproduction, environment, and timeline.
2. Assign competing causal hypotheses or independent layers.
3. Require each investigator to return supporting and contradicting evidence.
4. Maintain a shared list of eliminated hypotheses.
5. Resolve disagreement with one discriminating experiment.
6. Keep remediation separate until the causal path is established.

## Parallel Implementation

- Land shared interfaces before parallel consumers.
- Assign exclusive file ownership.
- Keep migrations, dependencies, and generated catalogs parent-owned.
- Require narrow tests from each builder.
- Integrate one slice at a time and rebase decisions on current state.

## Multi-Reviewer Fan-In

1. Give every reviewer the same requirements, diff range, and severity scale.
2. Assign distinct review lenses.
3. Validate findings against current code and tests.
4. Merge findings sharing one root cause.
5. Resolve contradictory recommendations through the affected contract.
6. Report uncovered risk domains.

## Shutdown And Recovery

- Stop agents whose branch or hypothesis is obsolete.
- Ask writers to report uncommitted files and partial state before interruption.
- Never leave an external mutation ownerless.
- Preserve a restart-safe handoff containing objective, current evidence, owned state, and next action.
