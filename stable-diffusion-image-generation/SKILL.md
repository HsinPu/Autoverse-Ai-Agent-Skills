---
name: stable-diffusion-image-generation
description: Stable Diffusion image generation guidance for text-to-image, image-to-image, inpainting, and custom diffusion pipelines using tools such as HuggingFace Diffusers. Use when working with Stable Diffusion models, local or hosted diffusion workflows, generation parameters, seeds, schedulers, LoRA, or pipeline troubleshooting.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Stable Diffusion Image Generation

Use this skill when the image task is specifically about Stable Diffusion or diffusion pipelines.

## Workflow

1. Identify the task type: text-to-image, image-to-image, inpainting, or pipeline integration.
2. Choose model, scheduler, seed, size, steps, guidance scale, and any LoRA or control inputs.
3. Keep generation parameters reproducible when the user needs iteration or comparison.
4. Diagnose failures by separating prompt issues, model limitations, pipeline setup, and hardware constraints.

## Rules

- Prefer explicit seeds when comparing prompt or parameter changes.
- Do not treat Stable Diffusion defaults as universal; note model-specific assumptions.
- Keep safety, licensing, and model provenance visible for generated assets.
- Avoid overfitting prompt advice when the actual issue is pipeline configuration.

## Handoff

- For general provider-based image generation, use `baoyu-image-gen`.
- For visual prompt design, use `ai-image-prompt-design`.
- For post-processing generated images, use `image-utils`.
