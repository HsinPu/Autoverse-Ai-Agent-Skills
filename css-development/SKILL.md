---
name: css-development
description: Read when writing or refactoring CSS. Provides best practices for cascade management, selectors, responsive design, layout (flex/grid), tokens, and maintainable architecture.
always: true
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# CSS 開發（CSS Development）

**撰寫或重構 CSS 時請讀取本 skill。**

目標：寫出「可維護、可覆寫、可擴充」的 CSS，而不是只讓當下畫面能動。

## 進階與參考（Bundled resources）

- **Cascade/Specificity**：如何避免 specificity 戰爭、何時用 `@layer`/`:where()`/`!important`，見 [reference/cascade-and-specificity.md](reference/cascade-and-specificity.md)。
- **Selectors**：selector 策略、可讀性與效能、狀態命名，見 [reference/selectors-and-architecture.md](reference/selectors-and-architecture.md)。
- **Responsive**：media queries vs container queries、breakpoints、reduced motion，見 [reference/responsive.md](reference/responsive.md)。
- **Layout**：Flexbox/Grid 選用與常見陷阱，見 [reference/layout.md](reference/layout.md)。
- **Tokens**：CSS variables（custom properties）、semantic tokens、可擴充主題，見 [reference/tokens.md](reference/tokens.md)。

---

## 外部參考（MDN）

- CSS（總覽）：https://developer.mozilla.org/en-US/docs/Web/CSS
- Specificity：https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Cascade/Specificity
- Selectors：https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors
- Using media queries：https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries
- Flexbox basics：https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox
- Grid layout：https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
- Container queries：https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries
- Custom properties：https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
