# Preflight

## Preflight 是什麼

- Tailwind 預設注入一組 base styles（基於 modern-normalize）來消弭瀏覽器差異。
- 會移除 margin、重設 border、取消 heading/list 預設樣式、讓 img 等元素變成 block 並限制寬度。

## 第三方套件整合

- 有些第三方 widget 依賴瀏覽器預設 border/margin，可能被 Preflight 影響。
- 解法通常是針對特定容器在 `@layer base` 覆寫（例如 `.third-party * { border-style: none; }`）。

## Extending / Disabling

- 需要額外預設樣式：用 `@layer base` 加在 Preflight 之上。
- 若要完全停用 Preflight：改用分開 import（不 import `preflight.css`）。

## Accessibility 注意

- list-style 被移除時，某些讀屏器不會把它宣告成 list；若內容語意上是 list，建議加 `role="list"`。
