---
name: audio-generation
description: AI audio generation workflow for creating music beds, sound effects, ambience, jingles, and text-to-audio assets. Use when the user asks to generate music, sound effects, background audio, sonic branding, or audio assets for video, games, presentations, or product demos.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Audio Generation

Use this skill when the task is to create non-speech audio.

## Workflow

1. Define the audio role: music bed, sound effect, ambience, transition, jingle, or loop.
2. Specify mood, genre, instrumentation, tempo, duration, looping needs, and licensing constraints.
3. Choose a generation model or sound library based on quality, controllability, and rights.
4. Generate short options first, then extend or refine the best direction.
5. Verify loudness, looping seams, file format, and fit against the target media timeline.

## Rules

- Keep speech and voiceover requests in `text-to-speech`; this skill is for non-speech audio.
- Treat licensing and reuse rights as part of the acceptance criteria.
- Avoid overdescribing visual concepts unless they affect the sound.
- Deliver stems or separate files when music, effects, and ambience need independent mixing.

## Handoff

- For spoken narration, use `text-to-speech`.
- For timing audio inside programmatic video, use `remotion-video-toolkit`.
- For trimming, converting, or mixing exported media files, use `video-edit`.
