---
name: skill-gap-analyzer
description: Compare local skills against LobeHub marketplace skills and generate search keywords to find gaps, overlaps, and upgrade opportunities. Use when deciding whether to improve an existing skill, add a new skill, or keep the catalog unchanged.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Skill Gap Analyzer

Use this skill to decide whether the catalog needs an upgrade or a new skill.

## Workflow

1. Clarify the user goal and the capability the catalog should cover.
2. Generate search keywords before searching.
   - Extract core nouns, task verbs, target artifacts, tools, platforms, and likely synonyms.
   - Include both English and Chinese terms when helpful.
   - Turn them into 3 to 5 short queries.
3. Search LobeHub for candidate skills using the keyword set.
   - Use the marketplace CLI when available: `npx -y @lobehub/market-cli skills search --q "<keywords>"`
   - Start with the most specific query, then broaden if needed.
4. Compare the LobeHub candidates against the local catalog for overlap, trigger fit, coverage, and maintenance cost.
5. Choose one outcome:
   - Upgrade an existing skill when the local skill is close but missing steps, examples, or tooling.
   - Add a new skill when no local skill covers the task cleanly.
   - Keep the catalog unchanged when the current skill already fits.
6. Return the decision with the local skill(s), candidate skill(s), keywords used, and the reason.

## Keyword Rules

- Start with the user's real task, not abstract labels.
- Add synonym queries for the same intent.
- Add product, platform, or file-format terms when relevant.
- Use local skill names and tags as extra search terms when they point to a match.
- Keep queries short; avoid long natural-language sentences.

## Decision Rules

- Prefer the smallest change that solves the gap.
- Do not create a new skill if a local skill can be widened with a small, clear edit.
- Prefer a new skill when the task scope is distinct, reusable, and likely to recur.
- Use marketplace metadata as evidence, not as the only signal.
- Ask one short clarifying question if the task scope is still ambiguous.

## Output

- `Decision`: upgrade, add, or no action
- `Keywords`: the query set used for LobeHub search
- `Why`: short evidence summary
- `Next step`: the exact file or skill to change

## Handoff

- For local catalog navigation, use `skill-explorer`.
- For CLI search or install actions, use `skillctl`.
- For structure checks after edits, use `skill-lint`.
