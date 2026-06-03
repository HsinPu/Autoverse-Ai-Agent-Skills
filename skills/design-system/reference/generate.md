# Design System Generation Reference

## 觸發時機

- 新專案要建立視覺系統
- redesign 前要先整理現況
- 需要從 codebase 抽出 tokens
- UI 看起來不一致，需要先整理成一套規則

## 先看哪些來源

- CSS / SCSS files
- Tailwind `@theme` / config
- CSS variables
- styled-components / emotion / other CSS-in-JS
- theme files and component styles

## 抽取哪些 tokens

| 類別 | 範圍 |
|---|---|
| Color | background, surface, text, muted, accent, success, warning, danger, border |
| Typography | font families, size scale, line-height, weight, tracking |
| Spacing | spacing scale and layout gaps |
| Shape | radii, border widths, shadows |
| Layout | breakpoints, container widths, z-index |
| Motion | duration, easing, reduced-motion behavior |

## 命名原則

- Base tokens: raw palette and scale
- Semantic tokens: purpose-driven names
- Component tokens: only when a component needs a special override
- Avoid one-off hex values in components

## 產出 contract

1. `design-tokens.json`
2. `DESIGN.md`
3. `design-preview.html`

### `design-tokens.json`

- Include base + semantic tokens.
- Normalize values before exporting.
- Separate light/dark values if the system supports both.

### `DESIGN.md`

- Summarize the source patterns that were found.
- Explain why each token exists.
- Call out deprecated or merged tokens.

### `design-preview.html`

- Keep it self-contained.
- Show buttons, inputs, cards, lists, tables, alerts, and modal states.
- Include mobile and desktop views.
- Include dark mode if the system supports it.

## 生成原則

- Reuse existing values before inventing new ones.
- Standardize spacing and type scale.
- Prefer semantic tokens over raw values.
- If the codebase is inconsistent, normalize toward a smaller and clearer token set.

## 交付前檢查

- Are there orphan colors?
- Do similar components use the same tokens?
- Are breakpoints coherent?
- Does the preview show realistic states?
- Is the token set small enough to maintain?
