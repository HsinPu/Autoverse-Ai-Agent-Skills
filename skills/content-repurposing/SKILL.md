---
name: content-repurposing
description: Source-controlled content repurposing workflow for adapting an approved article, report, transcript, or campaign asset into channel-specific derivatives while preserving facts, brand voice, core message, CTA, and source traceability. Use when one approved source must become multiple social, email, visual, audio, or video-ready content artifacts without adding unsupported claims or publishing them automatically.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
reference-source: affaan-m/ECC
reference-license: MIT
---

# Content Repurposing

Adapt approved source content without breaking its evidence, message, or voice.

## Workflow

1. Freeze the approved source, version, claims, audience, voice profile, CTA, rights, exclusions, and expiry-sensitive facts.
2. Select channels from actual campaign goals and audience behavior rather than producing every possible format.
3. Verify current platform constraints when dimensions, duration, features, or limits affect the artifact.
4. Create a channel brief for audience intent, hook, content shape, proof, CTA, visual or audio needs, and approval owner.
5. Produce each derivative from traceable source segments. Mark any new claim or interpretation for research and approval.
6. Review fidelity, voice, platform fit, accessibility, rights, and CTA consistency.
7. Preserve a derivative ledger and stop before external publishing unless separately authorized.

## Fidelity Rules

- Keep factual certainty, attribution, quotations, and material caveats consistent with the source.
- Adapt structure and phrasing; do not copy the source mechanically when the channel requires a different reading or viewing behavior.
- Do not turn a secondary point into the main claim without approval.
- Do not hard-code platform limits that may have changed; verify them at execution time.
- Do not manufacture urgency, testimonials, results, or controversy to improve engagement.

## References

- Read [references/channel-adaptation-matrix.md](references/channel-adaptation-matrix.md) when selecting derivatives, writing channel briefs, or preserving source-to-derivative traceability.

## Boundaries

- Do not use this skill for source-only summarization; use `summary-ops`.
- Do not establish a brand voice profile or conduct missing market research here.
- Do not publish, schedule, message, or mutate external accounts without explicit authorization and the appropriate tool workflow.

## Handoff

- Use `web-research-ops` to verify current platform constraints or substantiate a new claim before adapting it.
- Use `agent-reach-ops` when platform-specific social, video, or RSS evidence must be collected from its native channel.
- Use `article-writing` when the source must first become an approved long-form article.
- Use `brand-voice` when derivatives require a stable reusable voice profile.
- Use `short-video-script` for short-form spoken scripts, visual beats, and retention pacing.
- Use `storyboard-creation` when a derivative requires shot-level visual planning.
- Use `ai-image-prompt-design` or `ai-video-prompting` for approved visual asset prompts.
- Use `ux-writing` for interface or product microcopy derivatives.
- Use `markdown-writer` for final Markdown structure and formatting.
