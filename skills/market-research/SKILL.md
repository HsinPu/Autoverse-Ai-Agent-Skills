---
name: market-research
description: Decision-focused market research workflow for defining a market question, collecting current demand and competitor evidence, resolving source conflicts, and producing a confidence-labeled decision memo. Use when product, positioning, launch, audience, or investment decisions require market evidence rather than general web research or unsupported estimates.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/Autoverse-Ai-Agent-Skills"
  reference-source: "affaan-m/ECC"
  reference-license: "MIT"
  reference-revision: "ed387446052dfbc6b52de149406b70efa65edc59"
---

# Market Research

Turn current market evidence into a decision-ready recommendation.

## Workflow

1. Define the decision, target audience, geography, time horizon, market boundary, and excluded questions.
2. Convert the decision into falsifiable research questions and evidence requirements.
3. Collect primary and current sources before relying on commentary, aggregators, or vendor claims.
4. Build a claim-to-source ledger. Separate observed facts, estimates, interpretations, and recommendations.
5. Compare customer signals, alternatives, competitors, switching constraints, and evidence against the status quo.
6. Resolve conflicts by checking definitions, dates, methodology, sample, incentives, and market boundary.
7. Produce a decision memo with confidence, missing evidence, downside risks, and the next reversible action.

## Decision Memo

Include:

- decision and market boundary;
- strongest demand and counter-evidence;
- competitor and alternative matrix;
- confirmed facts, estimates, and inferences;
- confidence by claim and unresolved conflicts;
- recommendation, rejected options, and next validation step.

## Evidence Rules

- Preserve URLs, publication dates, measurement periods, definitions, and material methodology limits.
- Prefer direct customer, regulatory, company, transaction, or first-party product evidence when available.
- Do not convert a vendor estimate into a verified fact.
- Do not hide evidence that weakens the preferred recommendation.
- Recheck time-sensitive claims immediately before a consequential decision.

## References

- Read [references/research-brief-and-evidence.md](references/research-brief-and-evidence.md) when creating the research brief, evidence ledger, competitor matrix, or final decision memo.

## Boundaries

- Do not perform broad web-search mechanics here; route current-source collection to `web-research-ops`.
- Do not present TAM, SAM, or SOM without an explicit sizing method and defensible inputs.
- Do not write campaign copy, a brand voice profile, or an implementation specification inside the research memo.
- Stop when a required paid source, private customer record, or legal interpretation is unavailable or unauthorized.

## Handoff

- Use `web-research-ops` for current-source discovery, verification, and citation capture.
- Use `agent-reach-ops` when evidence must be collected from platform-specific social, video, code, or RSS sources.
- Use `solution-discovery` when the evidence must inform a product or implementation direction.
- Use `spec-flow` after a market-backed product direction is approved and needs executable requirements.
- Use `brand-voice` when the confirmed audience and positioning should shape a reusable voice profile.
- Use `article-writing` when the research should become a sourced long-form publication.
