---
name: vite
description: Vite build tool guidance for configuring vite.config.ts, plugins, dev server behavior, SSR, library builds, and migration work. Use when working in Vite projects, tuning build and dev tooling, or fixing Vite configuration and plugin issues.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Vite

Use this skill when the task is about Vite itself.

## Workflow

1. Identify whether the task is about dev server behavior, build output, plugins, SSR, or migration.
2. Check the current `vite.config.ts`, related plugins, and any framework-specific integration.
3. Keep the config minimal and targeted to the actual problem.
4. Verify hot reload, build output, and production behavior together.

## Rules

- Prefer the simplest config change that solves the issue.
- Keep plugin order and environment-specific branches explicit.
- Treat SSR, library mode, and app mode as separate concerns.
- Do not mix Vue app patterns with Vite build-tool concerns unless both are relevant.

## Handoff

- For Vue component or SFC issues, use `vue-development`.
- For Nuxt projects, use `nuxt-development`.
- For TypeScript config or typing issues, use `typescript-development`.
