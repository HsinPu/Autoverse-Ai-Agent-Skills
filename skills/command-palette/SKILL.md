---
name: command-palette
description: Command palette guidance for designing, implementing, and reviewing quick switchers, fuzzy action launchers, and Spotlight-style menus in web apps. Use when building palettes that search, rank, and execute navigation or commands, or when tuning discoverability, empty states, scope, and keyboard-first interaction.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Command Palette

Use this skill when the work is about a command palette or quick launcher.

## Workflow

1. Define whether the palette is for navigation, commands, or both.
2. Choose the actions, scopes, and search terms it should surface.
3. Keep results short, ranked, and stable.
4. Make the open, search, and execute paths obvious.
5. Verify keyboard, mouse, and empty-state behavior together.

## Rules

- Prefer a small set of high-value actions over exhaustive coverage.
- Keep labels imperative and scannable.
- Show the shortcut or entry point where users can find it.
- Do not use search results as the only route to critical actions.
- Separate command execution from plain text search when the behaviors differ.

## Handoff

- For shortcut design, use `hotkey`.
- For focus and keyboard access, use `accessibility`.
- For async execution states, use `react-ui-patterns`.
- For surrounding navigation or transitions, use `interaction-patterns`.
