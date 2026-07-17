---
name: agent-action-governance
description: Govern consequential AI-agent tool actions through explicit policy, least authority, human approval windows, dry-run evaluation, command and path controls, MCP policy enforcement, tamper-evident signed receipts, verification, break-glass procedures, and audit retention. Use when coding agents can review, merge, publish, deploy, delete, access secrets, call external tools, or bypass repository safeguards and those actions need attributable authorization.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Agent Action Governance

## Workflow

1. Inventory agent tools, identities, credentials, data, filesystem scope, networks, repositories, and external mutations.
2. Classify actions by reversibility, blast radius, confidentiality, financial impact, and required authority.
3. Encode deny-by-default policy with narrow subjects, actions, resources, conditions, and environments.
4. Require human approval for consequential actions through explicit, short-lived, attributable grants.
5. Evaluate policy in dry-run mode and test allowed, denied, ambiguous, bypass, and failure scenarios.
6. Emit canonical receipts containing policy, request, decision, actor, resource, time, hashes, and result.
7. Sign and verify receipt chains, protect keys, define retention, and detect tampering or gaps.
8. Document break-glass authority, expiry, compensating controls, and post-use review.

## Rules

- Do not rely on prompt text as the enforcement boundary.
- Separate policy decision, user approval, tool execution, and outcome verification.
- Never store signing keys or reusable credentials in receipts, logs, or repository files.
- Prevent bypass flags and alternate tool paths from escaping the same policy intent.
- Fail closed for missing policy, invalid signature, expired approval, or unverifiable resource identity.
- Preserve enough evidence to reproduce why an action was allowed or denied.

## References

- Read [references/policy-approvals-and-receipts.md](references/policy-approvals-and-receipts.md) for action classification, policy structure, approval grants, MCP enforcement, signed receipt fields, verification, bypass testing, and break-glass controls.

## Handoff

- Use `mcp-ops` for MCP configuration and authentication.
- Use `mcp-creator-design` for server-side tool boundaries.
- Use `git-operations` for repository safeguards.
- Use `security-code-review` for policy and enforcement implementation review.
