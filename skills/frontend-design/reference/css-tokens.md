# CSS Tokens（CSS Variables）

## 目標

- 讓顏色/字級/間距/圓角/陰影「集中管理」且一致。
- 支援主題變化（light/dark 或品牌色變化）時，不需要全域搜尋取代。

## 建議 tokens 分層

1. **Base（原子）**：純色票、字體、間距尺度
2. **Semantic（語意）**：`--color-bg`、`--color-fg`、`--color-accent`、`--color-danger`
3. **Component（可選）**：對特定元件的 override（只有在必要時）

```css
:root {
  /* Base */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --radius-1: 8px;
  --radius-2: 14px;

  /* Semantic */
  --color-bg: #0f1216;
  --color-surface: rgba(255, 255, 255, 0.06);
  --color-fg: rgba(255, 255, 255, 0.92);
  --color-muted: rgba(255, 255, 255, 0.68);
  --color-accent: #f6c177;
  --shadow-1: 0 10px 30px rgba(0,0,0,0.35);
}
```

## 實務規則

- 在 component CSS 裡，盡量只引用 semantic tokens（避免散落色碼）。
- spacing 用 `--space-*` 統一尺度，避免 13px/19px 這種隨機值。
- 如果要做背景紋理/雜訊，讓它成為 token 或單一 utility，避免每個區塊都自帶一套。
