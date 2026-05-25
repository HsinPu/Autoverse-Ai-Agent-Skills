---
name: video-edit
description: Local video editing workflow for trimming, concatenating, resizing, compressing, converting, extracting audio, and inspecting media files with tools such as ffmpeg. Use when editing existing videos or preparing clips for sharing, social platforms, documentation, or downstream video generation.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Video Edit

Use this skill when the task is to modify an existing video file.

## Workflow

1. Identify the source file, target output, required format, and quality constraints.
2. Decide whether the edit is trim, concat, resize, crop, compress, convert, overlay, or audio extraction.
3. Preserve the original file and write the result to a new output path.
4. Verify duration, resolution, codec, audio track, and file size after export.

## Rules

- Prefer lossless or stream-copy operations when only cutting or remuxing.
- Re-encode only when changing codec, resolution, speed, overlays, or filters.
- Keep platform constraints explicit, such as aspect ratio, max file size, and duration.
- Do not use this skill for generating new animated videos from code; use `remotion-video-toolkit`.

## Handoff

- For vlog edit structure, B-roll planning, titles, thumbnails, and platform packaging, use `vlog-production`.
- For programmatic video generation, use `remotion-video-toolkit`.
- For summarizing or transcribing video content, use `summary-ops`.
- For command execution and evidence, use `terminal-ops`.
