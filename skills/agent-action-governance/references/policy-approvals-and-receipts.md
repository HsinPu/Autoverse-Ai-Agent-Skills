# Agent Policies, Approvals, And Receipts

## Contents

- Action classes
- Policy structure
- Approval grants
- Signed receipts
- Verification and bypass tests
- Break glass

## Action Classes

| Class | Examples | Default |
|---|---|---|
| Read-only local | inspect files, status, tests | allow within workspace |
| Reversible local write | edit owned files, create generated output | allow within task scope |
| Destructive local | delete, reset, clean, rewrite history | require explicit authority |
| External write | comment, publish, deploy, send, create issue | require explicit authority |
| Sensitive access | secrets, production data, private systems | deny unless specifically granted |
| Financial or security-critical | payment, credential rotation, access policy | human approval plus verification |

## Policy Structure

Bind subject identity, tool or action, resource, operation, environment, conditions, time, and decision. Normalize paths, repository identity, URLs, command arguments, and tool aliases before evaluation. Apply the same intent across alternate tools.

## Approval Grant

```json
{
  "approver": "verified-human-identity",
  "action": "deploy",
  "resource": "service/environment",
  "constraints": {"artifact": "sha256:..."},
  "issued_at": "ISO-8601",
  "expires_at": "ISO-8601",
  "nonce": "unique-value"
}
```

Make grants narrow, single-purpose, non-transferable, and short-lived. Approval authorizes the action, not a successful result.

## Signed Receipt

Record request hash, normalized resource, policy revision, decision, approver grant, tool identity, start and end time, result hash, previous receipt hash, and signature. Canonicalize serialization before hashing. Protect private keys outside the repository.

## Verification And Bypass Tests

- valid allow and deny
- expired, replayed, modified, or wrong-resource approval
- invalid or missing signature
- path traversal, symlink, case, encoding, and alternate command spelling
- equivalent action through another tool or MCP server
- partial failure and missing result receipt
- chain gap and tampered prior receipt

## Break Glass

Require named authority, reason, bounded resource, expiry, enhanced logging, compensating monitoring, and mandatory review. Never make emergency policy the routine workflow.
