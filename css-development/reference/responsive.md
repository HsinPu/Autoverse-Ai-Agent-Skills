# Responsive：Media queries 與 Container queries

## 選擇

- **Media queries**：跟 viewport/裝置特性相關（整頁布局、導航型態切換）。
- **Container queries**：跟元件容器大小相關（可重用 component 的 responsive）。

## Media queries（重點）

- 建議用「內容驅動」的 breakpoint，而不是硬背裝置寬度。
- 記得 `prefers-reduced-motion`（少動畫）。

參考（MDN）：

- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries

## Container queries（重點）

- 先宣告 container（`container-type` 或 `container` shorthand），才能 `@container`。

```css
.sidebar {
  container: sidebar / inline-size;
}

@container sidebar (width > 700px) {
  .card h2 { font-size: 2rem; }
}
```

參考（MDN）：

- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries
