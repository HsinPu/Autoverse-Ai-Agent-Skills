# Architecture / 組件化

## 核心思維

- 把 utility class 當成設計系統 API（用 tokens 驅動），而不是把 Tailwind 當成 "很多 class 名稱"。
- 先寫出可工作的 UI，再決定抽象層級：
  - 同檔重複：先用多游標同時改
  - 多處重複：抽元件 / partial（最佳策略）
  - 無法抽元件（例如非 component framework）：用 `@layer components` 定義少量語意化 class

## Managing duplication（重複的處理順序）

- **Loops**：大量重複往往本來就應該由 loop/render function 產生；class list 通常只寫一次。
- **Components/partials**：跨檔重用時，抽出 `Button`, `Card`, `FormField` 等元件，讓結構與樣式綁在一起。
- **Custom CSS**：當抽 partial 太重（例如只是一個 button）可用 `@layer components` 做 `.btn-primary`（仍用 theme variables）。

## Conflicting utilities（避免衝突）

- 同一元素避免同時放兩個互斥 utility（例如 `grid` + `flex`）。
- 若需要條件切換，用程式邏輯選一個（例如 `gridLayout ? 'grid' : 'flex'`）。
- 不要把 "讓使用者加任意 class" 當成唯一的 customization 手段；更可靠的是暴露語意 props（variant/size/intent），再映射到完整 class 名稱。

## Class 組合與可讀性

- 把 class 分成幾個群組（layout / spacing / typography / color / states），必要時用 formatter / lint 規則固定排序。
- 對有多變體的元件，集中管理 variants（例如 `size`, `intent`, `state`），避免在 template 到處散落條件。
