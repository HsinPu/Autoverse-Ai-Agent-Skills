---
name: drawio-skill
description: Diagram generation workflow for turning text or rough ideas into draw.io diagrams and exportable visual assets. Use when a flowchart, architecture diagram, or visual explanation needs to be created or updated.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Draw.io Skill

Use this skill to create or update diagrams.

## Workflow

1. Identify the diagram type and its audience.
2. Keep nodes, edges, and labels minimal and readable.
3. Preserve the meaning before polishing the layout.
4. Export in the format the user needs.
5. Verify the diagram is legible at the target size.

## Rules

- Prefer simple, explicit structure over decorative complexity.
- Keep labels short.
- Preserve editing flexibility when possible.

## Handoff

- For document-heavy presentation work, use `presentation-ops`.
- For Markdown-to-doc conversion, use `word-document-ops`.
