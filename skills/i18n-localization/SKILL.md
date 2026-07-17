---
name: i18n-localization
description: Internationalization and localization workflow for adding translations, managing locale files, handling pluralization, RTL support, and keeping localized UI text consistent across products. Use when implementing or reviewing i18n keys, locale management, translated strings, or localization updates in apps and extensions.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# I18n Localization

Use this skill when the task is to add or maintain localized text.

## Workflow

1. Identify supported locales, fallback behavior, and the source of truth for strings.
2. Extract hardcoded user-facing text into stable keys.
3. Keep translation keys descriptive, consistent, and reusable.
4. Check plural forms, interpolation, date/number formatting, and RTL behavior where relevant.
5. Verify missing keys, duplicated strings, and locale drift before shipping.

## Rules

- Keep keys stable once shipped.
- Do not mix translation content with layout logic.
- Avoid hardcoding locale-specific text in components when a locale file exists.
- Preserve product terminology and brand terms consistently across locales.

## Handoff

- For React app implementation, use `react-ui-patterns` or `frontend-design`.
- For desktop Electron apps, use `desktop-development`.
- For message copy quality, use `ux-writing`.
