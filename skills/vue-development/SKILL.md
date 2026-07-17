---
name: vue-development
description: Vue 3 development guide covering SFC structure, Composition API, component design, Pinia state management, Vue Router, TypeScript, testing, performance, and security. Use when building, reviewing, or refactoring Vue applications.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Vue 開發（Vue Development）

**在使用 Vue（以 Vue 3 + SFC 為主）撰寫前端時請讀取本 skill。**

本 skill 以 Vue 官方文件（含 Vue Router / Pinia）為主要依據，整理偏實務的最佳做法：元件設計、Composition API、狀態/路由、效能、安全、TypeScript、測試與工具鏈。

## 適用範圍（Assumptions）

- Vue 3（優先建議 Composition API + `<script setup>`）
- 使用 Vite / `create-vue` 建專案（或至少有 build step）
- 路由採 Vue Router；全域狀態採 Pinia（Vuex 維護模式，不建議新專案使用）

## When To Use

Use this skill when the task is about Vue 3 application or component code rather than Nuxt-specific app behavior.

- Build, review, or refactor Vue SFCs, Composition API logic, composables, props/emits/slots, Pinia stores, or Vue Router usage.
- Improve Vue component structure, TypeScript usage, performance, security, or testability.
- Diagnose Vue application behavior when the issue is not primarily Nuxt SSR/Nitro/runtime config.

## Workflow

1. Identify the component, composable, store, route, or test surface being changed.
2. Trace props, emits, slots, v-model, reactivity, computed/watch effects, and store/router interactions.
3. Keep state ownership explicit and move reusable logic into composables only when it removes real duplication.
4. Validate TypeScript, Vue template behavior, accessibility states, and relevant unit/component/E2E tests.
5. Use bundled references selectively based on whether the task is style, components, state/routing, performance, security, or testing.

## Handoff

- Use `nuxt-development` for Nuxt pages, layouts, server routes, runtime config, SSR/route rules, or Nitro.
- Use `vue-composition-api` for detailed Composition API and `<script setup>` mechanics.
- Use `pinia-state-management` for store architecture, SSR hydration, and Pinia testing.
- Use `vue-router-patterns` for route records, guards, params/query, and navigation lifecycle.
- Use `vue-testing` when the main task is writing or improving Vue tests.
- Use `vue-debug-guides` for runtime warnings, hydration mismatches, and reactivity debugging.

## 進階與參考（Bundled resources）

- **Code Style / SFC 結構**：命名、目錄結構、SFC 分層、Style Guide 取捨，見 [reference/code-style.md](reference/code-style.md)。
- **Components / Composables**：Props/Emits/Slots、v-model、composables 抽離、避免反模式，見 [reference/components-and-composables.md](reference/components-and-composables.md)。
- **State / Routing**：何時用 Pinia、SSR 注意、路由切分與 lazy loading，見 [reference/state-and-routing.md](reference/state-and-routing.md)。
- **Performance**：穩定 props、`v-memo`/`v-once`、virtualize、大型資料的 reactivity 成本，見 [reference/performance.md](reference/performance.md)。
- **Security**：不要用不可信 template、`v-html`/URL/style 注入風險、SSR 安全，見 [reference/security.md](reference/security.md)。
- **TypeScript / Tooling / Testing**：`vue-tsc`、lint/format、Vitest/VTU、E2E，見 [reference/typescript-tooling-testing.md](reference/typescript-tooling-testing.md)。

---

## 外部參考（官方）

- Vue Docs（Guide）：`https://vuejs.org/guide/introduction.html`
- Vue Best Practices - Performance：`https://vuejs.org/guide/best-practices/performance.html`
- Vue Best Practices - Security：`https://vuejs.org/guide/best-practices/security.html`
- Vue TypeScript：`https://vuejs.org/guide/typescript/overview.html`
- Vue Testing：`https://vuejs.org/guide/scaling-up/testing.html`
- Vue State Management：`https://vuejs.org/guide/scaling-up/state-management.html`
- Vue Routing：`https://vuejs.org/guide/scaling-up/routing.html`
- Vue Style Guide：`https://vuejs.org/style-guide/`

- Vue Router Docs：`https://router.vuejs.org/guide/`
- Vue Router - Lazy Loading Routes：`https://router.vuejs.org/guide/advanced/lazy-loading.html`

- Pinia Core Concepts：`https://pinia.vuejs.org/core-concepts/`
- Pinia SSR：`https://pinia.vuejs.org/ssr/`
