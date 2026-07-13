---
name: repo-ready
description: Prepare and harden repositories through stack-aware structure, contributor instructions, AGENTS.md guidance, documentation, quality commands, CI, security automation, templates, release metadata, and pre-commit safeguards. Use when starting a repository, making an existing project contributor-ready, or auditing repository hygiene and automation without adding generic boilerplate.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Repo Ready

## Workflow

1. Inspect stack, entry points, package and build files, tests, deployment, ownership, current docs, and repository status.
2. Identify the minimum contributor journey from clean checkout through verified change and release.
3. Add only stack-specific instructions, commands, templates, automation, and metadata that can be maintained.
4. Make local and CI checks consistent, actionable, and resistant to silent bypass.
5. Validate setup, build, test, lint, security, packaging, and release paths that were changed.
6. Remove placeholder text and document intentional omissions.

## Baseline Areas

- README purpose, supported setup, commands, configuration, architecture entry points, and troubleshooting
- AGENTS.md or equivalent coding-agent scope, verification, and safety rules
- issue and pull-request templates with reproducible evidence fields
- formatter, linter, tests, pre-commit hooks, CI, dependency and secret scanning
- ownership, license, contribution, security reporting, release, and package metadata

## Rules

- Never overwrite meaningful project conventions with a generic template.
- Do not create empty governance files, fake badges, untested commands, or unsupported platform promises.
- Avoid scripts that mutate global developer state silently.
- Preserve user changes and inspect the diff for generated churn.
- Treat bypass flags, unpinned actions, broad workflow tokens, and secret exposure as repository risks.

## References

- Read [references/scan-and-guardrails.md](references/scan-and-guardrails.md) for repository inventory, AGENTS.md bootstrap, CI baseline, pre-commit bypass protection, and readiness evidence.

## Handoff

- Use `git-readme-writer` for README design.
- Use `agent-instructions-authoring` for AGENTS.md.
- Use `github-actions-ci` for workflow implementation.
- Use `security-scanning` for automated security gates.
