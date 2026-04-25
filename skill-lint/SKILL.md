---
name: skill-lint
description: Linting and validation workflow for SKILL.md files before publishing or using them. Use when checking structure, frontmatter, required sections, links, naming, or quality issues in an agent skill.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Skill Lint

Use this skill to validate a skill file before it ships.

## Workflow

1. Check frontmatter: `name`, `description`, source, and license.
2. Verify the folder name matches the skill name.
3. Inspect body structure for clear triggers, workflow steps, and handoff notes.
4. Flag missing references, broken paths, duplicate guidance, or vague instructions.
5. Report concrete fixes, not general opinions.

## Rules

- Prefer precise structural findings over style-only comments.
- Keep checks deterministic and repeatable.
- Treat description as the primary trigger surface.

## Handoff

- For security-focused review, use `skill-security-review`.
- For authoring or redesigning a skill, use `skill-creator-design`.
