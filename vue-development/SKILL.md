---
name: vue-development
description: Read when building Vue.js (Vue 3) applications. Provides best practices for SFC structure, Composition API, component design, state management (Pinia), routing (Vue Router), performance, security, TypeScript, testing, and tooling.
always: true
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Vue 開發（Vue Development）

**在使用 Vue（以 Vue 3 + SFC 為主）撰寫前端時請讀取本 skill。**

本 skill 以 Vue 官方文件（含 Vue Router / Pinia）為主要依據，整理偏實務的最佳做法：元件設計、Composition API、狀態/路由、效能、安全、TypeScript、測試與工具鏈。

## 適用範圍（Assumptions）

- Vue 3（優先建議 Composition API + `<script setup>`）
- 使用 Vite / `create-vue` 建專案（或至少有 build step）
- 路由採 Vue Router；全域狀態採 Pinia（Vuex 維護模式，不建議新專案使用）

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
