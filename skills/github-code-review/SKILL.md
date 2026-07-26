---
name: github-code-review
description: GitHub pull-request review workflow for collecting diffs, comments, checks, commits, and review context through gh. Use when reviewing a PR or GitHub change for concrete findings, risks, test gaps, and a review decision. Load the sibling code-review Skill for evidence, severity, and verdict; GitHub context does not authorize posting comments or changing review state.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# GitHub Code Review

Use this skill to review a GitHub change with PR context.

## Umbrella Contract

1. Read the sibling [`../code-review/SKILL.md`](../code-review/SKILL.md) before analyzing the pull request.
2. Keep this Skill responsible for PR identity, base and head, merge-base diff, commits, comments, changed files, checks, and GitHub-specific context.
3. Keep `code-review` responsible for affected-path tracing, finding evidence, severity, deduplication, verification gaps, and the final verdict.
4. Remain read-only. Do not submit comments, suggestions, approvals, or request-changes actions unless the user separately authorizes that external change; then use `github-inline-review`.

## Pull Request Preflight

Before analyzing the diff:

1. Resolve repository identity, PR number, state, draft status, author, base SHA, head SHA, and merge base. Freeze the head SHA as the review baseline.
2. Read repository-wide and path-scoped instructions that apply to the changed files from the reviewed head.
3. Inspect prior review rounds, finding IDs, dismissed or resolved threads, bot or generated changes, and check history.
4. If the PR is closed or merged, state that no current merge decision exists unless the user requested a retrospective. If it is draft, label the verdict as draft feedback rather than final merge readiness.
5. For trivial, automated, vendored, generated, or dependency-only changes, review the canonical source, generator, manifest, permissions, and packaging effect. Do not skip a user-requested review merely because automation authored it.

## Workflow

1. Complete the preflight and assign a review-round identity from the PR, base SHA, and head SHA.
2. Collect the merge-base diff, commits, comments, changed files, check status, and relevant previous findings.
3. Review the change through the risk-calibrated, evidence-first `code-review` contract.
4. Correlate failing checks and discussion with the changed behavior instead of repeating status text.
5. On re-review, classify prior findings as unchanged, resolved, regressed, superseded, or rejected. Preserve stable IDs when the root cause is the same.
6. Deduplicate current candidates against prior rounds. Reopen a resolved or dismissed finding only when the current head still violates its acceptance criterion or new evidence proves recurrence.
7. End with one clear review decision and the next action.

## Rules

- Use PR context, not only the raw diff, when it improves the review.
- Call out missing tests when new behavior or risk is introduced.
- Prefer file-and-line citations for every finding.
- Separate blocking issues from suggestions.
- Do not repeat a prior comment merely because the review tool cannot remember that it was dismissed.
- When linking to reviewed code outside an inline review API, use the frozen full head SHA rather than a moving branch reference.

## Output

- Follow the sibling `code-review` output contract: findings ordered by severity first, then the review profile, verification gaps, coverage, and verdict.
- Include PR state, base and head SHAs, review-round identity, and prior-finding disposition when this is a re-review.
- Do not emit a second or conflicting GitHub-specific conclusion.
- Include a short positive observation only after findings and only when it adds useful context.

## Handoff

- Use `code-review` for the finding and verdict contract while this Skill supplies GitHub context.
- For evaluating and implementing requested changes from review comments, use `receiving-code-review`.
- For publishing inline findings or a review decision after explicit authorization, use `github-inline-review`.
- For PR creation or other GitHub operations, use `github-operations`.
