---
name: skillforge
description: Skill quality-gate workflow for linting, signing, versioning, and evaluating SKILL.md packages before release or reuse. Use when a skill needs a stronger verification layer than linting or audit alone.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Skillforge

Use this skill to harden a skill package before it is shared.

## Workflow

1. Validate the skill structure and metadata.
2. Check for consistent versioning and release intent.
3. Evaluate the skill on representative cases.
4. Record signing or verification expectations when needed.
5. Report whether the package is ready to publish or should be fixed first.

## Rules

- Keep the gate deterministic and reproducible.
- Prefer concrete pass or fail criteria.
- Treat evaluation results as part of the release decision.

## Handoff

- For basic structural checks, use `skill-lint`.
- For security and policy review, use `skill-audit`.
