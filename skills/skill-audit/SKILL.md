---
name: skill-audit
description: Skill audit workflow for checking SKILL.md files and bundled content for quality, safety, and policy issues before adoption. Use when a skill needs a deeper structural or security review beyond a simple lint pass.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Skill Audit

Use this skill to judge whether a skill is safe and fit for use.

## Workflow

1. Check the manifest, folder shape, and declared purpose.
2. Inspect bundled scripts, references, and assets for hidden behavior or risky patterns.
3. Look for prompt injection, secret access, network exfiltration, and opaque execution.
4. Compare the skill's promise with its actual scope.
5. Summarize the risk and the minimum safe action.

## Rules

- Treat provenance and execution surface as first-class signals.
- Keep findings specific and evidence-based.
- Distinguish quality issues from security issues.

## Handoff

- For basic structure checks, use `skill-lint`.
- For source provenance or repo metadata, use `skill-security-review`.
