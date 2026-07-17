---
name: verified-software-delivery
description: End-to-end orchestration workflow for carrying non-trivial software work from an approved problem framing through specification, implementation, review remediation, and evidence-backed completion. Use when a feature, refactor, or multi-step fix must be delivered across several stages with explicit artifacts and gates; do not use for a single isolated edit, test run, or review.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "obra/superpowers"
  reference-license: "MIT"
  reference-revision: "d884ae04edebef577e82ff7c4e143debd0bbec99"
---

# Verified Software Delivery

Route non-trivial software work through explicit artifacts and gates without duplicating the component skills.

## Delivery Flow

1. Run `solution-discovery` when the problem lacks an approved direction. Preserve the decision record.
2. Run `spec-flow` to convert the direction into scope, acceptance criteria, dependencies, risks, and executable tasks.
3. Run `code-change-workflow` to identify the owner path, affected contracts, current baseline, and verification path before editing.
4. Run `test-driven-development` for behavior that can be expressed with automated tests. Record a reasoned exemption for non-executable work instead of forcing a meaningless cycle.
5. Run `incremental-implementation` when the change needs independently reviewable slices. Preserve focused verification for each completed slice.
6. Run `pipeline-review` against a frozen baseline. Preserve its stable finding identifiers and gate decision.
7. Run `receiving-code-review` for accepted, unclear, or disputed findings. Return the remediated baseline to the independent reviewer until the gate passes or an authorized owner accepts residual risk.
8. Run `verification-before-completion` on the final baseline. Claim completion only from its current evidence record.
9. Enter Git, release, or deployment work only when the user authorizes that external state change.

## Required Artifacts

Preserve the smallest useful artifact at each applicable stage:

| Stage | Artifact |
|---|---|
| Discovery | Approved decision record |
| Specification | Acceptance criteria and task breakdown |
| Inspection | Owner path, affected boundaries, and verification path |
| Implementation | Per-slice change and test evidence |
| Review | Versioned review report and gate verdict |
| Remediation | Finding-by-finding remediation record |
| Completion | Claim-to-evidence verification record |

## Gate Rules

- Start at the earliest unresolved stage; enter later when earlier artifacts already exist and remain valid.
- Do not silently skip an applicable gate. Record the reason, evidence, and residual risk for every exception.
- Return to discovery or specification when implementation or review invalidates a requirement, assumption, or selected direction.
- Keep independent review separate from implementation and remediation.
- Keep artifact identifiers and baselines stable across review rounds.
- Stop when authority, required evidence, or a safe verification path is missing.

## Handoff

- Use `todo-first` to track stages, artifacts, and gate status for the active delivery.
- Use `subagent-architecture` to delegate bounded exploration, implementation, or review work without overlapping ownership.
- Use `testing-strategy` when the appropriate test level or coverage mix is unclear.
- Use `repo-ready` when repository-wide contributor, CI, security, or release hygiene is part of the requested outcome.
- Use `git-operations` for authorized staging, commits, branches, merges, or pushes after local verification.
- Use `deployment-operations` for authorized rollout, rollback readiness, smoke checks, and post-deployment health.
