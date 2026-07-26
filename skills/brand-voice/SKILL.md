---
name: brand-voice
description: Brand voice extraction and application workflow for deriving reusable tone, vocabulary, rhythm, messaging boundaries, and transformation examples from representative source material. Use when writing must consistently sound like a specific organization, product, publication, or creator rather than merely becoming more natural or less AI-like.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "affaan-m/ECC"
  reference-license: "MIT"
  reference-revision: "ed387446052dfbc6b52de149406b70efa65edc59"
---

# Brand Voice

Derive a reusable voice profile from evidence instead of inventing adjectives.

## Workflow

1. Confirm the brand, audience, channel range, language, and high-risk contexts where tone must change.
2. Select representative samples written or approved by the brand. Exclude copied, obsolete, or low-confidence material.
3. Identify repeated patterns in stance, vocabulary, sentence shape, rhythm, formality, humor, evidence, CTA, and reader relationship.
4. Separate stable voice from channel-specific tone and one-off campaign style.
5. Create a voice profile with confidence-labeled rules, preferred patterns, prohibited patterns, and before/after examples.
6. Test the profile by transforming neutral copy and comparing it with held-out brand samples.
7. Revise rules that produce imitation, caricature, factual drift, or inconsistent results.

## Voice Profile

Record:

- audience relationship and brand stance;
- stable voice dimensions and confidence;
- preferred vocabulary, syntax, rhythm, and evidence style;
- avoided words, clichés, claims, and tonal failures;
- channel or risk-specific tone adjustments;
- transformation examples that preserve meaning;
- unresolved conflicts across source samples.

## Rules

- Base every strong rule on repeated evidence from approved material.
- Preserve facts and intent while changing expression.
- Do not imitate a living individual deceptively or infer private personal traits.
- Do not let polishing remove necessary legal, safety, accessibility, or product clarity.
- Mark low-confidence rules instead of forcing inconsistent samples into one voice.

## References

- Read [references/voice-profile-rubric.md](references/voice-profile-rubric.md) when selecting a corpus, scoring voice dimensions, writing rules, or validating transformed copy.

## Boundaries

- Do not perform market positioning research or audience discovery here.
- Do not use this skill only to remove generic AI-writing patterns; use `humanizer` for that narrower task.
- Do not expand a voice profile into a full article or channel campaign.

## Handoff

- Use `market-research` when audience, positioning, or competitor context is not yet supported by evidence.
- Use `article-writing` to apply the approved profile to sourced long-form content.
- Use `product-pitch-writing` to apply the approved profile to an evidence-grounded product pitch, demo talk, keynote, or presentation speech.
- Use `content-repurposing` to preserve the profile across channel-specific derivatives.
- Use `ux-writing` for interface microcopy that must apply the voice under usability constraints.
- Use `humanizer` only after brand traits are preserved and the draft still sounds formulaic.
