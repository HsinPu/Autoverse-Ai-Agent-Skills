# Design System Review Reference

## 觸發時機

- existing UI feels off
- styling PR needs review
- redesign before/after audit
- AI slop or visual inconsistency needs to be diagnosed

## 評分維度

| 維度 | 看什麼 | 常見修法 |
|---|---|---|
| Color consistency | palette 是否穩定、是否亂用 hex | 收斂到 semantic tokens |
| Typography hierarchy | h1/h2/body/caption 是否清楚 | 拉開字級與 weight |
| Spacing rhythm | 間距是否有節奏 | 對齊 spacing scale |
| Component consistency | 相似元件是否長得一致 | 統一 token / variant |
| Responsive behavior | 手機與桌機是否都合理 | 重排而不是硬縮放 |
| Dark mode | 深色模式是否完整 | 補齊 surface / text tokens |
| Animation | 動畫是否有意義 | 刪掉裝飾性動畫 |
| Accessibility | contrast / focus / touch targets | 補語意與狀態 |
| Density | 資訊密度是否過高或過低 | 重組層級與版面 |
| Polish | hover / loading / empty / error 是否完整 | 補交互狀態 |

## Slop patterns

- Gratuitous gradients
- Purple-to-blue defaults
- Glassmorphism with no purpose
- Generic centered hero sections
- Random accent colors
- Placeholder-feeling typography
- Motion that exists only because animation was easy
- Card piles with no hierarchy

## 回報格式

- severity: high / medium / low
- example: what is wrong
- why it matters: impact on the product
- fix: minimal actionable change
- file:line: include when available

## Fix guidance

- Establish semantic tokens first.
- Delete decorative noise before adding more.
- Align typography and spacing before color tweaks.
- Reduce motion and texture when they do not support meaning.
- Make empty/loading/disabled/error states explicit.

## Output expectations

- Score each dimension 0-10.
- Mention concrete examples.
- Include file:line when possible.
- Prefer minimal, actionable fixes over broad advice.
