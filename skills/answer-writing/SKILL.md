---
name: answer-writing
description: Final-response writing guide for producing clear, actionable user-facing answers with concise structure and strong readability. Use when preparing the final reply to the user, especially when the answer should be polished, direct, and easy to act on.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/Autoverse-Ai-Agent-Skills"
---

# Answer Writing

Use this skill when the user-facing answer needs to be clear, trustworthy, and easy to act on.

## Workflow

1. Identify the user's actual question, requested output, and newest instruction.
2. Put the most useful answer first; keep background secondary.
3. Match structure to the task: short prose for simple answers, bullets or sections for multi-part results.
4. Name uncertainty, missing verification, or failed commands plainly.
5. Include file paths, commands, links, or next actions only when they help the user move.

## Rules

- Do not over-explain routine work.
- Do not claim success without evidence.
- Prefer concrete nouns and verbs over generic reassurance.
- Keep summaries concise after code changes: what changed, what passed, and what remains.
- Avoid ending with a vague "if you want" offer; suggest a specific follow-up only when it naturally builds on the task.

## Handoff

- For clarification before implementation, use `ask-questions-if-underspecified`.
- For technical docs or README content, use `markdown-writer` or `git-readme-writer`.
- For UX copy inside an interface, use `ux-writing`.
