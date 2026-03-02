# Design Tokens / Theme Variables

## 用 `@theme` 管理 tokens

- v4 推薦用 `@theme` 定義 theme variables（design tokens），例如 `--color-*`, `--spacing-*`, `--breakpoint-*`。
- `@theme` 不等同於 `:root`：它除了定義 CSS variables，也會影響 "哪些 utilities/variants 存在"。

## 規劃策略

- 先定義最小集合（brand colors、spacing 基準、字體家族、陰影/圓角），再逐步擴充。
- 儘量讓 token 命名表達設計語意（例如 `--color-brand-500`），避免把 UI 狀態寫死在 token 名（例如 `--color-button-primary-hover` 會過早綁死用途）。

## Overriding / Extending

- 擴充：新增 `--color-mint-500` 之類即可得到 `bg-mint-500` 等 utilities。
- 覆寫預設：重新定義 `--breakpoint-sm` 等值即可改變對應 variants。
- 需要完全自訂時可用 `--*: initial` 清空預設，再建立自己的 tokens（此時預設 palette/type scale utilities 會消失）。

## 與 JS / inline styles 協作

- 動態值（來自 API/DB）不要硬塞成動態 class；用 inline style 設 CSS variable，再用 utility 引用：
  - `style={{ '--bg': color }}` + `class="bg-(--bg)"`
