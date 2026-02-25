# Autoverse AI Agent Skills

可重複使用的 Agent Skill 模組，方便在 Cursor 等 AI Agent 中套用與分享。

---

## 什麼是 Skill？

Skill 是擴充 AI Agent 能力的**模組化套件**：把專業知識、工作流程或工具用法寫成一份份可觸發的指引，讓 Agent 在對的時機自動載入對的說明，不必每次都從頭交代。

---

## 目前收錄的 Skills

| Skill | 說明 |
|-------|------|
| **[skill-creator-design](skill-creator-design/)** | 建立與優化 Skill 的完整指南（中英混合）。包含核心原則、目錄結構、建立流程 Step 1～5，以及撰寫 SKILL.md 與 Bundled Resources 的要點。適合：要**新增或改寫 Skill** 時使用。 |
| **[agent-creator-design](agent-creator-design/)** | 撰寫與設計 **system prompt**（Agent 指令主體）的規範與寫法。包含設計原則、命名與結構、內文寫法。適合：要**撰寫／重構／審查 system prompt** 時使用。 |
| **[mcp-creator-design](mcp-creator-design/)** | 建立高品質 **MCP (Model Context Protocol) 伺服器**的指南。涵蓋研究規劃、實作（TypeScript/Python）、審查測試與評測建立。適合：要**開發 MCP server**、整合外部 API 或服務時使用。 |
| **[markdown-writer](markdown-writer/)** | 撰寫或產出 Markdown 時的指引。協助產出結構清晰、格式一致的 README、技術文件、筆記與說明，遵循 GFM 與標題階層。適合：要**撰寫或修改 .md 文件**、整理文件結構時使用。 |
| **[python-development](python-development/)** | 撰寫或重構 Python 時的參考。提供程式碼風格（PEP 8、命名、型別、Docstring）與設計模式（KISS、SRP、組合、DI）。適合：要**撰寫或重構 Python 程式碼**、討論風格與架構時使用。 |
| **[java-development](java-development/)** | 撰寫或重構 Java 時的參考。提供程式碼風格（Google/Oracle 慣例、命名、格式、Javadoc、例外處理）、設計模式（SOLID、組合、DI、不可變性）以及重構技巧（Stream、Optional、Record 等）。基準版本 Java 11+。適合：要**撰寫或重構 Java 程式碼**、討論風格與架構時使用。 |
| **[typescript-development](typescript-development/)** | 撰寫或重構 TypeScript/JavaScript 時的參考。目前提供 TS 的 BEFORE/AFTER 重構範例（包含 Extract Method、多型、參數物件等）。適合：要**撰寫或重構 TypeScript 程式碼**、討論 TS 模式時使用。 |
| **[git-operations](git-operations/)** | 執行與規劃 Git 工作流（clone、branch、commit、push、pull、merge、rebase、stash）。環境預設 Windows（PowerShell / cmd），包含安全檢查與 Conventional Commits 規範。適合：要**執行任何 Git 操作**時使用。 |
| **[code-review](code-review/)** | 依安全、效能、程式品質與測試四大面向嚴謹審查程式碼。輸出含嚴重度分級（Critical / Suggestions / Nits / What's Good）。適合：要**審查 Pull Request、程式變更或執行 code audit** 時使用。 |
| **[code-refactoring](code-refactoring/)** | 在不改變行為的前提下改善程式結構與可讀性。涵蓋 code smells 定義、通用重構技巧、安全流程與語言無關原則。適合：要**探討重構策略、整理舊程式碼、降低複雜度**時使用（實作範例請參考對應語言的 Skill）。 |
| **[database-design](database-design/)** | Schema 設計、索引、遷移與查詢優化。涵蓋正規化、反正規化、B-tree / GIN / Partial Index、zero-downtime migration。適合：要**設計 schema、寫 migration、優化查詢**時使用。 |
| **[sql-best-practices](sql-best-practices/)** | SQL 撰寫風格、效能優化與安全性。涵蓋命名格式、JOIN/CTE 寫法、EXPLAIN 判讀、N+1、分頁策略、SQL injection 防範、參數化查詢、權限控制。與 `database-design` 互補（前者管 schema 設計，本 skill 管 SQL 撰寫）。適合：要**撰寫或審查 SQL、優化查詢效能、檢視 SQL 安全**時使用。 |
| **[file-organizer](file-organizer/)** | 智慧整理電腦檔案與資料夾：分析結構、找重複檔、建議目錄架構、自動搬移與清理。環境預設 Windows（PowerShell）。適合：要**整理 Downloads / Documents、找重複檔、清理桌面**時使用。 |
| **[frontend-design](frontend-design/)** | 建立具辨識度、可上線的前端介面，避免 generic AI 美學。涵蓋美學方向選定、字體排版、色彩、動態效果與空間構圖。適合：要**建立網頁元件、頁面、Landing Page 或美化 UI** 時使用。 |
| **[ask-questions-if-underspecified](ask-questions-if-underspecified/)** | 先釐清需求再實作，問最少必要的澄清問題，避免做錯方向。**僅在使用者明確要求時使用**，不會自動套用。適合：要**釐清模糊需求、確認規格**時使用。 |

---

## 使用方式

- 將需要的 skill 資料夾（含其中的 `SKILL.md` 與資源）複製到下方對應的**放置位置**，依該 Agent 的說明啟用即可。
- 各 skill 的 `SKILL.md` 開頭有 `name` 與 `description`，Agent 會依 **description** 判斷何時載入該 skill。

---

## CLI（用 GitHub 安裝/更新 skills）

如果你想用指令直接從 GitHub 抓 skills（不用手動複製資料夾），可以使用本 repo 的 CLI：`autoverse-cli.js`。

需求：
- Node.js 16+
- git（CLI 會用 `git clone` 下載）

安裝（直接從 GitHub；不用先 `git clone` 這個 repo）：
- `npm i -g github:HsinPu/Autoverse-Ai-Agent-Skills`

常用指令：
- `autoverse list`
- `autoverse search python`
- `autoverse install python-development --agent cursor`
- `autoverse update --all --agent cursor`

備註：像 Cursor / VS Code 這類「專案內路徑」的 Agent，請在目標專案目錄下執行 `autoverse ...`，CLI 會安裝到該專案的 `.cursor/skills/` 或 `.github/skills/`。

---

## 放置位置（Install Location）

依你使用的 Agent 將 skill 資料夾放到對應路徑：

| Agent | Install Location |
|-------|------------------|
| Claude Code | `~/.claude/skills/` |
| Cursor | `.cursor/skills/` |
| Codex | `~/.codex/skills/` |
| Amp | `~/.amp/skills/` |
| VS Code / Copilot | `.github/skills/` |
| Gemini CLI | `~/.gemini/skills/` |
| Goose | `~/.config/goose/skills/` |
| OpenCode（專案級） | `.opencode/skills/` |
| OpenCode（全域級） | `~/.config/opencode/skills/` |
| Letta | `~/.letta/skills/` |
| Portable | `.skills/`（任一 Agent 皆可用） |

> **備註**：OpenCode 也相容 `.claude/skills/` 與 `.agents/skills/` 路徑（專案級與全域級皆可）。詳見 [OpenCode Agent Skills 文件](https://opencode.ai/docs/skills/)。

---

## 授權（License）

本專案採用 **Apache License 2.0**，詳見 [LICENSE](LICENSE)。各 skill 目錄內若有標示授權則從其約定；未標示者依本專案授權。

若你覺得某個 skill 有用，歡迎取用或改寫，也歡迎回饋與建議。
