---
name: storyboard-creation
description: Storyboard and shot-list workflow for turning video ideas, scripts, product concepts, ads, tutorials, or explainers into scenes, shots, timing, dialogue, visual prompts, camera notes, and production-ready tables for AI video, filming, or animation. Use when planning video structure before generation or editing.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Storyboard Creation

Use this skill when the task is to plan a video as shots or scenes.

## Workflow

1. Define the video goal, audience, duration, format, platform, and primary message.
2. Break the story into opening hook, setup, development, proof, payoff, and call to action when applicable.
3. Convert each beat into shots with duration, visual description, camera note, dialogue or voiceover, and required assets.
4. Track continuity for characters, products, locations, props, screen states, and narrative logic.
5. Add AI generation prompts or production notes only after the shot order is stable.
6. Review the board for pacing, clarity, missing transitions, feasibility, and total runtime.

## Output Shape

Use a table unless the user requests another format.

```text
Shot | Duration | Visual | Camera/Motion | Audio/Dialogue | Assets | Notes
```

## Rules

- Keep each shot focused on one visible idea or action.
- Make timing add up to the requested duration.
- Use specific visual language that can be handed to AI video, AI image, Remotion, or a human editor.
- Do not over-script dialogue when the user only needs a visual board.

## Handoff

- For AI video prompt wording, use `ai-video-prompting`.
- For short-form hooks and scripts, use `short-video-script`.
- For code-generated execution, use `remotion-video-toolkit`.
