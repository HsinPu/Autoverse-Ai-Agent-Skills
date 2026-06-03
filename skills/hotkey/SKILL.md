---
name: hotkey
description: Keyboard shortcut guidance for web and React UI work, covering hotkey design, keybinding registration, shortcut conflict resolution, and discoverability. Use when implementing or reviewing keyboard shortcuts, command bindings, or keyboard-driven actions in an application.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Hotkey

Use this skill when the work is about keyboard shortcuts.

## Workflow

1. Map the action set to a small, memorable shortcut set.
2. Check conflicts with browser, OS, and app shortcuts.
3. Keep trigger keys consistent across related screens.
4. Expose shortcuts in help text, menus, or command palettes.
5. Verify keyboard-only users can complete the flow.

## Rules

- Prefer common modifier patterns before exotic combos.
- Do not hide critical actions behind shortcuts only.
- Keep shortcuts consistent between desktop views.
- Respect accessibility and focus order.

## Handoff

- For keyboard navigation and focus, use `accessibility`.
- For UI state behavior, use `react-ui-patterns`.
