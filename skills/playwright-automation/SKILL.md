---
name: playwright-automation
description: Playwright automation workflow for browser navigation, locators, screenshots, traces, console and network inspection, scripted interactions, MCP or CLI-driven browser control, and repeatable UI diagnostics. Use when the task specifically needs Playwright rather than general browser automation or E2E test strategy.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/Autoverse-Ai-Agent-Skills"
---

# Playwright Automation

Use this skill when Playwright is the browser automation tool for the task.

## Workflow

1. Identify whether the goal is inspection, interaction, extraction, screenshot capture, regression proof, or a reusable script.
2. Confirm the execution path: Playwright test runner, one-off script, Playwright MCP, `playwright` CLI, or an existing project setup.
3. Launch the app or browser with controlled state, viewport, locale, storage, and authentication assumptions.
4. Interact through resilient locators such as role, label, text, test id, or stable semantic selectors.
5. Capture evidence with screenshots, traces, console logs, network failures, and final assertions.

## Rules

- Prefer `getByRole`, `getByLabel`, `getByText`, and test ids before brittle CSS or XPath selectors.
- Wait for explicit UI, URL, response, or locator state instead of arbitrary sleeps.
- Keep one-off diagnostic scripts small and disposable unless the user asks for a maintained test.
- Preserve traces and screenshots for failures that are hard to explain in text.
- Avoid storing secrets, cookies, tokens, or profile data in committed files.

## Handoff

- For general browser workflow decisions, use `browser-automation`.
- For local app verification without a maintained suite, use `webapp-testing`.
- For durable Playwright or Cypress E2E suites, use `e2e-testing-patterns`.
