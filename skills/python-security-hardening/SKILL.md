---
name: python-security-hardening
description: Python security hardening guide covering secrets handling, unsafe deserialization, subprocess and filesystem boundaries, network trust boundaries, and supply-chain hygiene. Use when writing or reviewing Python code with security-sensitive inputs, dependencies, or execution boundaries, and when the task is to harden implementation details rather than review a diff for security findings.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Python Security Hardening

Use this skill when Python code needs secure-by-default implementation choices.

## When To Use

- Handle secrets, tokens, credentials, or environment-based config
- Review file, subprocess, shell, or network trust boundaries
- Avoid unsafe deserialization or dynamic execution paths
- Reduce dependency and supply-chain risk in Python projects
- Harden Python code before it ships or is exposed to untrusted input

## Boundaries

- Use `code-review` for reviewing diffs and surfacing security findings.
- Use `python-packaging-release` for release mechanics and artifact publication.
- Use `python-backend-development` for framework structure and app flow.
- Use `python-automation-scripting` for local operational scripts.

## Workflow

1. Identify the trust boundary and attacker-controlled input.
2. Remove or minimize dangerous primitives.
3. Prefer explicit allowlists over implicit trust.
4. Keep secrets out of source and logs.
5. Validate dependencies, inputs, and execution paths.
6. Verify the hardening change does not break expected behavior.

## Hardening Rules

- Do not hardcode secrets or credentials.
- Avoid `eval`, `exec`, unsafe `pickle`, and equivalent dynamic execution on untrusted input.
- Treat shell and subprocess calls as sensitive boundaries.
- Validate paths before reading or writing.
- Prefer secure defaults for network and auth-related settings.

## Supply Chain Rules

- Pin and review dependencies deliberately.
- Prefer maintained and minimal dependency sets.
- Treat new transitive dependencies as part of the change.
- Inspect release artifacts and build inputs when packaging is involved.

## Handoff

- For diff review and risk findings, hand off to `code-review`.
- For packaging and release output, hand off to `python-packaging-release`.
- For general implementation style, hand off to `python-development`.

- See [reference/security-workflows.md](reference/security-workflows.md) for deeper guidance.
