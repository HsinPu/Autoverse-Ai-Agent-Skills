---
name: skill-audit
description: Audit Skill packages for trigger quality, instruction coverage, progressive disclosure, provenance, licensing, bundled scripts, external actions, secret access, prompt injection, exfiltration, and maintenance risk. Use before adopting, publishing, upgrading, or trusting a SKILL.md package when linting alone cannot establish quality and safety.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Skill Audit

## Workflow

1. Record source, revision, author, license, package inventory, claimed purpose, target environments, and update history.
2. Verify name, trigger description, instructions, references, links, scripts, assets, and generated artifacts match the claim.
3. Trace data access, network use, subprocesses, filesystem writes, credentials, external mutations, and approval boundaries.
4. Test for prompt injection, hidden instructions, scope expansion, unsafe defaults, destructive behavior, and telemetry or exfiltration.
5. Evaluate context cost, duplication, reference routing, portability, maintenance ownership, and dependency drift.
6. Rank findings and choose adopt, adapt, quarantine, reject, or accept with explicit controls.

## Decision Rules

- Reject unverifiable provenance, incompatible licensing, concealed execution, credential harvesting, or unauthorized external mutation.
- Quarantine scripts that cannot be inspected or reproduced safely.
- Prefer adapting ideas into first-party instructions over importing opaque bundles.
- Separate security blockers, quality defects, compatibility limits, and optional improvements.
- Re-audit when source revision, scripts, dependencies, or permissions change.

## References

- Read [references/audit-rubric.md](references/audit-rubric.md) for evidence fields, severity, script review, prompt-injection tests, provenance checks, and decision templates.

## Handoff

- Use `skill-lint` for deterministic structure checks.
- Use `skill-executor` for controlled runtime proof of scripts and representative tasks.
- Use `skill-security-review` for deeper third-party and supply-chain vetting.
- Use `skillforge` for certification after remediation.
