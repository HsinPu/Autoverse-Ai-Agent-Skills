---
name: ai-image-prompts-skill
description: AI image prompt library and inspiration workflow for finding, adapting, and improving text-to-image prompts across models such as Midjourney, DALL-E, Flux, Stable Diffusion, GPT Image, and similar generators. Use when the user needs prompt ideas, reusable prompt patterns, style variants, or higher-quality image-generation wording.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# AI Image Prompts Skill

Use this skill when the task is to improve or discover image-generation prompts.

## Workflow

1. Identify the image intent, subject, medium, style, camera language, and mood.
2. Pick one or more prompt patterns that match the desired output.
3. Adapt the pattern to the user's constraints instead of copying it blindly.
4. Produce concise variants for exploration, refinement, or A/B comparison.

## Rules

- Prefer reusable prompt structures over one-off decorative wording.
- Keep model-specific syntax separate from general visual direction.
- Include negative prompts only when the generator supports them or they are useful.
- Avoid prompt bloat; each phrase should affect the visible result.

## Handoff

- For visual prompt design from scratch, use `ai-image-prompt-design`.
- For direct image generation, use `baoyu-image-gen`.
- For Stable Diffusion-specific parameters, use `stable-diffusion-image-generation`.
