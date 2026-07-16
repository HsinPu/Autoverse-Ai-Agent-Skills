---
name: article-writing
description: Evidence-led long-form writing workflow for turning an approved brief, source ledger, and optional brand voice into a coherent article, guide, essay, or newsletter with claim mapping, fact checks, and editorial quality gates. Use when producing substantial narrative content rather than a summary, technical specification, social post, or short-form video script.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/Autoverse-Ai-Agent-Skills"
  reference-source: "affaan-m/ECC"
  reference-license: "MIT"
  reference-revision: "ed387446052dfbc6b52de149406b70efa65edc59"
---

# Article Writing

Build a long-form narrative whose claims, structure, and voice survive editorial review.

## Workflow

1. Confirm the audience, reader job, publication type, angle, scope, length range, voice, CTA, deadline, and citation expectation.
2. Freeze the approved evidence set. Identify claims that still need research or must be qualified.
3. Choose one controlling idea and build an outline that earns it through evidence, explanation, and useful progression.
4. Map material claims to sources before drafting. Separate sourced fact, attributed opinion, analysis, and recommendation.
5. Draft for reader comprehension: establish stakes, develop one purpose per section, connect transitions, and end with a justified conclusion or action.
6. Apply the approved voice without changing facts, certainty, quotations, or attribution.
7. Run factual, structural, line, and publication-readiness passes. Record unresolved claims instead of smoothing them over.

## Editorial Gates

- **Brief gate:** audience, angle, outcome, scope, and exclusions are explicit.
- **Evidence gate:** every material factual claim has a source or a clear qualification.
- **Structure gate:** each section advances the controlling idea without repeated filler.
- **Voice gate:** tone matches the approved profile and remains readable.
- **Integrity gate:** titles, openings, examples, and CTAs do not overstate the article.

## References

- Read [references/article-brief-and-editorial-checklist.md](references/article-brief-and-editorial-checklist.md) when preparing the brief, outline, claim map, or final editorial review.

## Boundaries

- Do not invent missing facts, quotations, case studies, or personal experience.
- Do not hide uncertainty or source disagreement to make the narrative cleaner.
- Do not perform broad multi-source research inside the drafting pass.
- Do not turn the article into multiple platform variants or publish it externally without authorization.

## Handoff

- Use `web-research-ops` for missing current facts and source verification.
- Use `market-research` when the article depends on a market, audience, or competitor decision memo.
- Use `brand-voice` when a reusable organization or creator voice must be established first.
- Use `humanizer` for a final naturalness pass that preserves approved voice and evidence.
- Use `markdown-writer` for GFM structure and formatting after editorial content is approved.
- Use `content-repurposing` to derive channel-specific content from the approved article.
- Use `short-video-script` when the requested artifact is a short-form video script rather than an article.
