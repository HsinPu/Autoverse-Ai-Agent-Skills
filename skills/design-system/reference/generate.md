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
- authorized runtime DOM and computed styles when source and render may differ

## Source and Decision Ledger

Before normalizing values, record the evidence that may define the system:

| Source | Authority | Scope | Revision/status | Owner | Conflict or gap |
| --- | --- | --- | --- | --- | --- |
| Production tokens | implementation | foundations and components | <commit/version> | <owner> | <difference> |
| Runtime observation | rendered implementation | <routes/states/themes> | <capture revision> | <owner> | <difference> |
| Approved design artifact | visual direction | <routes/families> | selected/approved | <owner> | <difference> |
| Product or brand document | intent/content | <scope> | active/stale | <owner> | <difference> |

Do not resolve conflicts by silently choosing the newest file. Prefer maintained production behavior for current facts, explicit approval for intentional changes, and repository owners for unresolved contract changes.

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

- Use DTCG 2025.10-compatible `$type` and `$value` fields for the canonical token source.
- Include primitive + semantic tokens; add component tokens only for real component-specific contracts.
- Express aliases with `{path.to.token}` instead of copying resolved values into every semantic token.
- Use `$description` for durable intent and documented `$extensions` for provenance or tool-specific metadata.
- Normalize values before exporting and validate references before generating platform files.
- Represent light/dark or other modes through the repository's documented token strategy; do not invent an undocumented custom format.

### `DESIGN.md`

- Summarize the source patterns that were found.
- Explain why each token exists.
- Call out deprecated or merged tokens.
- Record the active direction version, source ledger, decision owner, last verification, accepted deviations, and conditions that require re-approval.
- Link to product requirements instead of copying them into a second document.

### `design-preview.html`

- Keep it self-contained.
- Show buttons, inputs, cards, lists, tables, alerts, and modal states.
- Include mobile and desktop views.
- Include dark mode if the system supports it.

Treat the preview as evidence, not authority. Label the token revision, theme, viewport, representative states, and any mocked content.

## 生成原則

- Reuse existing values before inventing new ones.
- Standardize spacing and type scale.
- Prefer semantic tokens over raw values.
- If the codebase is inconsistent, normalize toward a smaller and clearer token set.
- Generate CSS, JavaScript, mobile, or documentation artifacts from the canonical token source; do not hand-edit generated outputs.
- Dry-run token migrations and report add/change/rename/alias/delete effects before applying them.

## 交付前檢查

- Are there orphan colors?
- Do similar components use the same tokens?
- Are breakpoints coherent?
- Does the preview show realistic states?
- Is the token set small enough to maintain?
- Are aliases valid and free of cycles?
- Can every generated platform artifact be traced to the canonical token revision?
- Are observed runtime values labeled separately from approved tokens?
