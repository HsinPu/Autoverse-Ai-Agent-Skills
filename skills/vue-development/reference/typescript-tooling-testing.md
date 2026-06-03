# TypeScript / Tooling / Testing

## TypeScript

- 新專案優先 TypeScript；用 `create-vue` 建立 Vite + TS 專案。
- 開發期依賴 IDE（Vue - Official / Volar）；CLI 型別檢查用 `vue-tsc`（Vue 官方建議）。
- Options API 若要更完整檢查 `this`，需開 `strict`（或至少 `noImplicitThis`）。

## Tooling

- 優先使用 build step（Vite）：可 tree-shake、模板預編譯、bundle 分割。
- Lint/format：`eslint-plugin-vue` + Prettier（依專案）；避免規則衝突。
- 依賴升級注意 Vue / Router / Pinia 版本相容。

## Testing（官方建議取向）

- Unit：Vitest（Vite 專案整合成本最低）；可搭配 `@vue/test-utils`。
- Component（偏整合）：Cypress Component Testing（需要真實樣式/原生 DOM 行為時）。
- E2E：Playwright 或 Cypress；避免把所有測試都壓在 E2E（慢且昂貴）。
- 測試 composables：若依賴 lifecycle/provide-inject，需要 host component 包一層再測。
