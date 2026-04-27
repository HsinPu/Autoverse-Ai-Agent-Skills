---
name: security-code-review
description: Security-focused code review guide for finding high-confidence vulnerabilities in diffs, files, pull requests, and code snippets. Use when asked for a security review, vulnerability audit, OWASP-style review, or when reviewing code for injection, XSS, SSRF, auth/authz, deserialization, cryptography, secrets, supply-chain, or infrastructure security risks.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Security Code Review

Use this skill for vulnerability-focused review. Use `code-review` for broad correctness/quality review and `python-security-hardening` or `spring-security` when implementing security fixes.

## Review Principle

- Report only issues with a clear vulnerable pattern and a credible attacker-controlled input or trust-boundary violation.
- Research surrounding code to increase confidence, but report only on the requested file, diff, PR, or snippet scope.
- Do not flag issues from pattern matching alone; verify source, sink, validation, framework protections, and deployment context.
- Separate confirmed vulnerabilities from questions that need verification.

## Confidence Levels

- **High**: vulnerable sink plus attacker-controlled input or exploitable misconfiguration confirmed. Report with severity.
- **Medium**: suspicious pattern but source, validation, or reachability unclear. Put in `Needs Verification`.
- **Low**: theoretical, defense-in-depth, test-only, dead/commented code, or server-controlled value. Do not report as a finding.

## Security Areas

- Injection: SQL/NoSQL/command/template/LDAP and unsafe dynamic execution.
- XSS and HTML injection: `innerHTML`, `dangerouslySetInnerHTML`, `v-html`, unsafe template bypasses.
- Auth/authz: missing authorization checks, IDOR, privilege escalation, auth bypass, insecure sessions.
- SSRF and open redirect: user-controlled URL, host, redirect, or fetch target without allowlist.
- File handling: path traversal, unsafe uploads, archive extraction, XML/XXE.
- Deserialization: unsafe pickle/YAML/Java/PHP/object deserialization from untrusted input.
- Cryptography: weak randomness for secrets, insecure password hashing, broken algorithms in security contexts.
- Secrets and data protection: committed credentials, PII leaks, sensitive logs, token exposure.
- Supply chain and CI/CD: unpinned privileged actions, unsafe scripts, dependency confusion, secret exfiltration paths.
- Business logic: race conditions, replay, workflow bypass, missing ownership checks.

## Context Checks

- Trace user-controlled input: request params/body/headers/cookies, route params, uploads, webhook payloads, WebSocket messages, database content from other users.
- Treat settings, environment variables, hardcoded constants, internal config files, and framework constants as server-controlled unless evidence says otherwise.
- Check framework protections before flagging: ORM parameterization, template auto-escaping, CSRF middleware, routing/auth middleware, validators, serializers, schema checks.
- Verify whether auth is required and whether the authenticated user can influence the input or target resource.

## Output

```markdown
## Security Review

### Summary
- Findings: <count>
- Risk level: Critical/High/Medium/Low
- Confidence: High/Mixed

### Findings
- **[Severity] [Type]** `file:line`
  - **Issue:** <confirmed vulnerability>
  - **Impact:** <attacker outcome>
  - **Evidence:** <source -> sink path or relevant code>
  - **Fix:** <specific mitigation>

### Needs Verification
- `file:line` <what must be checked before calling this exploitable>
```

If no high-confidence vulnerabilities are found, state that explicitly and mention the reviewed scope.

## Avoid

- Reporting test files, docs, dead code, or comments unless explicitly in scope.
- Calling server-controlled configuration SSRF, redirect, or path traversal without user influence.
- Treating auto-escaped framework output as XSS unless escaping is explicitly bypassed.
- Downgrading a confirmed exploitable vulnerability into a style suggestion.
