---
name: skill-gap-analyzer
description: Compare local skills against LobeHub marketplace skills to find gaps, overlaps, and upgrade opportunities. Use when deciding whether to improve an existing skill, add a new skill, or keep the catalog unchanged.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Skill Gap Analyzer

Use this skill to decide whether the catalog needs an upgrade or a new skill.

## Workflow

1. Clarify the user goal and the capability the catalog should cover.
2. Search LobeHub for candidate skills using task-oriented keywords.
   - Use the marketplace CLI when available: `npx -y @lobehub/market-cli skills search --q "<keywords>"`
3. Compare the LobeHub candidates against the local catalog for overlap, trigger fit, coverage, and maintenance cost.
4. Choose one outcome:
   - Upgrade an existing skill when the local skill is close but missing steps, examples, or tooling.
   - Add a new skill when no local skill covers the task cleanly.
   - Keep the catalog unchanged when the current skill already fits.
5. Return the decision with the local skill(s), candidate skill(s), and the reason.

## Decision Rules

- Prefer the smallest change that solves the gap.
- Do not create a new skill if a local skill can be widened with a small, clear edit.
- Prefer a new skill when the task scope is distinct, reusable, and likely to recur.
- Use marketplace metadata as evidence, not as the only signal.
- Ask one short clarifying question if the task scope is still ambiguous.

## Output

- `Decision`: upgrade, add, or no action
- `Why`: short evidence summary
- `Next step`: the exact file or skill to change

## Handoff

- For local catalog navigation, use `skill-explorer`.
- For CLI search or install actions, use `skillctl`.
- For structure checks after edits, use `skill-lint`.
