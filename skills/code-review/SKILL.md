---
name: code-review
description: "Review code, diffs, pull requests, commits, staged or unstaged changes, and pasted snippets for concrete correctness, security, compatibility, performance, and test risks. Use for code review, review my changes, check this diff, find bugs, 檢查程式碼, or 審查修改. Establish the exact scope, remain read-only, trace affected behavior beyond changed lines, verify failure scenarios, and route frontend, security, GitHub, architecture, or remediation work to the matching sibling Skill."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Evidence-First Code Review

Find concrete defects and regression risks in the requested change without taking ownership of the implementation. Prefer a small number of high-confidence findings over a long checklist of possibilities.

## Ownership and Routing Gate

Keep this Skill responsible for the review baseline, evidence standard, severity, deduplication, and final verdict. Before reviewing:

1. Use `github-code-review` with this Skill when pull-request comments, checks, commit history, or GitHub context affect the conclusion. Reading a PR does not authorize posting comments, approving, or requesting changes.
2. Use `frontend-code-review` for React, TypeScript, CSS, accessibility, responsive, state, and browser-facing behavior while this Skill retains the cross-cutting verdict.
3. Use `security-code-review` for a vulnerability-focused audit or exploitability analysis. Keep medium-confidence suspicions under verification instead of promoting them to confirmed findings.
4. Use `project-architecture-review` instead when the requested unit is the whole repository architecture rather than a bounded change.
5. Use `receiving-code-review` instead when the task is to validate or fix findings that already exist; do not perform a new independent review in the same ownership role.
6. Use `pipeline-review` when review must become a repeatable stage gate with stable finding IDs and re-review loops.

Detect the affected stack and read only the narrowest useful implementation Skills. Examples include `python-development`, `javascript-development`, `ios-architecture`, `database-migration-workflow`, `auth-integration`, `api-contract-testing`, and `threejs-development`. Let those Skills supply domain contracts; keep finding quality and the verdict here.

## Review Boundary

- Remain read-only unless the user explicitly asks for fixes after the review.
- Identify the source of truth: working tree, staged diff, commit range, branch comparison, pull request, named files, or pasted snippet.
- Read repository guidance such as `AGENTS.md` and determine the intended behavior before judging the implementation.
- For a working-tree review, include staged, unstaged, and relevant untracked files unless the user narrows the scope.
- Separate the requested change from unrelated pre-existing modifications.
- Treat generated, vendored, minified, and lock files as derived evidence. Review their source, generator, dependency, or packaging effect instead of flooding findings on mechanical output.
- For pasted snippets or partial files, state which callers, configuration, runtime behavior, and tests could not be verified.
- For partial context, do not confirm a blocker when an uninspected caller, route mount, middleware, framework guard, or deployment condition could fully prevent the failure. Keep it under verification unless the supplied context is explicitly complete or the defect holds regardless of the missing layer.
- Do not modify code, post review comments, change pull-request state, or approve a merge without separate authorization.

## Review Profile and Depth

Build a risk profile before choosing review depth. Risk controls how much evidence to collect; it does not assign finding severity.

- Use a **focused** review for a bounded, low-risk change with clear intent, local effects, and meaningful tests.
- Use a **standard** review when behavior crosses components, contracts, platforms, persistent state, or deployment surfaces.
- Use an **elevated** review when the change affects authentication or authorization, credentials, payments or value transfer, destructive data paths, migrations, concurrency or idempotency, public or persisted contracts, installer or upgrade compatibility, privileged CI/CD, cryptography, validation removal, or externally reachable execution, fetch, redirect, or file paths.
- Escalate unclear, weakly tested, difficult-to-reverse, or wide-blast-radius changes. Do not downgrade a dangerous change because the diff is small, and do not escalate only because generated output or a lockfile is large.

For standard and elevated reviews, read [review-depth-and-validation.md](references/review-depth-and-validation.md) and keep a review coverage ledger. For elevated reviews, use an independent second pass or the narrowest specialist when execution support and repository governance permit it. Validate candidate findings against the current baseline before including them; reviewer agreement alone is not evidence.

## Workflow

