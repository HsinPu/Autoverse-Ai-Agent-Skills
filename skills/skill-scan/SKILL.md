---
name: skill-scan
description: Skill package scanning workflow for quickly reviewing a skill folder for structure, suspicious content, and release readiness. Use when you need a fast first-pass scan that can escalate to lint, audit, or quality-gate checks.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Skill Scan

Use this skill to triage a skill package quickly.

## Workflow

1. Scan the folder shape, manifest, and trigger text.
2. Look for suspicious files, hidden scripts, or unexpected assets.
3. Judge whether the package is safe enough for a deeper pass.
4. Escalate to `skill-lint`, `skill-audit`, or `skillforge` when needed.
5. Report the narrowest next action.

## Rules

- Keep the scan fast and lightweight.
- Focus on first-pass risk signals.
- Do not replace deeper review steps when they are needed.

## Handoff

- For structure and naming checks, use `skill-lint`.
- For quality and safety review, use `skill-audit`.
- For release gating, use `skillforge`.
