---
name: browser-automation
description: Browser automation workflow for navigating websites, filling forms, clicking elements, taking screenshots, extracting data from JavaScript-rendered pages, and automating repeatable web interactions. Use when a task needs a real browser rather than static HTTP scraping or local web app verification.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/Autoverse-Ai-Agent-Skills"
---

# Browser Automation

Use this skill when the task requires interacting with a real browser.

## Workflow

1. Clarify the target site, authenticated state, desired outcome, and whether data will be extracted or changed.
2. Prefer an official API, feed, or export before automating UI interactions.
3. Choose a browser path such as Playwright, CDP, MCP browser tools, or an agent-browser CLI based on the available environment.
4. Use stable selectors, explicit waits, screenshots, and captured console/network evidence.
5. Save reproducible steps, artifacts, and extracted data so the workflow can be rerun or audited.

## Rules

- Respect site terms, robots guidance, rate limits, and authentication boundaries.
- Do not bypass captchas, paywalls, MFA, or access controls.
- Keep browser sessions scoped; avoid leaking cookies, tokens, or profile data.
- Prefer visible, accessibility-oriented selectors before brittle CSS paths.
- Add retry logic only around known transient states, not broken assumptions.

## Handoff

- For static or lightly dynamic HTML extraction, use `python-web-scraping`.
- For local app verification and UI debugging, use `webapp-testing`.
- For durable test suites and CI E2E coverage, use `e2e-testing-patterns`.
