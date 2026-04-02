---
name: tailwind-development
description: Read when building UIs with Tailwind CSS (v4+). Best practices for utility-first architecture, design tokens with theme variables, managing duplication, safe class composition, custom CSS layers/directives, dark mode, Preflight, and class detection/build output size.
always: true
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Tailwind CSS 開發（Tailwind Development）

**在使用 Tailwind CSS（以 v4+ 為主）撰寫 UI 時請讀取本 skill。**

本 skill 以 Tailwind CSS 官方文件（v4 系列）為主要依據，整理偏實務的最佳做法：utility-first 的組件化策略、`@theme` 設計 tokens、如何處理 class 重複與衝突、何時寫自訂 CSS（`@layer` / `@utility` / `@apply`）、dark mode、Preflight，以及 class 掃描與輸出 CSS 體積控制。

## 適用範圍（Assumptions）

- Tailwind CSS v4+（文件以 v4.2 為基準）
- 有 build step（Vite / PostCSS / CLI），不是純 CDN demo

## 進階與參考（Bundled resources）

- **Architecture / 組件化**：utility-first 的重用策略、何時抽 component/partial、避免 conflicting utilities，見 [reference/architecture.md](reference/architecture.md)。
- **Design Tokens / Theme Variables**：用 `@theme` 建立與管理設計系統（colors/spacing/type/breakpoints），見 [reference/theme-tokens.md](reference/theme-tokens.md)。
- **Custom CSS / Directives**：`@layer`、`@apply`、`@utility`、`@custom-variant`、`@reference`（SFC/CSS modules），見 [reference/custom-css.md](reference/custom-css.md)。
- **Dark Mode**：`dark:` 變體與手動切換（class/data attribute），見 [reference/dark-mode.md](reference/dark-mode.md)。
- **Preflight**：base reset 的影響、第三方套件整合、如何擴充/停用，見 [reference/preflight.md](reference/preflight.md)。
- **Build / Class Detection**：避免動態拼 class、source 掃描、safelist 與忽略路徑，見 [reference/class-detection.md](reference/class-detection.md)。

---

## 外部參考（官方）

- Tailwind Installation：`https://tailwindcss.com/docs/installation`
- Styling with utility classes：`https://tailwindcss.com/docs/styling-with-utility-classes`
- Theme variables：`https://tailwindcss.com/docs/theme`
- Adding custom styles：`https://tailwindcss.com/docs/adding-custom-styles`
- Functions and directives：`https://tailwindcss.com/docs/functions-and-directives`
- Detecting classes in source files：`https://tailwindcss.com/docs/detecting-classes-in-source-files`
- Dark mode：`https://tailwindcss.com/docs/dark-mode`
- Preflight：`https://tailwindcss.com/docs/preflight`
