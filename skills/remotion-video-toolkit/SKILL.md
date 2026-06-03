---
name: remotion-video-toolkit
description: Programmatic video creation guidance for Remotion and React, covering compositions, timing, animation, captions, audio, rendering, and reusable video templates. Use when creating data-driven videos, product demos, animated explainers, or video generation pipelines with Remotion.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Remotion Video Toolkit

Use this skill when the task is to build videos with code.

## Workflow

1. Define the video goal, duration, aspect ratio, and target platform.
2. Break the video into scenes, timing blocks, and reusable compositions.
3. Plan assets for text, images, audio, captions, charts, or screen recordings.
4. Keep animation timing deterministic and easy to preview.
5. Verify the render output, audio sync, captions, and final export format.

## Rules

- Prefer reusable compositions over one-off timelines.
- Keep scene timing explicit; avoid magic frame numbers without names.
- Treat audio, captions, and visual transitions as first-class timeline elements.
- Use data-driven templates when the video will be regenerated with new inputs.
- Do not use Remotion for simple trim/resize/convert tasks; use `video-edit` instead.

## Handoff

- For local video trimming, compression, and conversion, use `video-edit`.
- For React component structure, use `react-ui-patterns` or `frontend-design`.
- For motion quality and interaction timing, use `animation-best-practices`.
