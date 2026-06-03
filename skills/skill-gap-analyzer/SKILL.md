---
name: skill-gap-analyzer
description: Skill catalog gap analysis workflow for generating search keywords, comparing local skills with external marketplace or GitHub candidates, and deciding whether to upgrade an existing skill, add a new one, adapt marketplace ideas, or keep the catalog unchanged. Use when evaluating coverage gaps, overlap, or upgrade opportunities in a skill catalog.
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
3. Search external skill sources for candidate skills using the keyword set.
   - Use the marketplace CLI when available: `npx.cmd -y @lobehub/market-cli skills search --q "<keywords>" --page-size 10 --locale en-US --output json` on Windows, or `npx -y @lobehub/market-cli skills search --q "<keywords>" --page-size 10 --locale en-US --output json` elsewhere.
   - Use the open Skills CLI when the user is asking about installable agent skills broadly: `npx skills find <query>`.
   - Check `https://skills.sh/` when leaderboard, install count, or package page metadata would materially change the recommendation.
   - If credentials are missing, inspect `register --help`; register only when marketplace search is needed and the user goal justifies a local credential.
   - Start with the most specific query, then broaden if needed.
4. Open likely matches with the available detail view or repository link; do not compare from search snippets only.
5. Compare the external candidates against the local catalog for overlap, trigger fit, coverage, and maintenance cost.
6. Choose one outcome:
   - Upgrade an existing skill when the local skill is close but missing steps, examples, or tooling.
   - Add a new skill when no local skill covers the task cleanly.
   - Keep the catalog unchanged when the current skill already fits.
7. Return the decision with the local skill(s), candidate skill(s), keywords used, quality signals, and the reason.

## Boundaries

- Use `skill-explorer` for local-only catalog navigation.
- Use this skill for cross-marketplace or GitHub-based gap analysis and catalog completion decisions.
- Use `skillctl` for direct CLI command routing when no comparison or decision is needed.
- Use `skill-security-review` before installing or importing third-party bundled scripts, templates, or executable content.
- Prefer adapting ideas into local style over copying a marketplace skill wholesale.

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
- Treat install counts, stars, and ratings as weak signals; prioritize instruction quality and fit with the local catalog.
- Prefer well-known or official sources when two candidates have similar fit.
- Be cautious with skills that have very low install counts, unclear provenance, no license, or repositories with little maintenance evidence.
- Do not recommend a third-party skill solely because it appears in search results.
- Avoid adding a new skill when an existing skill only needs a concise trigger or workflow update.
- Ask one short clarifying question if the task scope is still ambiguous.

## Output

- `Decision`: upgrade, add, or no action
- `Keywords`: the query set used for LobeHub search
- `Candidates`: external skills reviewed, including source and quality signals when available
- `Why`: short evidence summary, including overlap with the local catalog
- `Next step`: the exact file or skill to change

## Handoff

- For local catalog navigation, use `skill-explorer`.
- For CLI search or install actions, use `skillctl`.
- For structure checks after edits, use `skill-lint`.
