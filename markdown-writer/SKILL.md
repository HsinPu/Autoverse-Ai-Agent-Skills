---
name: markdown-writer
description: Writes and structures Markdown for README, documentation, notes, and technical docs. Follows GFM conventions, consistent heading hierarchy, and clear formatting. Use when the user asks to write markdown, create README, format documentation, write docs, or produce .md files.
license: Apache-2.0
---

# Markdown 撰寫（Markdown Writer）

**撰寫或產出 Markdown 時請讀取本 skill。**

協助產出結構清晰、格式一致的 Markdown 文件，適用於 README、技術文件、筆記與說明。

---

## 觸發時機（When to Use）

- 使用者要求撰寫或產出 Markdown（.md）
- 建立或修改 README、文件、說明頁
- 將內容整理成 Markdown 格式
- 討論或優化文件結構、標題階層、列表與程式碼區塊

---

## 撰寫原則（Principles）

### 語言與用語（Language）

- **使用繁體中文**：正文、說明、標題與列表內容一律以繁體中文撰寫。
- **中英文混和**：專有名詞、技術術語、品牌名、程式/指令名稱等保留英文；句子主體用中文，必要時在中文後以括號補英文，例如「應用程式介面（API）」「提交（commit）」。避免整段純英文或純中文術語堆疊，以易讀為準。

### 格式與結構

1. **標題階層**：從 `#` 開始，依序 `##`、`###`，不跳級。
2. **列表與程式碼**：無序列表用 `-`，有序用 `1.`；程式碼用 fenced code block 並標註語言。
3. **連結與圖片**：連結用 `[text](url)`，圖片用 `![alt](url)`；必要時提供可讀的錨點。
4. **表格**：對齊欄位、表頭與分隔列一致，方便閱讀與版本差異。
5. **語意一致**：同一文件內術語、格式（如粗體/程式碼）用法一致。

詳細語法與慣例見 [reference/markdown-style.md](reference/markdown-style.md)。

---

## 常用結構範本（Templates）

### README

```markdown
# 專案名稱

簡短一句話說明專案用途。

## 功能 / 特色

- 要點一
- 要點二

## 安裝 / 快速開始

\`\`\`bash
# 指令範例
\`\`\`

## 使用方式

（必要時分小節說明）

## 授權 / 貢獻

（依專案需要）
```

### 技術文件章節

```markdown
# 章節標題

本節摘要（可選）。

## 前提條件

- 條件一
- 條件二

## 步驟 / 說明

1. 第一步
2. 第二步

## 參考

- 連結或備註
```

### API / 介面說明

```markdown
## 名稱（函式 / 端點 / 元件）

簡短描述。

**參數**

| 名稱 | 型別 | 說明 |
|------|------|------|
| param | type  | 說明  |

**回傳 / 範例**

\`\`\`
範例輸出或程式碼
\`\`\`
```

---

## 參考資料（Reference)

- **語法與風格** — GFM、標題、列表、表格、程式碼、連結：[reference/markdown-style.md](reference/markdown-style.md)
