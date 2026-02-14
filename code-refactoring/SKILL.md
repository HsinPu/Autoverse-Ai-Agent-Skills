---
name: code-refactoring
description: Code refactoring patterns and techniques for improving code quality without changing behavior. Use when cleaning up legacy code, reducing complexity, or improving maintainability.
source: wshobson/agents
license: MIT
---

# Code Refactoring

在不改變行為的前提下改善程式結構與可讀性。適用於整理舊程式碼、降低複雜度、提升可維護性。**重構原則與 code smells 為語言無關，Java、Python、TypeScript 等皆應遵守**；詳見 [reference/universal-principles.md](reference/universal-principles.md)。

## 何時重構 / 何時不重構

**適合重構時機**：加新功能前（先讓改動變容易）、測試通過後（red-green-refactor）、發現 code smell、code review 建議時。

**不適合重構時機**：沒有測試覆蓋、時程緊且無安全網、程式即將被替換、尚未理解程式在做什麼。

---

## 常見 Code Smells

| Smell | 作法摘要 |
|-------|----------|
| **Long methods** | 抽出小方法/函式，單一職責；用描述性名稱。 |
| **Deeply nested conditionals** | 用 early return（guard clauses）取代多層 if。 |
| **Primitive obsession** | 用 value object 封裝驗證與語意（如 Email、Phone）。 |
| **Feature envy** | 方法過度使用別物件的資料 → 考慮把方法移到資料所在處（Move Method）。 |

---

## 重構技巧速查

- **Extract Method**：把「做一件事」的區塊抽成具名方法/函式，原處改為呼叫。
- **Replace Conditional with Polymorphism**：依型別 switch → 改為多型（interface + 實作類別）。
- **Introduce Parameter Object**：參數過多 → 收成一個參數物件（含巢狀結構如 priceRange、sort）。
- **Replace Magic Numbers**：魔術數字 → 具名常數（MINIMUM_AGE、DISCOUNT_THRESHOLD 等）。

---

## 安全重構流程

1. **先有測試** — 沒有就補，再重構。
2. **小步進行** — 一次一種重構。
3. **每次改動後跑測試** — 立刻發現行為變化。
4. **常 commit** — 出問題可快速還原。
5. **看 diff** — 確認只有結構變、行為不變。

---

## Refactoring Checklist

- [ ] 重構前測試通過
- [ ] 每次改動小且聚焦
- [ ] 每次改動後測試通過
- [ ] 僅改結構，不改行為
- [ ] 可讀性提升
- [ ] Commit message 說明重構內容

---

## 進階與參考（Bundled resources）

- **共通原則（語言無關）**：需查閱何時重構、Code smells、重構技巧、安全流程與檢查表時，見 [reference/universal-principles.md](reference/universal-principles.md)。Java、Python、TypeScript 等皆應遵守。
- **實作範例（依語言）**：需 TypeScript 的 BEFORE / AFTER 範例時，見 [reference/examples-typescript.md](reference/examples-typescript.md)。Java、Python 等可另增對應檔案（如 `reference/examples-python.md`）。