1. Establish the baseline, exact diff, comparison base, repository state, and acceptance intent.
2. Classify the review as focused, standard, or elevated from affected trust boundaries, reversibility, blast radius, compatibility, and evidence quality.
3. Run an **intent and specification pass**: compare the change with explicit requirements, acceptance criteria, repository guidance, and prior behavior. When no specification exists, infer only from authoritative code, tests, documentation, and the user request, then disclose the ambiguity.
4. Run an **implementation safety pass**: map changed entry points, contracts, configuration, migrations, dependencies, tests, deployment surfaces, and meaningful paths through callers, consumers, data, permissions, side effects, errors, concurrency, persistence, and cleanup.
5. Use selective `git log`, `git show`, or `git blame` only when intent is unclear, validation or a safeguard changed, a public or persisted invariant moved, or the diff may regress a prior fix. Compare base and head behavior; do not treat history or authorship as proof by itself.
6. Read the relevant sections of [review-checklist.md](references/review-checklist.md); do not mechanically apply unrelated categories.
7. Reproduce a failure with the narrowest safe test or reason through one concrete input, state, and execution path.
8. Verify each candidate against surrounding code, framework behavior, existing safeguards, reachable runtime conditions, and negative evidence. On elevated reviews, independently validate blocking or high-impact candidates when possible.
9. Deduplicate findings with the same root cause, rank them by impact and confidence, and separate rejected candidates and verification gaps from defects.
10. Report findings first. Do not bury actionable issues under summaries, praise, process narration, or exhaustive checklists.

## Finding Standard

Report a finding only when all of the following are available:

- a precise source location: use `path:line` for repository-backed reviews, or a supplied symbol, quoted expression, or clearly labeled snippet-relative location when no real file path exists;
- the violated behavior, contract, invariant, or requirement;
- a reachable failure or abuse scenario;
- a concrete user, data, security, compatibility, or operational impact;
- a focused remediation direction.

Do not report style preferences, theoretical hardening, speculative scalability concerns, or missing tests as defects unless they expose a specific regression risk. A missing test belongs under verification gaps when no defect is demonstrated.

For an elevated review, also record whether the candidate was independently confirmed, rejected, or remains unverified. Resolve reviewer disagreement by checking the code and contract, not by majority vote. If independent execution is unavailable, say so under verification gaps rather than pretending the finding was cross-validated.

## Severity and Confidence

- **P0 — Critical:** immediate catastrophic impact, such as broadly exploitable compromise, irreversible data loss, or total production failure. Block.
- **P1 — High:** a confirmed shipped defect with serious user, security, financial, compatibility, or operational impact. Block.
- **P2 — Medium:** a confirmed defect under realistic but bounded conditions. Require follow-up; block only when project policy or release risk requires it.
- **P3 — Low:** a small, real issue that is non-blocking. Omit cosmetic preferences unless the user requests exhaustive feedback.

Mark confidence separately:

- **High:** the path and failure are verified from code or execution evidence.
- **Medium:** the evidence is strong, but one environmental or integration assumption remains.
- **Needs verification:** reachability or impact is not established. Do not present it as a confirmed finding.

Never assign severity from a keyword alone. Consider reachability, exploitability, affected users, data sensitivity, recovery, and likelihood.

## Output

Start with findings ordered by severity. For each finding include:

```markdown
- **[P1] Short actionable title** — `path/to/file:line` | `supplied function or expression`
  - **Evidence:** <changed behavior and relevant code path>
  - **Failure scenario:** <input, state, and execution sequence>
  - **Impact:** <who or what breaks>
  - **Direction:** <smallest safe correction>
  - **Confidence:** High | Medium
  - **Validation:** Primary evidence | Independently confirmed
```

After findings, use this order:

- **Review profile:** always state focused, standard, or elevated and the concrete signals that selected the depth.
- **Review coverage:** required for standard and elevated reviews. Use the `Reviewed`, `Derived`, `Skipped`, and `Unavailable` statuses from the reference; do not replace the ledger with a generic scope sentence or verification-gap list.
- **Verification gaps:** missing tests or evidence that materially limit confidence.
- **Verdict:** `block`, `needs follow-up`, or `no actionable findings`.

When no findings qualify, state **No actionable findings** explicitly and still disclose meaningful verification gaps. Do not fabricate a finding to make the review appear useful.

## Handoff

- Use `frontend-code-review` for frontend-specific defect detection and `security-code-review` for vulnerability-focused analysis while preserving this Skill's evidence and verdict contract.
- Use `github-code-review` to collect pull-request context and `github-inline-review` only after the user authorizes publishing review actions.
- Use `project-architecture-review` for repository-wide architecture assessment.
- Use `receiving-code-review` to validate and remediate accepted findings.
- Use `pipeline-review` for independent staged gates and repeatable re-review.
