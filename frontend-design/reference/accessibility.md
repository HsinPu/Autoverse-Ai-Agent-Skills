# A11y（無障礙）實作指南

## 語意化 HTML

- 標題用 `h1`~`h3` 建立層級（不要只用 `div` + 大字）。
- 互動元素用 `button` / `a`；避免 `div` 當按鈕。
- 表單元素搭配 `label`，必要時 `aria-describedby`。

## 鍵盤與焦點

- 對可互動元素提供 `:focus-visible` 樣式（不要移除 outline 卻不替代）。
- Modal/Drawer 要 focus trap、Esc 可關閉、關閉後回到觸發點。

## 色彩與對比

- 正文文字不要過淡；小字尤其要保守。
- 重要狀態（error/success/warn）不要只靠顏色區分，搭配 icon/文字。

## 動畫與 Reduced Motion

- 對 `prefers-reduced-motion: reduce`：
  - 移除大幅位移與 parallax
  - 用淡入淡出或直接無動畫

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

## 可點目標與觸控

- 主要按鈕、列表項目、icon button 的 hit area 要足夠。
- icon-only button 一律加上可讀 label（`aria-label`）。
