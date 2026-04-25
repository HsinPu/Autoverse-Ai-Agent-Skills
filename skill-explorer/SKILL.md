---
name: skill-explorer
description: Skill discovery and navigation workflow for browsing available skills, understanding category coverage, and finding the right skill for a task. Use when the user needs help exploring the skill catalog or mapping a request to an existing skill.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Skill Explorer

Use this skill to find the right skill faster.

## Workflow

1. Identify the task domain and likely category.
2. Compare the request against nearby skills and their triggers.
3. Prefer an existing skill before inventing a new one.
4. Point out overlaps and the narrowest fit.
5. Summarize the recommendation in one or two options.

## Rules

- Keep the search focused on the current catalog.
- Surface near-matches, not just exact matches.
- Use category coverage to explain why a skill fits.

## Handoff

- For linting or validation of a skill file, use `skill-lint`.
- For security and policy review, use `skill-audit`.
