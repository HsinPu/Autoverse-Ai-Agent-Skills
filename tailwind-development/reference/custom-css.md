# Custom CSS / Directives

## 何時寫自訂 CSS

- 你不控制的 HTML（Markdown/第三方 UI）需要一致樣式
- 需要覆蓋第三方 library 的 selectors
- 抽元件不合理（例如模板系統下很小的重用）

## `@layer` 使用準則

- `@layer base`：設定預設元素樣式（例如 headings / links），用 token 值維持一致。
- `@layer components`：少量語意 class（例如 `.btn-primary`），要能被 utilities 覆蓋。
- `@layer utilities`：用 `@utility` 新增小型 utility（可搭配 variants）。

## `@apply`

- 用於：第三方樣式覆蓋、或把一組 utilities 放進自訂 selector。
- 不要把 `@apply` 當成把 Tailwind "改回傳統 CSS" 的預設做法；跨元件重用更推薦抽 component。

## `@reference`（SFC / CSS Modules）

- 在 Vue/Svelte `<style>` 或 CSS modules 中要用 `@apply`/`@variant` 時，用 `@reference` 引入主樣式（避免重複輸出 CSS）。

## 自訂 variants

- 用 `@custom-variant` 做專案級變體（例如 data-theme、data-state、feature flags）。
