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

## 收錄 Skills

### 🛠️ Development（開發）

| Skill | 說明 |
|-------|------|
| **[typescript-development](typescript-development/)** | TypeScript/JavaScript 開發參考。型別安全、設計模式、重構技巧 |
| **[javascript-development](javascript-development/)** | 現代 JavaScript 開發最佳實踐（Node.js 與瀏覽器） |
| **[python-development](python-development/)** | Python 開發參考（PEP 8、型別、Docstring、設計模式） |
| **[java-development](java-development/)** | Java 開發參考（程式碼風格、SOLID、設計模式）基準 Java 11+ |
| **[spring-development](spring-development/)** | Spring / Spring Boot 開發最佳實踐（DI、Web API、Security、Testing） |
| **[mybatis-development](mybatis-development/)** | MyBatis 開發最佳實踐（Mapper、XML、Spring 整合、效能優化） |
| **[vue-development](vue-development/)** | Vue 3 開發最佳實踐（Composition API、Pinia、Vue Router、TypeScript） |
| **[nuxt-development](nuxt-development/)** | Nuxt 3/4 開發最佳實踐（SSR、Nitro、SEO、資料抓取） |
| **[css-development](css-development/)** | CSS 開發最佳實踐（Cascade、RWD、Flex/Grid、維護架構） |
| **[tailwind-development](tailwind-development/)** | Tailwind CSS v4+ 開發最佳實踐（Utility-first、Design Tokens、Dark Mode） |
| **[frontend-design](frontend-design/)** | 建立具辨識度的前端介面，避免 generic AI 美學 |
| **[jquery-development](jquery-development/)** | jQuery 開發最佳實踐（Legacy 專案、遷移指南） |
| **[database-design](database-design/)** | 資料庫 Schema 設計、索引優化、Migration 模式（PostgreSQL/MySQL/NoSQL） |
| **[sql-best-practices](sql-best-practices/)** | SQL 撰寫風格、效能優化、安全性（防 SQL Injection） |
| **[git-operations](git-operations/)** | Git 工作流（clone、branch、commit、push、merge、rebase）Windows 環境 |
| **[code-review](code-review/)** | 自動化程式碼審查（安全、效能、品質、測試）含嚴重度分級 |
| **[code-refactoring](code-refactoring/)** | 程式碼重構技巧（Code Smells、安全流程、語言無關原則） |
| **[mcp-creator-design](mcp-creator-design/)** | 建立高品質 MCP Server（TypeScript/Python）整合外部 API |
| **[git-readme-writer](git-readme-writer/)** | 分析 Git / GitHub / Gerrit 專案並撰寫、重構或標準化 README.md |

### 📋 Productivity（生產力）

| Skill | 說明 |
|-------|------|
| **[skill-creator-design](skill-creator-design/)** | 建立與優化 Skill 的完整指南（建立流程、SKILL.md 撰寫） |
| **[agent-creator-design](agent-creator-design/)** | 撰寫與設計 System Prompt 的規範（命名、結構、內文寫法） |
| **[markdown-writer](markdown-writer/)** | Markdown 撰寫指引（README、技術文件、GFM 規範） |
| **[todo-first](todo-first/)** | 多步驟任務前先建立 todo list（使用 `todowrite`） |
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
