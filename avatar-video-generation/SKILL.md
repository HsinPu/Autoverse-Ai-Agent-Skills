---
name: avatar-video-generation
description: AI avatar, digital human, talking-head, and lip-sync video workflow for tools such as HeyGen, Synthesia, D-ID, EachLabs, DashScope human avatar, and similar services, covering avatar choice, script preparation, voice rights, pronunciation, lip-sync review, consent, and export QA. Use when generating presenter, spokesperson, or avatar videos.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Avatar Video Generation

Use this skill when the task is to create a talking-head, digital human, or lip-sync video.

## Workflow

1. Confirm the use case, audience, language, platform, duration, and whether the avatar represents a real person.
2. Verify rights and consent for any likeness, voice, face image, brand, or celebrity-like reference.
3. Prepare the script with segment breaks, pronunciation notes, emotion, pauses, and gesture expectations.
4. Choose avatar, voice, background, framing, captions, and brand styling based on the target context.
5. Generate a short sample before the full video when voice, lip sync, or persona quality matters.
6. Review mouth sync, eye movement, pronunciation, pacing, expression, hands, captions, and export settings.

## Rules

- Do not clone or imply a real person's likeness or voice without explicit rights and consent.
- Keep scripts conversational and segment long content to simplify retries.
- Avoid overpromising emotion or gesture control unless the selected tool supports it.
- Flag uncanny, misleading, or disclosure-sensitive use cases before production.
- Preserve brand names, product terms, and pronunciation guidance exactly.

## Handoff

- For script drafting, use `short-video-script` or `ugc-video-ads`.
- For voiceover-only work, use `text-to-speech`.
- For subtitles, use `subtitle-captions`.
- For post-processing and export edits, use `video-edit`.
