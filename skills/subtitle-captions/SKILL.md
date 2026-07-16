---
name: subtitle-captions
description: Subtitle and caption workflow for generating, aligning, converting, proofreading, and burning SRT, VTT, ASS, or timed captions into audio/video content. Use when adding subtitles to videos, creating captions from transcripts, syncing text to speech, or preparing accessible media.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/Autoverse-Ai-Agent-Skills"
---

# Subtitle Captions

Use this skill when the task is to create or fix timed captions.

## Workflow

1. Confirm the target platform, subtitle format, language, and whether captions are soft or burned in.
2. Start from an existing transcript, speech-to-text output, or user-provided script.
3. Align captions to audio with readable line lengths, natural breaks, and sensible durations.
4. Convert between SRT, VTT, ASS, JSON, or platform-specific formats when needed.
5. Verify sync, spelling, speaker labels, accessibility cues, and final playback behavior.

## Rules

- Optimize for readability, not just word-level timing.
- Keep captions short enough for the viewing context and screen size.
- Preserve meaning during cleanup; do not rewrite dialogue into a different script unless asked.
- Use burned-in captions only when the target platform or design requires them.

## Handoff

- For first-pass speech-to-text, use `audio-transcription`.
- For voiceover generation from scripts, use `text-to-speech`.
- For burning captions into video or exporting clips, use `video-edit`.
