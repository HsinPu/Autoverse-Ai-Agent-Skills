---
name: chrome-devtools-debugging
description: Chrome DevTools and CDP debugging workflow for inspecting console errors, network requests, runtime performance, DOM state, accessibility trees, storage, and page load behavior through Chrome DevTools, CDP, or Chrome DevTools MCP. Use when diagnosing web page behavior rather than only automating clicks.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Chrome DevTools Debugging

Use this skill when browser evidence is needed to diagnose a web issue.

## Workflow

1. Reproduce the issue in Chrome with the same URL, viewport, auth state, and user flow.
2. Capture console errors, failed requests, status codes, response payload clues, and timing waterfalls.
3. Inspect DOM state, computed styles, storage, cookies, feature flags, and accessibility tree when relevant.
4. Use performance traces for slow startup, long tasks, layout shifts, LCP, and interaction latency.
5. Summarize the finding with evidence, likely root cause, and the smallest next fix or experiment.

## Rules

- Prefer captured browser evidence over guessing from code alone.
- Separate frontend errors, network/API failures, and rendering/performance bottlenecks.
- Preserve screenshots, traces, and console snippets for issues that are hard to explain.
- Do not expose tokens, cookies, or private payloads in shared logs or reports.
- Use Playwright for repeatable interactions; use DevTools/CDP for deeper diagnosis.

## Handoff

- For Playwright-specific scripts and locators, use `playwright-automation`.
- For visual quality review, use `frontend-design-review`.
- For web performance focused React issues, use `react-perf`.
