---
name: text-to-speech
description: Text-to-speech and voiceover workflow for turning scripts, UI copy, accessibility reads, narration, and batch prompts into spoken audio. Use when the user asks to generate speech, create voiceover, read text aloud, choose voices, or prepare narration for video and product content.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/Autoverse-Ai-Agent-Skills"
---

# Text To Speech

Use this skill when the task is to create spoken audio from text.

## Workflow

1. Confirm the target use: narration, accessibility read, prompt audio, demo voiceover, or batch generation.
2. Prepare the script with pronunciation notes, pauses, tone, and segment boundaries.
3. Choose a provider or local engine based on quality, privacy, latency, cost, and language needs.
4. Generate short samples before long-form output when voice, pacing, or emotion matters.
5. Verify file format, duration, loudness, pronunciation, and downstream sync requirements.

## Rules

- Keep scripts clean; remove markdown, citations, and UI-only annotations before synthesis.
- Split long narration into named segments so failed generations are easy to retry.
- Do not promise custom voice cloning unless the chosen tool explicitly supports it and the user has rights to the reference voice.
- Preserve user-provided pronunciation, brand names, and language choices exactly.

## Handoff

- For transcribing existing recordings, use `audio-transcription`.
- For captions and subtitle timing, use `subtitle-captions`.
- For assembling voiceover into video, use `remotion-video-toolkit` or `video-edit`.
