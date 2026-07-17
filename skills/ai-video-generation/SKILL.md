---
name: ai-video-generation
description: AI video generation workflow for text-to-video, image-to-video, reference-driven clips, model selection, prompt iteration, parameters, and output review across tools such as Sora, Veo, Kling, Runway, Pika, Luma, Seedance, Wan, and similar generators. Use when creating new AI-generated video rather than editing existing footage or building deterministic Remotion templates.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# AI Video Generation

Use this skill when the task is to create a new video with a generative video model.

## Workflow

1. Define the target platform, aspect ratio, duration, style, audience, and success criteria; for a larger production, verify the approved shot, continuity baseline, rights, and source assets first.
2. Choose the generation mode: text-to-video, image-to-video, first/last frame, reference character, avatar, or multi-shot sequence.
3. Select the model or provider based on motion quality, character consistency, cost, rights, privacy, latency, and available inputs.
4. Before a consequential call, announce the provider, model or variant, expected cost, submitted data, rights implications, and whether it is a sample or batch; obtain any required approval.
5. Write or load a shot-bound prompt with subject, action, setting, camera movement, motion pace, lighting, style, references, and constraints.
6. Generate a small representative sample before a paid or large batch; compare motion, continuity, artifacts, and brand fit.
7. Export accepted results and return manifest-ready metadata with shot ID, asset ID, version, provider, model, settings, prompt, seed when available, source assets, rights status, cost, and review result to the asset-manifest owner; update the canonical manifest only when assigned its exclusive write ownership.

## Rules

- Keep model-specific syntax out unless the target tool is known.
- Use reference images only when the user has rights to use the subject, likeness, product, or artwork.
- Require explicit approval before paid batch work, identifiable likeness or voice use, or a provider substitution that changes cost, rights, privacy, quality, or timing.
- Prefer multiple short clips over one long generation when continuity and edit control matter.
- Check hands, faces, logos, text, product details, physics, and temporal flicker before accepting output.
- Do not use this skill for trimming, compression, or subtitles; use the relevant media editing skill instead.

## Handoff

- For treatment-to-delivery coordination, use `video-production-workflow` and treat generated clips as versioned assets rather than final approval by default.
- For detailed video prompts, use `ai-video-prompting`.
- For shot plans and continuity, use `storyboard-creation`.
- For editing finished clips, use `video-edit`.
- For deterministic code-generated video, use `remotion-video-toolkit`.
