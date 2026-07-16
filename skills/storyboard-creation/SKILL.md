---
name: storyboard-creation
description: Storyboard and shot-list workflow for turning video ideas, scripts, product concepts, ads, tutorials, or explainers into scenes, shots, timing, dialogue, visual prompts, camera notes, and production-ready tables for AI video, filming, or animation. Use when planning video structure before generation or editing.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/Autoverse-Ai-Agent-Skills"
---

# Storyboard Creation

Use this skill when the task is to plan a video as shots or scenes.

## Workflow

1. Define the video goal, audience, duration, format, platform, and primary message; when part of a larger production, load the approved treatment, script, and continuity baseline first.
2. Break the story into opening hook, setup, development, proof, payoff, and call to action when applicable.
3. Convert each beat into stable scene and shot IDs with duration, start state, visible action, camera note, end state, dialogue or voiceover, and required assets or dependencies.
4. Track continuity for characters, products, locations, props, screen states, narrative logic, and any shot that changes the established baseline.
5. Add AI generation prompts or production notes only after the shot order is stable.
6. Review the board for pacing, clarity, missing transitions, feasibility, and total runtime.

## Output Shape

Use a table unless the user requests another format.

```text
Shot ID | Scene | Duration | Start State | Visual/Action | Camera/Motion | End State | Audio/Dialogue | Assets/Dependencies | Continuity Flag | Notes
```

## Rules

- Keep each shot focused on one visible idea or action.
- Make timing add up to the requested duration.
- Keep shot IDs stable across revisions and mark inserted or superseded shots without silently renumbering downstream references.
- Make dependencies and continuity risks explicit so generation, filming, and editing can verify the correct inputs.
- Use specific visual language that can be handed to AI video, AI image, Remotion, or a human editor.
- Do not over-script dialogue when the user only needs a visual board.

## Handoff

- For an end-to-end project, use `video-production-workflow`; submit the approved board and shot plan as versioned `storyboard.md` and `shot-list.md` artifacts before asset production begins.
- For vlog story arcs, B-roll planning, and creator-style video packaging, use `vlog-production`.
- For AI video prompt wording, use `ai-video-prompting`.
- For short-form hooks and scripts, use `short-video-script`.
- For code-generated execution, use `remotion-video-toolkit`.
