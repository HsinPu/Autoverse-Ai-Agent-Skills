---
name: agent-creator-design
description: System prompt and agent design guide for writing clear, maintainable instruction sets, metadata, structure, and output rules. Use when creating a new agent prompt, redesigning prompt structure, or refining existing system prompt content.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# System Prompt 撰寫規範與寫法

本 skill 規範 **system prompt**（agent 的指令主體）的設計原則與內文寫法。若需求其實是建立 Skill、拆分子代理或設計多 agent 協作，請改看 `skill-creator-design` 或 `subagent-architecture`。

若將 system prompt 寫成檔案，請先在檔案最上方寫 **metadata**，再開始正文。metadata 決定這份 prompt 能否被正確觸發。

---

## 一、設計原則（Design Principles）

### 1.1 單一職責（Single Responsibility）

- 每份 system prompt **只**定義**一個角色**或**一類任務**／一個明確 **workflow**。
- 避免「什麼都能做」的通用型描述；職責越具體，行為越可預期。

**Example**  
❌ 「你是一個程式助手，可以協助開發與除錯」  
✅ 「你是 **code reviewer**。被呼叫時，針對已修改的程式做品質與安全檢視，並產出 **checklist**。」

### 1.2 命名規範（Naming Convention）

- 使用 **lowercase + hyphen**（如 `code-reviewer`、`api-doc-generator`）；僅供內部時可採繁體中文，同一專案內風格一致。
- 名稱長度 ≤ 64 字元、語意清楚；避免 `helper`、`utils`、`tools` 等籠統命名。
- 存成檔案或標題時，命名需與職責對應，利於辨識與維護。

### 1.3 Metadata（先寫在最上方）

- 將 system prompt 存成檔案或模組時，**先在最上方寫 metadata**，再開始正文，方便辨識、版本與維護。
- `metadata` 建議使用 **YAML frontmatter**，並固定放在檔案開頭。
- **必填**：`name`、`description`。
- `description` 必須寫得**具體且足夠詳細**，先直接說明這個 agent / prompt 本身提供什麼能力、負責什麼工作或 workflow，再補充典型任務，以及會在什麼情境或需求下被使用；避免只寫過短、籠統、難以判斷的句子。
- `description` 先寫「做什麼」，再寫「什麼情況用」；如果看完仍無法判斷觸發時機，就要再補寫。
- `metadata` **必須使用英文**；`name` 使用英文識別詞，`description` 與其他自由文字欄位也使用英文，讓 agent 在跨專案與跨語系情境下更穩定判斷與比對。
- 若 `description` 寫得太短，agent 很難正確判斷何時該載入或使用此 prompt；優先使用完整的一到兩句描述，而不是模糊標籤。
- **選填**：`version`、`scope`、`language` 等；同一專案內格式一致。

**Example（YAML frontmatter）**

```yaml
---
name: code-reviewer
description: Review modified code for correctness, security, maintainability, and missing tests. Use when the agent receives a diff or a request to inspect code changes.
version: "1.0"
scope: development
---
```

---

### 1.4 適用邊界（Scope Boundary）

- 若你是在設計可重複發佈的 Skill、bundled resources 或 creation workflow，改看 `skill-creator-design`。
- 若你是在拆分多 agent 工作、規劃角色協作或 handoff，改看 `subagent-architecture`。

## 二、寫法規範（Writing Guidelines）

### 2.0 內文結構（四大項）

System prompt 內文**只分四大項**，依序為：

`metadata` 不算在這四大項內；它固定放在檔案最上方。

| 項目 | 說明 |
|------|------|
| **角色（Role）** | 一句話定義「你是誰」—模型扮演的身分或角色。 |
| **任務（Task）** | 要完成的具體工作、步驟或流程；可步驟化、可執行。 |
| **規範（Constraints）** | 必須遵守的規則、限制、格式或禁忌（術語一致、精簡、避免的寫法等）。 |
| **輸出（Output）** | 產出形式、格式、範例或 **template**（長什麼樣子、放在哪裡）。 |

依此四項分段撰寫，不額外擴充大類；細節放在各項之下即可。

**建議骨架**

```md
---
name: ...
description: ...
---

# Role
You are ...

# Task
1. ...
2. ...

# Constraints
- ...
- ...

# Output
- ...
```

### 2.1 指令與步驟（Instructions & Steps）

- 用**步驟化**方式撰寫流程，必要時加上簡短 **checklist**。
- 每一步須**可執行**：模型或使用者能依文意直接操作。
- 條件分支時使用「若……則……否則……」等明確句式。

### 2.2 精簡與脈絡（Brevity & Context）

- 只寫真正需要的資訊，避免冗長背景說明；**context** 與 **token** 皆有限。
- 內容較長時，核心放前面，次要細節往後或分段；必要時以「詳見……」引用外部文件（**單層引用**即可）。

### 2.3 術語一致（Terminology Consistency）

- 同一份 prompt 內，同一概念**只使用一個詞**（例如只用「API 端點」或只用 `route`，不混用）。
- 「欄位」、「參數」、「選項」等用語全文一致。

### 2.4 範例與模板（Examples & Templates）

- 需產出固定格式時，在 prompt 中**提供具體範例或 template**，優於抽象描述。
- 範例須可直接套用或微調，避免僅有「請參考類似範例」的模糊指引。

### 2.5 路徑與指令（Paths & Commands）

- 檔案或路徑使用**正斜線**（如 `scripts/helper.py`），避免 Windows 反斜線。
- 執行指令依使用者環境撰寫（例如 Windows 用 `.\script.ps1` 或 `python scripts/xxx.py`）。

### 2.6 避免的寫法（Anti-patterns）

- **過多選項並列**：優先給一個建議做法，必要時再說明替代方案。
- **具時效的絕對時間**：如「2025 年 8 月前請用舊 API」易過期；改為「目前作法」與「舊版／deprecated」分開說明。
- **模糊的角色描述**：如「你是小幫手」「你是工具」；改為具體角色與任務（例如「你是 API 文件產出者，根據程式碼註解產出 OpenAPI 規格」）。
- **把多角色塞進同一份 prompt**：若真的需要不同職責，拆成多份 prompt 或 subagent。

---

## 三、實作檢查清單（Checklist）

撰寫或修改 system prompt 時，依下列項目自檢：

- [ ] 職責單一，可一句話說明「這個 prompt 要模型做什麼」
- [ ] 命名符合規範（lowercase、hyphen 或一致風格，語意清楚）
- [ ] 存成檔案時已在**最上方**加上 **metadata**（至少含 `name`、`description`；選填 `version`／`scope` 等）
- [ ] `description` 不是籠統短句，而是足夠詳細到能說明角色、典型任務與觸發情境
- [ ] `description` 先說明這個 agent / prompt 本身是做什麼的，再補充使用時機
- [ ] `metadata` 使用英文撰寫（至少 `name`、`description` 與其他自由文字欄位）
- [ ] 內文僅分四大項：角色、任務、規範、輸出
- [ ] 流程步驟化、可執行
- [ ] 術語一致、無冗長重複
- [ ] 必要處有範例或 template
- [ ] 需求若涉及多 agent 協作或子代理，已明確改看 `subagent-architecture`
- [ ] 路徑與指令符合使用環境（如 Windows）
- [ ] 無時效性絕對日期、無過多並列選項、無模糊角色描述
