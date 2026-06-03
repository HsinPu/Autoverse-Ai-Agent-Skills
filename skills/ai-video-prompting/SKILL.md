---
name: ai-video-prompting
description: AI video prompt design guide for crafting prompts for Sora, Veo, Kling, Runway, Pika, Luma, Seedance, Wan, image-to-video, reference-based generation, cinematic shots, camera movement, motion continuity, timing, and negative prompts. Use when improving prompts for AI video quality rather than generating still images.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# AI Video Prompting

Use this skill when the task is to write or improve prompts for AI video generation.

## Workflow

1. Identify the subject, action, setting, duration, aspect ratio, and intended platform.
2. Specify temporal behavior: starting state, motion path, action beats, ending state, and pacing.
3. Add camera language: shot size, angle, lens feel, camera movement, framing, and focus behavior.
4. Add visual direction: lighting, color, texture, era, environment, mood, and production style.
5. Add continuity constraints for characters, wardrobe, products, logos, props, and scene geography.
6. Add negative constraints only when they reduce common artifacts or model-specific failure modes.

## Prompt Shape

```text
Subject and action over time, setting, camera/framing, motion and pacing, lighting/style, continuity constraints, output constraints
```

## Rules

- Describe motion explicitly; still-image prompt language is not enough for video.
- Keep one clear action per short clip unless the model supports multi-shot prompting well.
- Avoid contradictory camera moves, impossible physics, or too many simultaneous actions.
- Prefer concrete shot vocabulary over vague cinematic adjectives.
- Preserve the user's creative intent; improve clarity rather than changing the concept.

## Handoff

- For still-image prompts, use `ai-image-prompt-design`.
- For selecting models or running a generation workflow, use `ai-video-generation`.
- For multi-shot planning, use `storyboard-creation`.
