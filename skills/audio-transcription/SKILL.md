---
name: audio-transcription
description: Speech-to-text workflow for transcribing audio or video files, meetings, interviews, podcasts, voice notes, and multilingual recordings. Use when the user asks to extract spoken text, identify speakers, produce transcripts, translate speech, or prepare recordings for summarization.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Audio Transcription

Use this skill when the task is to convert speech from media into text.

## Workflow

1. Inspect the media source, duration, language, speaker count, and expected output format.
2. Choose local or API transcription based on privacy, cost, speed, diarization, and language quality.
3. Extract or normalize audio when the input is a video or unsupported container.
4. Transcribe with timestamps when the result will feed subtitles, clips, or review workflows.
5. Review uncertain segments, speaker labels, terminology, and timestamps before delivery.

## Rules

- Prefer preserving timestamps for any transcript that may later become captions or searchable notes.
- Mark inaudible, overlapped, or uncertain speech instead of inventing words.
- Keep raw transcript, cleaned transcript, and summary as separate artifacts when possible.
- Do not use cloud transcription for sensitive recordings unless the user has approved that path.

## Handoff

- For concise summaries after transcription, use `summary-ops`.
- For SRT, VTT, ASS, or caption timing, use `subtitle-captions`.
- For local video audio extraction, use `video-edit`.
