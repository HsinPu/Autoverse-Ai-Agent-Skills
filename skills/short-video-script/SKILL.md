---
name: short-video-script
description: Short-form video script workflow for TikTok, Reels, YouTube Shorts, Douyin, Xiaohongshu, and similar platforms, covering hooks, talking-head scripts, pacing, captions, CTAs, series planning, retention, and platform-specific creative constraints. Use when writing scripts for short social videos rather than long-form articles or generic marketing copy.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Short Video Script

Use this skill when the task is to write a short social video script.

## Workflow

1. Confirm the platform, audience, goal, duration, language, creator voice, and desired action; when part of a larger production, load the approved brief and treatment first and preserve their locked purpose, claims, style boundaries, rights, and exclusions unless a revision is approved.
2. Choose a format: talking head, demo, before/after, list, myth-busting, story, reaction, tutorial, or UGC-style ad.
3. Write a strong first-three-second hook that makes the viewer know why to keep watching.
4. Structure the body around one idea, proof, contrast, or transformation.
5. Add on-screen text, caption beats, visual cues, B-roll notes, and CTA.
6. Tighten for spoken rhythm, retention, platform norms, and total runtime.

## Rules

- One short video should make one main point.
- Use spoken, natural language instead of essay-style paragraphs.
- Keep hooks specific; avoid generic openings like "In this video".
- Do not silently redefine an approved brief or treatment to improve a hook; raise a targeted revision request when the locked direction conflicts with the script.
- Match CTA intensity to the viewer's stage: save, comment, click, buy, follow, or share.
- Provide variants when the user is testing hooks or angles.

## Handoff

- For adapting an approved article, report, or campaign source across several channels before writing the video script, use `content-repurposing`.
- For a complete production with treatment, approvals, shot planning, assets, edit, and delivery, use `video-production-workflow` and save the approved script as its versioned `script.md` artifact.
- For vlog story arcs, filming plans, and platform packaging, use `vlog-production`.
- For UGC ad structure, use `ugc-video-ads`.
- For shot-level planning, use `storyboard-creation`.
- For voiceover generation, use `text-to-speech`.
- For captions, use `subtitle-captions`.
