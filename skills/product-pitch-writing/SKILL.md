---
name: product-pitch-writing
description: Evidence-grounded product and system pitch writing workflow for inspecting supplied repositories, documentation, demos, and approved product truth, then converting verified capabilities into audience-specific selling points, value propositions, timed presentation speeches, demo narratives, keynote talks, and speaker notes. Use when the user asks for a product pitch, sales presentation script, system introduction, demo talk, launch speech, 演講稿, 系統特色, 產品賣點, 產品介紹, or 簡報講稿. Do not use when the primary task is only slide-file layout, a generic article, or market-positioning research.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Product Pitch Writing

Turn verified product truth into a persuasive spoken narrative without inventing capabilities, differentiation, or proof.

## Ownership Boundary

This Skill owns:

- the product-pitch brief and claim authority;
- the feature-to-value and selling-point ledger;
- audience-specific message hierarchy;
- timed talk outline and full spoken script;
- demo, slide, transition, and delivery cues;
- unsupported-claim, caveat, and approval notes.

Route elsewhere when the primary artifact changes:

- Use `project-architecture-review` when repository-wide architecture, dependency direction, or restructuring is the requested outcome.
- Use `market-research` when audience, category, competitor, or comparative positioning still requires external evidence.
- Use `brand-voice` when a reusable organization or product voice must be extracted before drafting.
- Use `article-writing` when the deliverable is a long-form article rather than a spoken presentation.
- Use `presentation-ops` when the primary deliverable is an editable slide deck or `.pptx` file.

## Pitch Brief

Resolve these fields from the conversation and supplied artifacts:

| Field | Required decision |
| --- | --- |
| Product truth | Which repository, documents, demos, metrics, and approved statements may support claims? |
| Audience | Who is listening, what do they already know, and what decision can they make? |
| Occasion | Sales demo, launch, keynote, technical talk, internal adoption, investor update, or another setting? |
| Outcome | What should the audience understand, believe, remember, or do? |
| Duration | What speaking time, Q&A boundary, and hard stop apply? |
| Proof | Which examples, results, demonstrations, customers, or measurements are approved? |
| Constraints | Which claims, comparisons, disclosures, confidentiality rules, or topics are restricted? |
| Voice | Which language, formality, brand profile, and speaker persona should the script preserve? |

Ask only when a missing field would materially change the pitch. Otherwise proceed with explicit assumptions. Never treat an aspiration, roadmap item, filename, comment, mockup, or unverified inference as a shipped capability.

## Evidence and Value Ladder

Build a claim ledger before drafting:

```text
Source evidence
  -> confirmed capability
  -> audience problem or job
  -> product mechanism
  -> concrete benefit
  -> relevant differentiator
  -> reason to believe
  -> caveat, confidence, and approved wording
```

Keep these concepts separate:

- **Feature:** what the product does.
- **Benefit:** what improves for this audience.
- **Differentiator:** why the audience should prefer this approach over a real alternative.
- **Proof:** evidence that supports the feature, benefit, or differentiation claim.
- **Limitation:** a condition under which the claim does not hold.

Do not convert internal complexity into customer value unless the effect is demonstrated. Require evidence for superlatives, performance numbers, customer outcomes, compatibility, security, availability, and comparisons.

## Workflow

1. Freeze the pitch brief, claim sources, exclusions, and approval boundary.
2. Inspect the supplied product evidence and record confirmed capabilities, proof, gaps, limitations, and confidence.
3. Convert capabilities into audience-relevant value using the evidence and value ladder.
4. Select three to five primary selling points by relevance, distinctness, evidence strength, and fit with the requested action.
5. Choose one controlling idea and an occasion-appropriate arc. Do not assemble unrelated feature bullets.
6. Allocate the available speaking time across the opening, problem, solution, selling points, proof or demonstration, objection handling, and close.
7. Draft for speech: use speakable sentences, deliberate repetition, clear transitions, concrete examples, and one audible call to action.
8. Add slide, demo, pause, emphasis, and fallback cues only when useful to delivery.
9. Read through for timing, claim integrity, audience comprehension, spoken rhythm, and continuity. Shorten substance before accelerating delivery.

## Speech Rules

- Open with an audience-relevant tension, observation, question, or result; avoid ceremonial filler.
- State the problem before presenting the feature list.
- Explain each selling point as `problem -> mechanism -> benefit -> proof`.
- Prefer one memorable phrase and concrete example over several unsupported adjectives.
- Preserve necessary limitations and uncertainty without burying the main message.
- Write for the named speaker and audience, not for a generic marketing persona.
- Keep slide text and spoken narration complementary rather than identical.
- End with a specific next step that the audience is authorized and able to take.

## Delivery Contract

Unless the user requests only one artifact, return:

1. **Pitch brief** - audience, occasion, objective, duration, voice, sources, and assumptions.
2. **Selling-point matrix** - feature, audience problem, benefit, differentiator, proof, limitation, and confidence.
3. **Timed outline** - section purpose, duration, message, evidence, and delivery cue.
4. **Full speech** - ready-to-say script with transitions and a clear close.
5. **Presentation cues** - optional slide, demo, pause, emphasis, and recovery notes.
6. **Claim risks** - unsupported, comparative, confidential, stale, or approval-dependent statements.

If the user asks for only the final speech, still perform the evidence and timing checks internally. Include only caveats that materially limit safe use of the script.

## Quality Gate

- Every material product claim maps to supplied or approved evidence.
- The selected selling points matter to the named audience and support the requested action.
- Feature, benefit, differentiation, proof, and limitation remain distinguishable.
- The speech has one controlling idea, a coherent arc, and an audible close.
- The script fits the time limit in a realistic read-through and does not depend on rushing.
- Wording is speakable, specific, and consistent with the approved voice.
- Slide and demo cues do not conceal missing evidence or become required for basic comprehension.

## Reference

Read [references/pitch-brief-and-review.md](references/pitch-brief-and-review.md) when building the claim ledger, choosing an occasion-specific arc, allocating time, or running the final review.

## Handoff

- Use `project-architecture-review` when understanding the system requires a deeper repository or architecture map before claims can be approved.
- Use `market-research` before making category, competitor, market, or audience assertions not supported by the supplied evidence.
- Use `brand-voice` before drafting when approved examples must become a reusable voice profile.
- Use `humanizer` only as a final naturalness pass after product truth, message hierarchy, and brand voice are stable.
- Use `presentation-ops` after the narrative is approved when an editable deck, diagrams, layout, or speaker-note file is required.
- Use `content-repurposing` when an approved pitch must become additional channel-specific assets.
