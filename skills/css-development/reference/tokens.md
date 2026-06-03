# Tokens：CSS Custom Properties（CSS Variables）

## 原則

- 用 custom properties 做「集中管理」：色彩、字級、間距、圓角、陰影。
- 做 semantic tokens（用意義命名），不要直接暴露 raw 色碼到各處。

```css
:root {
  --color-bg: #0f1216;
  --color-surface: rgba(255, 255, 255, 0.06);
  --color-fg: rgba(255, 255, 255, 0.92);
  --color-accent: #f6c177;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --radius-1: 10px;
}

.button {
  background: var(--color-accent);
  border-radius: var(--radius-1);
  padding: var(--space-2) var(--space-3);
}
```

## 注意

- custom properties 會遵循 cascade 並可被繼承。
- `var()` 只能用在 property value；不能用在 selector、property name、media/container query。

參考（MDN）：

- https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
