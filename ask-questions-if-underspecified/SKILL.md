---
name: ask-questions-if-underspecified
description: Clarify requirements before implementing by asking the minimum must-have questions. Do not use automatically; apply only when the user explicitly invokes this skill or asks to clarify requirements first.
source: thsottiaux
---

# Ask Questions If Underspecified

先釐清需求再實作。**僅在使用者明確要求時使用**，不要自動套用。

## Goal

問最少必要的澄清問題，避免做錯方向；在必答問題有答案（或使用者明確同意以所述假設進行）之前，不要開始實作。

---

## Workflow

### 1) 判斷是否規格不足（underspecified）

若在思考如何執行後，下列仍有不清楚之處，即視為規格不足：

- **目標**：什麼要改、什麼不變
- **完成條件**：驗收標準、範例、邊界情況
- **範圍**：哪些檔案／元件／使用者納入、排除
- **約束**：相容性、效能、風格、依賴、時間
- **環境**：語言／執行環境版本、OS、建置／測試工具
- **安全與可逆性**：資料遷移、上線／回滾、風險

若存在多種合理解讀，視為規格不足。

### 2) 先問必答題（數量少）

第一輪只問 1～5 個問題，優先問能排除整塊工作的問題。

讓回答容易：

- **好掃描**：簡短、編號，避免長段落
- **多選題**：盡量提供選項（A/B/C）
- **預設值**：標明建議／預設（如加粗「Recommended」、在選項旁註 default）
- **快徑**：例如回覆 `defaults` 即接受所有建議
- **不確定**：提供「不確定就用預設」選項
- **必要 vs 選答**：分開「Need to know」與「Nice to know」
- **簡短回覆**：讓使用者可用 `1b 2a 3c` 回答；確認時用白話重述選擇

### 3) 在取得答案前暫停實作

在必答題有答案前：

- **不要**：執行指令、編輯檔案、產出依賴未知條件的詳細計畫
- **可以**：做清楚標示、低風險的探索（例如看 repo 結構、讀相關設定），且不因此鎖定方向

若使用者明確要求「先做再說」：

- 用簡短編號列出你的假設
- 請對方確認或修正後再開始

### 4) 確認理解後再動手

有答案後，用 1～3 句話重述需求（含關鍵約束與成功條件），再開始實作。

---

## Question 範本

- "Before I start, I need: (1) ..., (2) ..., (3) .... If you don't care about (2), I will assume ...."
- "Which of these should it be? A) ... B) ... C) ... (pick one)"
- "What would you consider 'done'? For example: ..."
- "Any constraints I must follow (versions, performance, style, deps)? If none, I will target the existing project defaults."
- 用編號題 + 字母選項 + 明確回覆格式：

```text
1) Scope?
a) Minimal change (default)
b) Refactor while touching the area
c) Not sure - use default
2) Compatibility target?
a) Current project defaults (default)
b) Also support older versions: <specify>
c) Not sure - use default

Reply with: defaults (or 1a 2a)
```

---

## Anti-patterns

- **不要**問可以透過快速、低風險的探索就能回答的題目（例如讀 config、既有慣例、文件）。
- **不要**在可以用緊一點的多選或是非題就消除歧義時，改用開放式問法。
