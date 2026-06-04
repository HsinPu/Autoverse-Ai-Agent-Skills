# Coding Standards Quality Gates

## 觸發時機

- code review 前
- 設定 CI checks
- 想知道哪些規則必須卡住 PR
- 檢查 project standards 是否可落地

## 必要門檻

- Lint passes
- Format passes
- Type checks pass
- Core tests pass
- Accessibility checks applied where UI exists
- Security-sensitive flows reviewed

## Gate levels

| Level | Use when | Required proof |
|---|---|---|
| Fast local gate | Small, isolated edits | Relevant lint/type/test command or focused smoke check |
| Feature gate | User-facing workflow, API, or shared module changes | Unit or integration tests plus a manual or scripted workflow check |
| Release gate | Deployment, auth, billing, data migration, security, or public contract changes | Full relevant suite, rollback/compatibility notes, and explicit risk review |

## Review gates

| Gate | 問題 | 通過條件 |
|---|---|---|
| Style | 是否符合 repo conventions | 無明顯風格漂移 |
| Structure | folder / module boundaries 是否清楚 | 職責可辨識 |
| Tests | 關鍵行為是否有測試 | 行為有覆蓋 |
| A11y | UI 是否可鍵盤操作 | focus / labels / semantics 完整 |
| Performance | 是否引入明顯成本 | 無明顯多餘重繪 / 多餘 bundle |
| Security | boundary validation / secrets / injection | 無高風險問題 |

## 建議 CI checks

- `lint`
- `format:check`
- `typecheck`
- `test`
- `test:integration` or `e2e` if the project uses them

## PR review checklist

- Does the change match an existing pattern in the repo?
- Are new constants/configuration values named and located near their owner?
- Are error states, loading states, and boundary validation covered where relevant?
- Are tests focused on observable behavior?
- Are unrelated formatting, generated files, and refactors kept out of the change?

## 常見失敗原因

- 格式工具與 lint 規則互相衝突
- 測試名稱不一致，導致 review 難以追蹤
- 模組邊界不清楚，導致重複邏輯增加
- 規範過多，實際沒人遵守

## 建議回報方式

- What rule failed
- Why it matters
- Minimal fix
- Whether the fix should become a permanent standard
