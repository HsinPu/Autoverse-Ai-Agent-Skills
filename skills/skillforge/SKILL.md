---
name: skillforge
description: Certify Skill packages through deterministic linting, provenance, versioning, representative golden cases, rubric-based semantic evaluation, regression thresholds, signing, and reproducible release evidence. Use when a SKILL.md package needs a stronger quality gate before publishing, installing, or reusing it across agent environments.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Skillforge

## Certification Workflow

1. Freeze the candidate package, version, source revision, dependency surface, and intended trigger behavior.
2. Run structural lint, link validation, package inventory, script tests, and security audit.
3. Build representative positive, negative, boundary, and adversarial tasks with expected evidence.
4. Evaluate trigger precision, instruction quality, task completion, safety, and context efficiency.
5. Repeat nondeterministic trials and measure failure distribution, grader agreement, and semantic regressions.
6. Define pass thresholds and record exceptions, environment, models, prompts, tools, and evaluator versions.
7. Sign or attest the manifest and publish a reproducible certification receipt.

## Rules

- Keep structural gates deterministic and semantic gates versioned.
- Do not tune against the held-out certification set.
- Fail certification when required scripts, links, licenses, provenance, or safety boundaries are unverifiable.
- Record both successful and failed cases; do not publish an aggregate score alone.
- Treat a changed Skill body, resource, script, or dependency as a new certification candidate.

## References

- Read [references/evaluation-and-certification.md](references/evaluation-and-certification.md) for rubric dimensions, golden-set construction, repeated trials, agreement, signing, receipts, and release criteria.

## Handoff

- Use `skill-lint` for structural validation.
- Use `skill-audit` for package quality and security findings.
- Use `skill-security-review` for third-party provenance and executable content.
- Use `llm-evals` for deeper statistical evaluation design.
