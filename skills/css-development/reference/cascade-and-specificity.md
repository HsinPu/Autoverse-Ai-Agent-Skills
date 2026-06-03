# Cascade 與 Specificity（可維護的覆寫策略）

## 原則

- **先解決 cascade，再談 specificity**：同一 origin/importance/layer 才會比 specificity。
- 讓你的 CSS「可被覆寫」：保持 selector weight 低，避免用 ID selector 與深層巢狀。

## Specificity 快速心法

- selector weight 可以視為 `ID-CLASS-TYPE` 三欄；左欄一旦變大就很難救。
- `:where()` 的 specificity 會被強制變成 `0-0-0`，適合做「可覆寫的限定範圍」。
- `!important` 不應該拿來解 specificity 問題；若不得不用，要加註解說明原因。

參考（MDN）：

- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Cascade/Specificity

## 建議策略：用 layers 管理「誰應該贏」

如果專案規模大、第三方 CSS 多，建議用 `@layer` 把優先順序固定：

```css
@layer reset, base, components, utilities, overrides;

@layer base {
  :where(h1, h2, h3) { line-height: 1.1; }
}

@layer components {
  .button { border-radius: 12px; }
}

@layer utilities {
  .u-hidden { display: none !important; }
}
```

重點：**layer 的順序比 specificity 更上位**（同 origin/importance 下）。

## 何時可以用 !important

- utility class（例如 `.u-hidden`）
- 需要壓過 inline style 或第三方強硬規則（最好先用 layer/限定範圍處理）

規則：每個 `!important` 都要加註解，說明為什麼需要它。
