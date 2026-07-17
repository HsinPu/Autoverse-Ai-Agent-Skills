---
name: browser-compatibility-testing
description: Cross-browser compatibility testing workflow for validating web behavior across Chrome, Firefox, Safari, Edge, mobile browsers, BrowserStack, Selenium Grid, and Playwright browser projects. Use when diagnosing browser-specific bugs, viewport differences, unsupported APIs, CSS differences, or compatibility release risk.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Browser Compatibility Testing

Use this skill when behavior may differ by browser, engine, device, or viewport.

## Workflow

1. Define the support matrix: browsers, versions, devices, operating systems, and viewports.
2. Identify the critical flows, APIs, CSS features, media behavior, and input methods to verify.
3. Run the smallest browser matrix that covers likely risk before expanding to full coverage.
4. Compare screenshots, console errors, network behavior, feature support, and interaction results.
5. Document browser-specific failures with reproduction steps, environment, evidence, and fallback options.

## Rules

- Do not assume Chromium behavior represents Safari, Firefox, or mobile WebView behavior.
- Check feature support before adding polyfills or browser-specific branches.
- Treat viewport, DPR, font rendering, pointer type, and reduced-motion settings as compatibility inputs.
- Prefer progressive enhancement over brittle browser sniffing.
- Keep compatibility scope tied to product support policy or explicit user requirements.

## Handoff

- For responsive layout strategy, use `responsive-design`.
- For Playwright browser-project setup, use `playwright-automation`.
- For visual diffs across browsers, use `visual-regression-testing`.
