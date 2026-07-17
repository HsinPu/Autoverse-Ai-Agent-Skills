---
name: design-intelligence-search
description: Deterministic local search workflow for retrieving relevant product-pattern, visual-direction, color, typography, layout, interaction, accessibility, data-visualization, and content guidance from an auditable design knowledge base. Use when a UI brief needs evidence-labeled candidate directions or stack-aware design constraints before taste-skill, design-system, or frontend implementation; do not use as a substitute for user research or approved brand requirements.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "nextlevelbuilder/ui-ux-pro-max-skill"
  reference-license: "MIT"
  reference-revision: "f8ac5e1266dba8354ea96e19994d9f4345e7ec31"
---

# Design Intelligence Search

Search a small local knowledge base before proposing UI direction. Treat matches as candidates to evaluate against product evidence, not universal design laws.

## Workflow

1. Inspect the product surface, audience, task, brand constraints, existing UI, target stack, and accessibility requirements.
2. Turn the need into a concrete query such as `dense analytics comparison`, `trustworthy checkout`, or `mobile onboarding form`.
3. Run the bundled search script from this Skill package:

   ```bash
   node scripts/search-design-intelligence.mjs "dense analytics comparison" --domain data-visualization --stack react --limit 5
   ```

4. Add `--json` when another tool or Agent must consume the result. Use `--list-domains` to inspect available filters.
5. Review why each result matched, its signals, avoid-when conditions, and evidence prompts. Discard generic or contradictory advice.
6. Separate source-backed requirements, repository facts, search candidates, and your own inference.
7. Route accepted direction decisions to `taste-skill` and durable token or component decisions to `design-system`.

Read [references/knowledge-schema.md](references/knowledge-schema.md) when extending or interpreting the dataset.

## Query Rules

- Prefer product intent and task language over style-only prompts such as `make it modern`.
- Natural Chinese queries are segmented into bounded CJK n-grams, but explicit product and task terms still produce more explainable matches.
- Use `--domain` only to narrow a known concern; an over-specific filter can hide useful cross-domain matches.
- Use `--stack` for implementation constraints, not for visual taste.
- If the result set is empty, broaden or rephrase the query. Do not fabricate a match.
- If the product evidence conflicts with a retrieved candidate, the product evidence wins and the conflict must be recorded.
- Cite the record IDs used in downstream design decisions so another reviewer can reproduce the search.

## Output Contract

Return:

- query, filters, dataset revision, dataset/script SHA-256 values, and command;
- selected record IDs and match reasons;
- each record's evidence level and any matched counter-signal;
- accepted candidates, rejected candidates, and product-specific reasoning;
- unresolved evidence or research gaps;
- downstream owner: visual direction, design system, implementation, accessibility, or user research.

## Boundaries

- Do not claim the local dataset represents all cultures, industries, users, or current trends.
- Do not turn preference patterns into accessibility or usability facts.
- Do not replace user interviews, analytics, usability testing, brand approval, or legal review.
- Do not import upstream datasets or remote mutable prompts at runtime. Keep additions reviewable and source-attributed.

## Handoff

- Use `taste-skill` to synthesize accepted candidates into a contextual visual direction.
- Use `design-system` to encode approved tokens, components, provenance, and drift rules.
- Use `frontend-design` to implement a selected direction in the repository's architecture.
- Use `accessibility-testing` to verify accessibility requirements rather than trusting a guidance record.
