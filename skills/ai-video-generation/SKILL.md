---
name: ai-video-generation
description: AI video generation workflow for text-to-video, image-to-video, reference-driven clips, model selection, prompt iteration, parameters, and output review across tools such as Sora, Veo, Kling, Runway, Pika, Luma, Seedance, Wan, and similar generators. Use when creating new AI-generated video rather than editing existing footage or building deterministic Remotion templates.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# AI Video Generation

Use this skill when the task is to create a new video with a generative video model.

## Workflow

1. Define the target platform, aspect ratio, duration, style, audience, and success criteria.
2. Choose the generation mode: text-to-video, image-to-video, first/last frame, reference character, avatar, or multi-shot sequence.
3. Select the model or provider based on motion quality, character consistency, cost, rights, latency, and available inputs.
4. Write a prompt with subject, action, setting, camera movement, motion pace, lighting, style, and constraints.
5. Generate short tests before long clips; compare motion, continuity, artifacts, and brand fit.
6. Export the best result and document seed, model, settings, prompts, and source assets for reproducibility.

## Rules

- Keep model-specific syntax out unless the target tool is known.
- Use reference images only when the user has rights to use the subject, likeness, product, or artwork.
- Prefer multiple short clips over one long generation when continuity and edit control matter.
- Check hands, faces, logos, text, product details, physics, and temporal flicker before accepting output.
- Do not use this skill for trimming, compression, or subtitles; use the relevant media editing skill instead.

## Handoff

- For detailed video prompts, use `ai-video-prompting`.
- For shot plans and continuity, use `storyboard-creation`.
- For editing finished clips, use `video-edit`.
- For deterministic code-generated video, use `remotion-video-toolkit`.
