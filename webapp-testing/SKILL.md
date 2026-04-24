---
name: webapp-testing
description: Local web application testing workflow with Playwright for verifying frontend behavior, debugging UI, capturing screenshots, and checking browser logs. Use when a local web app needs end-to-end validation or UI troubleshooting.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Webapp Testing

Use this skill for local browser-based verification.

## Workflow

1. Start the app or helper server in a controlled way.
2. Prefer network-idle and DOM inspection for dynamic pages.
3. Verify the visible behavior, console output, and screenshots.
4. Use the smallest Playwright flow that proves the bug or fix.
5. Capture artifacts when something fails.

## Rules

- Treat server lifecycle as part of the test.
- Use screenshots and logs to prove behavior.
- Do not assume static HTML on dynamic apps.
- Keep selectors and interactions explicit.

## Handoff

- For frontend build and styling work, use `frontend-design`.
- For React UI state patterns, use `react-ui-patterns`.
