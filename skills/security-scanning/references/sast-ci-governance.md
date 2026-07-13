# SAST And CI Governance

## Contents

- Tool selection
- Baseline adoption
- SARIF and triage
- Suppression records
- CI gates
- Scanner health

## Tool Selection

Choose tools by supported languages, build requirements, data-flow depth, rule transparency, output format, local reproducibility, and update cadence.

- Use lightweight pattern scanning for fast custom policy and broad coverage.
- Use compiled or database-backed analysis when cross-file and data-flow reasoning materially improves findings.
- Combine SAST with dependency, secret, container, and IaC scanning instead of expecting one tool to cover every asset.

## Baseline Adoption

1. Freeze tool, ruleset, source revision, and exclusions.
2. Triage critical and reachable findings first.
3. Record accepted legacy findings in a temporary baseline.
4. Block newly introduced high-confidence findings.
5. Reduce the baseline through owned milestones.
6. Expire suppressions and re-evaluate after ruleset changes.

Do not hide an entire directory when a narrow rule or generated-file exclusion is sufficient.

## SARIF And Triage

Preserve rule ID, location, code flow, severity, confidence, fingerprint, tool version, and source revision. Deduplicate by stable fingerprint and root cause. Validate whether the vulnerable path is built, deployed, reachable, and supplied attacker-controlled data.

## Suppression Record

Require:

- finding and rule identifier
- affected asset
- reason and compensating control
- owner and approver
- creation and expiry date
- revalidation trigger

## CI Gates

- Pull request: changed-code findings, secrets, dependency deltas, and policy violations.
- Default branch: full scan, SBOM, trend, and baseline reconciliation.
- Release: artifact, image, provenance, and critical unresolved risk.

Provide a documented break-glass path with narrow authority, expiry, and audit evidence.

## Scanner Health

Fail visibly when the scanner crashes, silently skips languages, cannot build, uses an expired database, uploads incomplete results, or exceeds time limits. A green workflow with no analyzed files is not a passing security scan.
