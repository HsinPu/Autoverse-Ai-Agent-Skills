# Selectors 與 CSS 架構（Selectors and Architecture）

## Selector 策略

- 以 **class** 當主力；避免 style 綁 tag/結構過深。
- 避免 `#id` selector（會把 specificity 拉滿）。
- 避免多層 descendant selector（`.a .b .c .d`）造成耦合。

## 命名與狀態

- component：`.card`, `.button`, `.modal`
- state：`.is-active`, `.is-loading`, `.has-error`
- variant：`.button--primary`, `.card--compact`

狀態 class 建議由 JS/框架切換，不要讓 CSS 依賴太多 DOM 結構。

## 與第三方 CSS 共存

- 先把第三方放進 layer（如果可控），你的 overrides 放最後。
- 覆寫用最小必要 selector，不要用「更深」去硬拚（那會讓後續更痛）。

參考（MDN selectors module）：

- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors
