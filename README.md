# Autoverse AI Agent Skills

可重複使用的 Agent Skill 模組，方便在 Cursor 等 AI Agent 中套用與分享。

![License](https://img.shields.io/github/license/HsinPu/Autoverse-Ai-Agent-Skills)
![Version](https://img.shields.io/npm/v/autoverse-ai-agent-skills)
![Node](https://img.shields.io/node/v/autoverse-ai-agent-skills)

---

## 什麼是 Skill？

Skill 是擴充 AI Agent 能力的**模組化套件**：把專業知識、工作流程或工具用法寫成一份份可觸發的指引，讓 Agent 在對的時機自動載入對的說明，不必每次都從頭交代。

---

## 快速開始

### 方式一：使用 CLI 安裝（推薦）

```bash
# 全域安裝 CLI
npm i -g github:HsinPu/Autoverse-Ai-Agent-Skills

# 安裝單一 skill 到指定 Agent
autoverse install python-development --agent cursor

# 安裝所有 skills 到指定 Agent
autoverse install --all --agent cursor
```

### 方式二：手動複製

將需要的 skill 資料夾複製到你的 Agent 對應目錄（詳見下方「放置位置」）。

---

## 通用寫程式流程對應 Skills

以下是常見的通用流程，不是每個小改動都要跑完全部步驟；大型需求或多人協作時會更完整。

| 順序 | 階段 | 何時需要 | 對應 Skills |
|---|---|---|---|
| 1 | 需求釐清 | 幾乎都需要 | `ask-questions-if-underspecified` |
| 2 | 任務拆解 | 幾乎都需要 | `todo-first` |
| 3 | 規格/設計 | 規模較大、多人協作時 | `specification-authoring` |
| 4 | 資料設計 | 有資料庫或資料模型時 | `database-design`, `sql-best-practices` |
| 5 | 程式實作 | 幾乎都需要 | `python-development`, `java-development`, `javascript-development`, `typescript-development`, `spring-development`, `vue-development`, `nuxt-development`, `css-development`, `tailwind-development`, `frontend-design`, `react-ui-patterns`, `mybatis-development`, `jquery-development`, `mcp-creator-design` |
| 6 | 驗證/修正 | 幾乎都需要 | `code-review`, `logging-patterns` |
| 7 | 重構 | 視需要 | `code-refactoring` |
| 8 | 文件交付 | 對外交付或交接時 | `markdown-writer`, `git-readme-writer` |
| 9 | 版本控制 | 幾乎都需要 | `git-operations` |

Python、Java、前端的差別主要只在第 5 步的實作 skill，流程順序本身大致相同。

如果有部署或維運需求，再接對應技術棧 skill；目前沒有獨立的通用部署 skill。

---

## 收錄 Skills

目前共收錄 **31** 個 skills：**23** 個 Development、**8** 個 Productivity。

### 🛠️ Development（開發）

| Skill | 說明 |
|-------|------|
| **[typescript-development](typescript-development/)** | TypeScript / JavaScript 開發參考（型別安全、設計模式、重構、TS patterns） |
| **[javascript-development](javascript-development/)** | 現代 JavaScript 開發最佳實踐（Node.js 與瀏覽器） |
| **[python-development](python-development/)** | Python 開發參考（專案架構、PEP 8、型別、Docstring、設計模式） |
| **[java-development](java-development/)** | Java 開發參考（程式碼風格、Javadoc、SOLID、設計模式） |
| **[spring-development](spring-development/)** | Spring / Spring Boot 開發最佳實踐（DI、Web API、Security、Testing） |
| **[mybatis-development](mybatis-development/)** | MyBatis 開發最佳實踐（Mapper、XML、Spring 整合、效能優化） |
| **[vue-development](vue-development/)** | Vue 3 開發最佳實踐（Composition API、Pinia、Vue Router、TypeScript） |
| **[nuxt-development](nuxt-development/)** | Nuxt 3/4 開發最佳實踐（SSR、Nitro、SEO、資料抓取） |
| **[css-development](css-development/)** | CSS 開發最佳實踐（Cascade、RWD、Flex/Grid、維護架構） |
| **[tailwind-development](tailwind-development/)** | Tailwind CSS v4+ 開發最佳實踐（Utility-first、Design Tokens、Dark Mode） |
| **[frontend-design](frontend-design/)** | 建立具辨識度的前端介面與視覺成品（網站、landing page、dashboard、React/HTML/CSS UI） |
| **[react-ui-patterns](react-ui-patterns/)** | React UI 狀態模式（loading、error、empty、optimistic、Suspense、transition） |
| **[design-system](design-system/)** | 視覺系統生成與稽核（tokens、preview、visual audit、AI slop 檢測） |
| **[coding-standards](coding-standards/)** | TS/JS/React/Node 通用程式規範與架構標準（lint、format、types、tests、a11y、security） |
| **[jquery-development](jquery-development/)** | jQuery 開發最佳實踐（Legacy 專案、遷移指南） |
| **[database-design](database-design/)** | 資料庫 Schema 設計、索引優化、Migration 模式（PostgreSQL/MySQL/NoSQL） |
| **[sql-best-practices](sql-best-practices/)** | SQL 撰寫風格、JOIN / subqueries、效能優化與安全性（防 SQL Injection） |
| **[git-operations](git-operations/)** | Git 工作流（clone、branch、stage、commit、push、pull、merge、rebase）與狀態檢查，Windows 環境 |
| **[code-review](code-review/)** | 自動化程式碼審查（安全、效能、品質、測試）含嚴重度分級 |
| **[code-refactoring](code-refactoring/)** | 程式碼重構技巧（Code Smells、安全流程、語言無關原則） |
| **[logging-patterns](logging-patterns/)** | 撰寫乾淨一致的 log 訊息模式（level、message shape、context fields、低噪音） |
| **[mcp-creator-design](mcp-creator-design/)** | 建立高品質 MCP Server（Python FastMCP / Node/TypeScript MCP SDK）整合外部 API / services |
| **[git-readme-writer](git-readme-writer/)** | 依專案類型與 GitHub / Gerrit 平台差異選擇合適的 README 結構 |

### 📋 Productivity（生產力）

| Skill | 說明 |
|-------|------|
| **[skill-creator-design](skill-creator-design/)** | 建立與優化 Skill 的完整指南（建立流程、SKILL.md 撰寫） |
| **[agent-creator-design](agent-creator-design/)** | 撰寫與設計 System Prompt 的規範（命名、結構、內文寫法） |
| **[markdown-writer](markdown-writer/)** | Markdown 撰寫指引（README、技術文件、格式化 docs、GFM 規範） |
| **[specification-authoring](specification-authoring/)** | 技術規格說明書（Spec）撰寫、重整、審查與 code-to-spec 流程指引 |
| **[todo-first](todo-first/)** | 多步驟或 non-trivial 任務前先建立 todo list（含狀態維護與驗證追蹤） |
| **[ask-questions-if-underspecified](ask-questions-if-underspecified/)** | 需求不明時先問澄清問題（僅使用者明確要求時使用） |
| **[answer-writing](answer-writing/)** | 撰寫最終回應的指引（繁體中文預設、清晰可行動） |
| **[file-organizer](file-organizer/)** | 智慧整理電腦檔案（找重複檔、建議架構、自動清理）Windows 環境 |

---

## 使用方式

1. **選擇 Skill**：根據你的任務選擇對應的 Skill
2. **放置到正確位置**：將 skill 資料夾複製到你的 Agent 目錄
3. **自動載入**：Agent 會依 `SKILL.md` 中的 `description` 自動判斷何時載入

---

## 放置位置（Install Location）

| Agent | 放置路徑 |
|-------|----------|
| Claude Code | `~/.claude/skills/` |
| Cursor | `.cursor/skills/` |
| Codex | `~/.codex/skills/` |
| Amp | `~/.amp/skills/` |
| VS Code / Copilot | `.github/skills/` |
| Gemini CLI | `~/.gemini/skills/` |
| Goose | `~/.config/goose/skills/` |
| OpenCode（專案） | `.opencode/skills/` |
| OpenCode（全域） | `~/.config/opencode/skills/` |
| Letta | `~/.letta/skills/` |
| Portable | `.skills/` |

> **備註**：OpenCode 也相容 `.claude/skills/` 與 `.agents/skills/` 路徑。詳見 [OpenCode Agent Skills 文件](https://opencode.ai/docs/skills/)。

---

## CLI 指令參考

### 安裝

```bash
# 安裝單一 skill
autoverse install <skill-name> --agent <agent-name>

# 安裝所有 skills
autoverse install --all --agent <agent-name>

# 安裝到所有支援的 Agent
autoverse install <skill-name> --all
```

### 更新

```bash
# 更新單一 skill
autoverse update <skill-name> --agent <agent-name>

# 更新所有 skills
autoverse update --all --agent <agent-name>
```

### 查詢

```bash
# 列出所有可用 skills
autoverse list

# 搜尋 skill
autoverse search <keyword>
```

### 移除 CLI

```bash
npm uninstall -g autoverse-ai-agent-skills
```

---

## 貢獻

歡迎貢獻新的 Skill 或改進現有的 Skill！

1. Fork 本專案
2. 建立新的 branch（`git checkout -b feature/your-skill`）
3. 提交變更（`git commit -m 'feat: add your skill'`）
4. 推送到遠端（`git push origin feature/your-skill`）
5. 建立 Pull Request

---

## 授權

本專案採用 **Apache License 2.0**，詳見 [LICENSE](LICENSE)。

各 skill 目錄內若有標示授權則從其約定；未標示者依本專案授權。

---

## 連結

- [GitHub Repository](https://github.com/HsinPu/Autoverse-Ai-Agent-Skills)
- [NPM Package](https://www.npmjs.com/package/autoverse-ai-agent-skills)
- [Issue Tracker](https://github.com/HsinPu/Autoverse-Ai-Agent-Skills/issues)
