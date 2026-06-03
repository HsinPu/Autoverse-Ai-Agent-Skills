---
name: image-utils
description: Deterministic image post-processing workflow for resizing, cropping, compositing, converting formats, optimizing assets, adding watermarks, and preparing generated images for web or documentation. Use when modifying existing image files with predictable pixel-level operations rather than generating new images.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Image Utils

Use this skill when the task is to post-process an existing image file.

## Workflow

1. Identify the source image, target dimensions, format, compression, and destination.
2. Choose the smallest deterministic operation: resize, crop, convert, composite, watermark, or optimize.
3. Preserve the original file and write the result to a new path.
4. Verify dimensions, file size, transparency, color mode, and visual quality.

## Rules

- Do not use generative editing when deterministic image operations are enough.
- Keep aspect ratio, transparency, and compression constraints explicit.
- Prefer batch-safe operations for repeated asset preparation.
- Preserve originals unless the user explicitly requests overwrite.

## Handoff

- For generating new images, use `baoyu-image-gen`.
- For image prompt design, use `ai-image-prompt-design`.
- For command execution evidence, use `terminal-ops`.
