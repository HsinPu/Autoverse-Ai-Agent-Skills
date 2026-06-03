---
name: security-scanning
description: Security scanning workflow for SAST, dependency vulnerability checks, secret scanning, container image scans, IaC scans, SBOM generation, CI security gates, and vulnerability triage. Use when running or configuring automated security tools rather than doing manual secure code review.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Security Scanning

Use this skill when the task is to run, configure, or interpret automated security scans.

## Workflow

1. Identify the asset type: source code, dependencies, containers, IaC, secrets, APIs, or deployed services.
2. Choose the smallest appropriate scanner class: SAST, SCA, secret scan, image scan, IaC scan, DAST, or compliance check.
3. Run scans with reproducible inputs and capture tool version, ruleset, scope, and exclusions.
4. Triage findings by exploitability, reachability, environment, data sensitivity, and compensating controls.
5. Fix, suppress with justification, or track findings with owner, deadline, and verification steps.

## Rules

- Do not treat scanner output as proof without validating context and reachability.
- Keep suppressions narrow, documented, and time-bound.
- Never print real secrets; rotate exposed credentials instead of only removing them from code.
- Prioritize high-confidence, exploitable findings over noisy generic warnings.
- Integrate critical scans into CI only when the signal is stable enough to gate merges.

## Handoff

- For manual vulnerability review, use `security-code-review`.
- For Python implementation hardening, use `python-security-hardening`.
- For GitHub Actions security gates, use `github-actions-ci`.
