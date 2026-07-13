---
name: security-scanning
description: Configure, run, and govern automated security scanning across source code, dependencies, secrets, containers, infrastructure as code, APIs, SBOMs, and CI gates. Use when selecting or tuning SAST, SCA, secret, image, IaC, or DAST tools; establishing baselines and SARIF reporting; triaging findings; or designing reliable security quality gates.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Security Scanning

## Workflow

1. Define assets, languages, build paths, trust boundaries, environments, compliance needs, and merge or release decisions.
2. Select the smallest scanner set covering source, dependencies, secrets, images, IaC, APIs, or deployed surfaces.
3. Pin tool and ruleset versions; record scope, exclusions, generated code, baselines, and expected artifacts.
4. Run scans on reproducible inputs and emit machine-readable results such as SARIF, SBOM, or signed reports.
5. Triage by reachability, exploitability, privilege, data sensitivity, exposure, and compensating controls.
6. Fix, quarantine, or suppress narrowly with owner, justification, expiry, and verification.
7. Gate CI only after measuring signal quality and defining emergency override and audit behavior.

## Governance Rules

- Never treat a scanner finding as proven without validating the reachable code or configuration path.
- Rotate exposed secrets; removing a committed value is not sufficient remediation.
- Keep baselines temporary and prevent new debt while old findings are reduced.
- Separate generated, vendored, test, and production paths explicitly.
- Review ruleset changes like dependency changes because they alter policy behavior.

## References

- Read [references/sast-ci-governance.md](references/sast-ci-governance.md) for Semgrep, CodeQL, SARIF, baseline adoption, suppression records, CI thresholds, and scanner health checks.

## Handoff

- Use `threat-modeling` to derive security requirements from architecture and abuse cases.
- Use `security-code-review` for manual vulnerability analysis.
- Use `github-actions-ci` for workflow implementation.
- Use `skill-security-review` when evaluating third-party Skill packages.
