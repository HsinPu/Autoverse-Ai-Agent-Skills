---
name: verification-before-completion
description: Completion verification gate for proving that requested work satisfies its acceptance criteria with fresh command output, behavior checks, diff and repository-state inspection, and explicit disclosure of unverified items. Use immediately before claiming a code change, fix, refactor, build, test, review remediation, or repository task is complete; it does not replace independent review or post-deployment monitoring.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/Autoverse-Ai-Agent-Skills"
  reference-source: "obra/superpowers"
  reference-license: "MIT"
  reference-revision: "d884ae04edebef577e82ff7c4e143debd0bbec99"
---

# Verification Before Completion

Require current evidence for every material completion claim.

## Workflow

1. List the exact outcomes about to be claimed and the acceptance criteria that define success.
2. Map each claim to a concrete command, behavior check, artifact inspection, or state check.
3. Run fresh verification on the current revision, starting with the narrowest decisive proof and broadening according to risk.
4. Inspect complete output, exit status, produced artifacts, and observable behavior. Do not rely on a summary alone.
5. Inspect the final diff, repository status, and unexpected generated or untracked files.
6. Record every failed, blocked, skipped, stale, or unavailable check as a verification gap.
7. Declare completion only when all required claims have current passing evidence and no unresolved blocker contradicts them.

## Evidence Record

Use a compact record:

| Claim | Evidence | Result | Gap or limitation |
|---|---|---|---|

Include the command or interaction, relevant scope, observed result, and any limitation that changes confidence.

## Boundaries

- Do not reuse old output when the code, configuration, dependencies, or environment changed afterward.
- Do not treat a partial suite, build-only result, or absence of errors as proof of unrelated behavior.
- Do not hide failed or unrun checks behind a general success statement.
- Do not run destructive, production, or externally mutating verification without authorization.
- Do not replace independent review, security approval, or post-deployment monitoring with self-verification.

## Handoff

- Use `terminal-ops` to execute commands and capture exact local evidence.
- Use `pipeline-review` when the change needs an independent read-only acceptance gate.
- Use `deployment-operations` for rollout, smoke checks, rollback readiness, and post-deployment health.
- Use `git-operations` only after the required local verification passes and a Git action is authorized.
