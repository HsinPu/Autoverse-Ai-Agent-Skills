---
name: ai-image-prompt-design
description: AI image prompt design guide for expanding visual ideas into detailed prompts for Flux, Stable Diffusion, Midjourney, DALL-E, and similar image generation models. Use when crafting or improving image prompts, visual concepts, art direction, style references, composition, lighting, camera language, negative prompts, or prompt variants.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# AI Image Prompt Design

## Workflow

1. Identify the subject, action, setting, mood, style, composition, and output format.
2. Add visual specifics: material, color palette, lighting, camera angle, lens, texture, era, and environment.
3. Keep prompt parts coherent; remove details that fight each other.
4. Add model-specific syntax only when the target model is known.
5. Provide variants when the user is exploring rather than executing one exact prompt.

## Prompt Shape

```text
Subject + action, environment, visual style, composition, lighting, color palette, texture/material, camera or rendering language, quality constraints
```

## Rules

- Ask for missing essentials only when they change the image materially.
- Use concrete nouns and sensory details over abstract adjectives.
- Avoid piling on artist names when a style description is clearer.
- Include negative prompts for Stable Diffusion-style workflows when useful.
- Preserve user intent; enhance clarity rather than changing the concept.

## Output

- Return the final prompt in English unless the user asks otherwise.
- Optionally include `negative prompt`, `aspect ratio`, and `variant` sections.
- Explain only the most important prompt choices.
