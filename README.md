# Autoverse AI Agent Skills

這裡放的是我平常在用的 **Skills**，整理成可重複使用的模組，方便在不同 AI Agent（例如 Cursor）裡套用與分享。

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

---

## 使用方式

- 將需要的 skill 資料夾（含其中的 `SKILL.md` 與資源）複製到下方對應的**放置位置**，依該 Agent 的說明啟用即可。
- 各 skill 的 `SKILL.md` 開頭有 `name` 與 `description`，Agent 會依 **description** 判斷何時載入該 skill。

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
| OpenCode | `~/.opencode/skill/` |
| Letta | `~/.letta/skills/` |
| Portable | `.skills/`（任一 Agent 皆可用） |

---

## 授權（License）

本專案採用 **Apache License 2.0**，詳見 [LICENSE](LICENSE)。各 skill 目錄內若有標示授權則從其約定；未標示者依本專案授權。第三方來源與致謝見 [NOTICE](NOTICE)。

若你覺得某個 skill 有用，歡迎取用或改寫，也歡迎回饋與建議。
