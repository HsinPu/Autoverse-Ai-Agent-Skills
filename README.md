# Autoverse AI Agent Skills

[![Validate](https://github.com/HsinPu/Autoverse-Ai-Agent-Skills/actions/workflows/validate.yml/badge.svg)](https://github.com/HsinPu/Autoverse-Ai-Agent-Skills/actions/workflows/validate.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
![Skills](https://img.shields.io/badge/Skills-185-7c3aed)
![Agents](https://img.shields.io/badge/Agents-134-2563eb)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D16-339933?logo=nodedotjs&logoColor=white)

由 **HsinPu** 維護的開源 AI Agent 與 Skill catalog，提供可直接安裝的 Codex／Claude Code Agent、跨平台 Skills、安全更新機制，以及本機 catalog 查詢 CLI。

這個專案不是另一套 Agent runtime 或 orchestration framework；它專注在可攜、可查詢、可驗證的角色與能力定義，讓現有 coding agent 能直接使用。

[快速開始](#快速開始) · [Agents](#agents) · [Skills](#skills) · [Catalog CLI](#catalog-cli) · [開發與驗證](#開發與驗證) · [回報問題](https://github.com/HsinPu/Autoverse-Ai-Agent-Skills/issues)

## 目錄

- [快速開始](#快速開始)
- [專案內容](#專案內容)
- [安裝目標](#安裝目標)
- [安裝單一元件](#安裝單一元件)
- [安全更新與覆蓋保護](#安全更新與覆蓋保護)
- [如何使用 Agent](#如何使用-agent)
- [Catalog CLI](#catalog-cli)
- [Agents](#agents)
- [Skills](#skills)
- [專案結構](#專案結構)
- [開發與驗證](#開發與驗證)
- [來源、改寫與授權政策](#來源改寫與授權政策)
- [疑難排解](#疑難排解)
- [參與貢獻](#參與貢獻)
- [License](#license)

## 快速開始

下列命令已明確預填 Codex target。安裝器本身仍要求提供 Target，不會在未指定時自行猜測平台。

### 一次安裝全部 Skills 與 Agents

Windows PowerShell：

```powershell
powershell -ExecutionPolicy Bypass -NoProfile -Command '$s = irm https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.ps1; $installer = [scriptblock]::Create($s); & $installer -Target codex -Type skill; & $installer -Target codex -Type agent'
```

Linux／macOS：

```bash
curl -fsSL https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.sh | bash -s -- --target codex --type skill && curl -fsSL https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.sh | bash -s -- --target codex --type agent
```

### 只安裝全部 Skills

Windows PowerShell：

```powershell
powershell -ExecutionPolicy Bypass -NoProfile -Command '$s = irm https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.ps1; & ([scriptblock]::Create($s)) -Target codex -Type skill'
```

Linux／macOS：

```bash
curl -fsSL https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.sh | bash -s -- --target codex --type skill
```

### 只安裝全部 Agents

Windows PowerShell：

```powershell
powershell -ExecutionPolicy Bypass -NoProfile -Command '$s = irm https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.ps1; & ([scriptblock]::Create($s)) -Target codex -Type agent'
```

Linux／macOS：

```bash
curl -fsSL https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.sh | bash -s -- --target codex --type agent
```

### 執行需求

| 功能 | 需求 |
|---|---|
| PowerShell 安裝器 | Windows PowerShell／PowerShell 與網路連線 |
| Bash 安裝器 | Bash、`curl`、`tar`、`mktemp` 與網路連線 |
| Catalog CLI | Node.js 16 或更新版本 |
| 專案開發與驗證 | Node.js 16 或更新版本；CI 使用 Node.js 20 |

安裝 Skills 或 Agents **不需要 Node.js**。如果不想直接執行遠端腳本，請先 clone repository、檢查 `scripts/install.ps1` 或 `scripts/install.sh`，再依照[本機安裝](#從本機-checkout-安裝)執行。

## 專案內容

| 類型 | 數量 | 用途 | Canonical source |
|---|---:|---|---|
| Skills | **185 Skills**／7 類 | 可重複使用的工作流程、規範、工具指引與領域知識 | `skills/<name>/SKILL.md` |
| Agents | 134／24 類 | 可委派的專業角色，包含任務、限制、權限與輸出契約 | `agents/<role>.md` |
| Codex adapters | 134 | Codex custom Agent 的 TOML 設定 | `adapters/codex/<role>.toml` |
| Claude adapters | 134 | Claude Code subagent 的 Markdown 設定 | `adapters/claude/<role>.md` |
| Reference ledger | 199 definitions | 保存上游 reference path 與合併追蹤資料 | `scripts/data/wshobson-agent-inventory.json` |

<!-- AGENT_COUNT_START -->
目前共收錄 **134** 個不重複 Agents。
<!-- AGENT_COUNT_END -->

上游 ledger 的 199 份 definitions 內含 65 份同名角色變體。本專案依 role 合併為 134 個唯一 Agents，因此不會建立或安裝重複角色。

### Agent 與 Skill 的差別

| | Agent | Skill |
|---|---|---|
| 核心概念 | 一個可被委派任務的專業角色 | 一套可套用到任務的操作知識或工作流程 |
| 典型例子 | `code-reviewer`、`debugger`、`security-auditor` | `code-review`、`python-development`、`threat-modeling` |
| Codex 位置 | `~/.codex/agents/` 或 `.codex/agents/` | `~/.codex/skills/` |
| 安裝單位 | 單一 adapter 檔案與 ownership sidecar | 含 `SKILL.md`、references、scripts、assets 的資料夾 |

Agent 可以引用一個或多個相關 Skills；Skill 也能由主 Agent 直接使用，不必先建立 subagent。

## 安裝目標

### Agent targets

| Target | Scope | 格式 | 預設安裝位置 |
|---|---|---|---|
| `codex` | 使用者 | `.toml` | `~/.codex/agents/` |
| `codex-project` | 目前專案 | `.toml` | `.codex/agents/` |
| `claude` | 使用者 | `.md` | `~/.claude/agents/` |
| `claude-project` | 目前專案 | `.md` | `.claude/agents/` |

### Skill targets

| Target | Scope | 預設安裝位置 |
|---|---|---|
| `codex` | 使用者 | `~/.codex/skills/` |
| `claude` | 使用者 | `~/.claude/skills/` |
| `cursor` | 目前專案 | `.cursor/skills/` |
| `vscode`, `copilot` | 目前專案 | `.github/skills/` |
| `project` | 目前專案 | `.skills/` |
| `opencode` | 使用者 | `~/.config/opencode/skills/` |
| `opencode-project` | 目前專案 | `.opencode/skills/` |
| `goose` | 使用者 | `~/.config/goose/skills/` |
| `amp` | 使用者 | `~/.amp/skills/` |
| `letta` | 使用者 | `~/.letta/skills/` |
| `gemini` | 使用者 | `~/.gemini/skills/` |

在 Bash 環境中，`goose` 與 `opencode` 會優先使用 `XDG_CONFIG_HOME`。所有 project scope 路徑都以執行安裝器時的目前目錄為基準。

## 安裝單一元件

省略 Name 會安裝指定 Type 的全部元件；提供 Name 則只安裝一個。

### Windows PowerShell

單一 Skill：

```powershell
powershell -ExecutionPolicy Bypass -NoProfile -Command '$s = irm https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.ps1; & ([scriptblock]::Create($s)) -Target codex -Type skill -Name python-development'
```

單一 Agent：

```powershell
powershell -ExecutionPolicy Bypass -NoProfile -Command '$s = irm https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.ps1; & ([scriptblock]::Create($s)) -Target codex -Type agent -Name code-reviewer'
```

### Linux／macOS

單一 Skill：

```bash
curl -fsSL https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.sh | bash -s -- --target codex --type skill --name python-development
```

單一 Agent：

```bash
curl -fsSL https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.sh | bash -s -- --target codex --type agent --name code-reviewer
```

### 從本機 checkout 安裝

```powershell
git clone https://github.com/HsinPu/Autoverse-Ai-Agent-Skills.git
cd Autoverse-Ai-Agent-Skills

.\scripts\install.ps1 -Target codex -Type skill -SourceDir .
.\scripts\install.ps1 -Target codex -Type agent -SourceDir .
```

```bash
git clone https://github.com/HsinPu/Autoverse-Ai-Agent-Skills.git
cd Autoverse-Ai-Agent-Skills

bash scripts/install.sh --target codex --type skill --source-dir .
bash scripts/install.sh --target codex --type agent --source-dir .
```

### 安裝器選項

| 用途 | PowerShell | Bash | 說明 |
|---|---|---|---|
| 目標平台 | `-Target` | `--target` | 必填 |
| 元件類型 | `-Type skill\|agent` | `--type skill\|agent` | 預設為 Skill，建議明確填寫 |
| 單一元件 | `-Name` | `--name` | 省略即安裝該類型全部內容 |
| Git branch | `-Branch` | `--branch` | 預設 `main` |
| GitHub repository | `-Repo` | `--repo` | 預設本 repository |
| 自訂安裝位置 | `-InstallDir` | `--dir` | 覆蓋 target 的預設路徑 |
| 本機來源 | `-SourceDir` | `--source-dir` | 從 checkout 安裝，不下載 archive |
| 預演 | `-DryRun` | `--dry-run` | 只顯示計畫，不寫入 |
| 強制覆蓋 | `-Force` | `--force` | 明確略過 ownership 保護 |

相容舊參數：PowerShell 的 `-Agent` 是 `-Target` alias、`-Skill` 是 `-Name` alias；Bash 支援 `--agent`、`--skill` 與 `--agent-profile`。新腳本建議使用 `Target + Type + Name`。

## 安全更新與覆蓋保護

更新不需要先刪除舊版本；重新執行同一條安裝命令即可。安裝器會依 ownership metadata 判斷是否能安全更新。

| 狀態 | 安裝器行為 |
|---|---|
| 目標不存在 | 正常安裝 |
| metadata 與目前 repository、元件、名稱及 target 相符 | 原地更新 |
| 舊 Skill metadata 與新內容身份完整吻合 | 執行一次 `migrate-update` |
| 同名內容沒有 metadata | 拒絕覆蓋 |
| metadata 無效、來源不同或身份不符 | 拒絕覆蓋 |
| 明確使用 Force | 執行 `force-replace` |

Ownership metadata：

- Skill：`<skill>/.skill-meta.json`，比對 `repo + component + name + target`。
- Agent：`<agent-file>.autoverse.json`，除上述欄位外再比對 `id + adapter`。
- 全量 Agent 安裝會先預檢整批目標；只要一個衝突，就會在開始寫入前停止。
- 舊版 Skill 只有在 repository、舊欄位，以及 `name`、`source/reference-source`、`license/previous-license` 都吻合時才會遷移。

先用 dry run 查看更新計畫：

```powershell
.\scripts\install.ps1 -Target codex -Type agent -SourceDir . -DryRun
```

```bash
bash scripts/install.sh --target codex --type agent --source-dir . --dry-run
```

> [!WARNING]
> `-Force`／`--force` 會繞過同名內容的 ownership 保護。只有在你已確認目標內容可以被 Autoverse 取代並完成必要備份後才使用。

## 如何使用 Agent

安裝完成後，Codex 會從 `~/.codex/agents/` 或專案的 `.codex/agents/` 讀取 custom Agents；Claude Code 則讀取對應的 `.claude/agents/`。

- 系統可依任務內容與 Agent 的 `description` 選擇是否委派。
- 你也可以直接指定角色，例如：「請使用 `code-reviewer` 檢查目前變更」。
- Repository 內的 `AGENTS.md` 可以補充自動選擇、委派範圍與驗證規則。
- 若安裝後目前工作階段尚未出現新 Agent，請開啟新的工作階段或重新啟動對應工具。

從本機 checkout 確認 Autoverse 已安裝的 Codex Agents：

```bash
node autoverse-cli.js list --installed --type agent --target codex
```

CLI 只列出同時具有 adapter 與 Autoverse ownership sidecar 的檔案；它用來確認安裝結果，不等同於檢查目前已開啟的 Codex／Claude 工作階段是否重新載入。

平台格式可參考 [OpenAI Codex Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents) 與 [Claude Code Subagents](https://code.claude.com/docs/en/sub-agents)。

## Catalog CLI

`autoverse-cli.js` 提供離線 catalog 搜尋與安裝狀態查詢，需要 Node.js 16 或更新版本。目前請直接從 repository checkout 執行。

### Commands

| Command | Alias | 用途 |
|---|---|---|
| `list` | `ls` | 列出 Skills 或 Agents |
| `search <query>` | `s` | 搜尋名稱、描述與 tags |
| `info <name>` | — | 顯示單一項目的完整資訊 |

### Options

| Option | 用途 |
|---|---|
| `--type skill\|agent` | 選擇 catalog 類型，預設 Skill |
| `--category <category>` | 只顯示指定分類 |
| `--installed` | 列出 target 安裝位置中的元件；Agent 另要求 ownership sidecar |
| `--target <target>` | 指定安裝平台 |
| `--all` | 搭配 `list --installed`，列出該類型所有支援 targets 的安裝結果 |
| `--help` | 顯示說明 |

### Examples

```bash
# Skills
node autoverse-cli.js list
node autoverse-cli.js search "python development"
node autoverse-cli.js info python-development
node autoverse-cli.js list --installed --type skill --target codex
node autoverse-cli.js list --installed --type skill --all

# Agents
node autoverse-cli.js list --type agent --category quality-assurance
node autoverse-cli.js search "incident debugger" --type agent
node autoverse-cli.js info code-reviewer --type agent
node autoverse-cli.js list --installed --type agent --target codex
```

Catalog 來源分別是 [skills.json](skills.json) 與 [agents.json](agents.json)。

## Agents

每個 Agent 都有唯一 role、清楚的使用時機、權限模式、相關 Skills，以及固定的 `Role → Task → Constraints → Output` prompt 結構。完整 metadata 以 [agents.json](agents.json) 為準。

<details>
<summary><strong>展開 24 類、134 個 Agents 的完整索引</strong></summary>

<!-- AGENT_SUMMARY_START -->
| Category | Count | Agents |
|---|---:|---|
| `analysis` | 4 | [`business-analyst`](agents/business-analyst.md), [`quant-analyst`](agents/quant-analyst.md), [`reverse-engineer`](agents/reverse-engineer.md), [`startup-analyst`](agents/startup-analyst.md) |
| `architecture` | 10 | [`architect`](agents/architect.md), [`architect-review`](agents/architect-review.md), [`backend-architect`](agents/backend-architect.md), [`database-architect`](agents/database-architect.md), [`dotnet-architect`](agents/dotnet-architect.md), [`event-sourcing-architect`](agents/event-sourcing-architect.md), [`graphql-architect`](agents/graphql-architect.md), [`legacy-modernizer`](agents/legacy-modernizer.md), [`monorepo-architect`](agents/monorepo-architect.md), [`seo-structure-architect`](agents/seo-structure-architect.md) |
| `artificial-intelligence` | 6 | [`ai-engineer`](agents/ai-engineer.md), [`eval-judge`](agents/eval-judge.md), [`eval-orchestrator`](agents/eval-orchestrator.md), [`model-advisor`](agents/model-advisor.md), [`prompt-crafter`](agents/prompt-crafter.md), [`prompt-engineer`](agents/prompt-engineer.md) |
| `business-operations` | 1 | [`hr-pro`](agents/hr-pro.md) |
| `cloud-infrastructure` | 6 | [`cloud-architect`](agents/cloud-architect.md), [`hybrid-cloud-architect`](agents/hybrid-cloud-architect.md), [`kubernetes-architect`](agents/kubernetes-architect.md), [`network-engineer`](agents/network-engineer.md), [`service-mesh-expert`](agents/service-mesh-expert.md), [`terraform-specialist`](agents/terraform-specialist.md) |
| `commerce` | 1 | [`payment-integration`](agents/payment-integration.md) |
| `creative` | 2 | [`gallery-researcher`](agents/gallery-researcher.md), [`image-generator`](agents/image-generator.md) |
| `customer-operations` | 1 | [`customer-support`](agents/customer-support.md) |
| `data` | 5 | [`data-engineer`](agents/data-engineer.md), [`data-scientist`](agents/data-scientist.md), [`database-admin`](agents/database-admin.md), [`sql-pro`](agents/sql-pro.md), [`vector-database-engineer`](agents/vector-database-engineer.md) |
| `developer-experience` | 1 | [`dx-optimizer`](agents/dx-optimizer.md) |
| `development` | 28 | [`bash-pro`](agents/bash-pro.md), [`blockchain-developer`](agents/blockchain-developer.md), [`c-pro`](agents/c-pro.md), [`cpp-pro`](agents/cpp-pro.md), [`csharp-pro`](agents/csharp-pro.md), [`debugger`](agents/debugger.md), [`django-pro`](agents/django-pro.md), [`elixir-pro`](agents/elixir-pro.md), [`fastapi-pro`](agents/fastapi-pro.md), [`flutter-expert`](agents/flutter-expert.md), [`frontend-developer`](agents/frontend-developer.md), [`golang-pro`](agents/golang-pro.md), [`haskell-pro`](agents/haskell-pro.md), [`ios-developer`](agents/ios-developer.md), [`java-pro`](agents/java-pro.md), [`javascript-pro`](agents/javascript-pro.md), [`julia-pro`](agents/julia-pro.md), [`minecraft-bukkit-pro`](agents/minecraft-bukkit-pro.md), [`mobile-developer`](agents/mobile-developer.md), [`php-pro`](agents/php-pro.md), [`posix-shell-pro`](agents/posix-shell-pro.md), [`python-pro`](agents/python-pro.md), [`ruby-pro`](agents/ruby-pro.md), [`rust-pro`](agents/rust-pro.md), [`scala-pro`](agents/scala-pro.md), [`temporal-python-pro`](agents/temporal-python-pro.md), [`typescript-pro`](agents/typescript-pro.md), [`unity-developer`](agents/unity-developer.md) |
| `documentation` | 9 | [`api-documenter`](agents/api-documenter.md), [`c4-code`](agents/c4-code.md), [`c4-component`](agents/c4-component.md), [`c4-container`](agents/c4-container.md), [`c4-context`](agents/c4-context.md), [`docs-architect`](agents/docs-architect.md), [`mermaid-expert`](agents/mermaid-expert.md), [`reference-builder`](agents/reference-builder.md), [`tutorial-engineer`](agents/tutorial-engineer.md) |
| `embedded-systems` | 2 | [`arm-cortex-expert`](agents/arm-cortex-expert.md), [`firmware-analyst`](agents/firmware-analyst.md) |
| `governance` | 4 | [`legal-advisor`](agents/legal-advisor.md), [`policy-enforcer`](agents/policy-enforcer.md), [`review-policy-author`](agents/review-policy-author.md), [`risk-manager`](agents/risk-manager.md) |
| `machine-learning` | 2 | [`ml-engineer`](agents/ml-engineer.md), [`mlops-engineer`](agents/mlops-engineer.md) |
| `marketing` | 11 | [`content-marketer`](agents/content-marketer.md), [`seo-authority-builder`](agents/seo-authority-builder.md), [`seo-cannibalization-detector`](agents/seo-cannibalization-detector.md), [`seo-content-auditor`](agents/seo-content-auditor.md), [`seo-content-planner`](agents/seo-content-planner.md), [`seo-content-refresher`](agents/seo-content-refresher.md), [`seo-content-writer`](agents/seo-content-writer.md), [`seo-keyword-strategist`](agents/seo-keyword-strategist.md), [`seo-meta-optimizer`](agents/seo-meta-optimizer.md), [`seo-snippet-hunter`](agents/seo-snippet-hunter.md), [`social-publishing-publisher`](agents/social-publishing-publisher.md) |
| `operations` | 7 | [`deploy-with-verification`](agents/deploy-with-verification.md), [`deployment-engineer`](agents/deployment-engineer.md), [`devops-troubleshooter`](agents/devops-troubleshooter.md), [`error-detective`](agents/error-detective.md), [`incident-responder`](agents/incident-responder.md), [`observability-engineer`](agents/observability-engineer.md), [`prod-logs-health-check`](agents/prod-logs-health-check.md) |
| `orchestration` | 10 | [`conductor-validator`](agents/conductor-validator.md), [`context-manager`](agents/context-manager.md), [`implement`](agents/implement.md), [`orchestrate`](agents/orchestrate.md), [`session-end`](agents/session-end.md), [`session-start`](agents/session-start.md), [`task-executor`](agents/task-executor.md), [`team-debugger`](agents/team-debugger.md), [`team-implementer`](agents/team-implementer.md), [`team-lead`](agents/team-lead.md) |
| `performance` | 2 | [`database-optimizer`](agents/database-optimizer.md), [`performance-engineer`](agents/performance-engineer.md) |
| `quality-assurance` | 10 | [`code-review-preshipment`](agents/code-review-preshipment.md), [`code-reviewer`](agents/code-reviewer.md), [`playwright`](agents/playwright.md), [`qa`](agents/qa.md), [`receipt-verifier`](agents/receipt-verifier.md), [`review`](agents/review.md), [`tdd-orchestrator`](agents/tdd-orchestrator.md), [`team-reviewer`](agents/team-reviewer.md), [`test-automator`](agents/test-automator.md), [`ui-visual-validator`](agents/ui-visual-validator.md) |
| `research` | 1 | [`search-specialist`](agents/search-specialist.md) |
| `sales` | 1 | [`sales-automator`](agents/sales-automator.md) |
| `security` | 6 | [`backend-security-coder`](agents/backend-security-coder.md), [`frontend-security-coder`](agents/frontend-security-coder.md), [`malware-analyst`](agents/malware-analyst.md), [`mobile-security-coder`](agents/mobile-security-coder.md), [`security-auditor`](agents/security-auditor.md), [`threat-modeling-expert`](agents/threat-modeling-expert.md) |
| `user-experience` | 4 | [`accessibility-expert`](agents/accessibility-expert.md), [`design-system-architect`](agents/design-system-architect.md), [`ui-designer`](agents/ui-designer.md), [`ui-ux-designer`](agents/ui-ux-designer.md) |
<!-- AGENT_SUMMARY_END -->

</details>

## Skills

185 個 Skills 分成 7 類。每個 package 以 `SKILL.md` 為入口，相關 references、scripts 與 assets 保留在同一資料夾中。

| Category | Count | 說明 |
|---|---:|---|
| `development` | 148 | 軟體開發、架構、框架、測試、安全、資料與平台工程 |
| `productivity` | 20 | 規劃、檔案整理、文件與日常工作流程 |
| `browser-automation` | 7 | Browser automation、DevTools、Playwright 與 webapp testing |
| `coding-agents-ides` | 5 | Agent、Skill、MCP 與 coding-agent 工作流程 |
| `cli-utilities` | 3 | Terminal、hotkey 與 command palette |
| `communication` | 1 | 人類可讀的文字調整與溝通 |
| `search-research` | 1 | Web research 與資料蒐集 |

請從 [skills.json](skills.json) 瀏覽 metadata，或直接查看 [skills/](skills/) 內的完整 package。

## 專案結構

```text
Autoverse-Ai-Agent-Skills/
├─ AGENTS.md                         # Repository 內的 Agent 路由與驗證規則
├─ agents/
│  └─ <role>.md                     # Canonical Agent definitions
├─ adapters/
│  ├─ codex/<role>.toml             # Generated Codex adapters
│  └─ claude/<role>.md              # Generated Claude Code adapters
├─ skills/
│  └─ <name>/
│     ├─ SKILL.md                   # Skill entrypoint
│     ├─ references/                # Optional
│     ├─ scripts/                   # Optional
│     └─ assets/                    # Optional
├─ agents.json                      # Agent catalog
├─ skills.json                      # Skill catalog
├─ autoverse-cli.js                 # Catalog CLI
├─ scripts/
│  ├─ install.cmd                   # Windows CMD wrapper
│  ├─ install.ps1                   # Windows installer
│  ├─ install.sh                    # Linux／macOS installer
│  ├─ generate-agent-adapters.js
│  ├─ generate-agent-catalog.js
│  ├─ sync-agent-reference.js
│  ├─ validate-catalog.js
│  └─ data/wshobson-agent-inventory.json
└─ .github/workflows/validate.yml   # CI validation and CLI smoke tests
```

`agents/<role>.md` 是 Agent 的唯一人工維護來源。請勿直接修改 `adapters/`；兩套平台 adapter 與 `agents.json` 都由 scripts 產生。

## 開發與驗證

需要 Node.js 16 或更新版本。

```bash
# 從 canonical Agents 重建 Codex／Claude adapters 與 agents.json
npm run generate:agents

# 更新 wshobson/agents reference tree 與逐項 ledger
npm run sync:agent-reference

# 驗證 catalogs、frontmatter、來源、授權、adapters、ledger 與 README counts
npm run validate

# 預覽 npm package 會包含的檔案
npm pack --dry-run
```

CI 會在 push 到 `main` 與每個 pull request 上使用 Node.js 20 執行 `npm run validate`，並 smoke-test CLI 的 help、list、search 與 info。

### 新增或修改 Agent

1. 編輯 `agents/<role>.md`；role 與檔名必須唯一且使用 lowercase hyphen-case。
2. 保留所需 frontmatter，以及 `# Role`、`# Task`、`# Constraints`、`# Output` 四個頂層章節。
3. 執行 `npm run generate:agents` 產生 adapters 與 catalog。
4. 執行 `npm run validate`。

### 新增或修改 Skill

1. 編輯 `skills/<name>/SKILL.md`，並將所需 references、scripts、assets 放在同一 package。
2. 確認 `name`、`author`、`source`、`license` 與 catalog metadata 一致。
3. 同步更新 `skills.json`，再執行 `npm run validate`。

## 來源、改寫與授權政策

- 所有 Agents 與 Skills 的正式 `source` 都是 `HsinPu/Autoverse-Ai-Agent-Skills`，作者為 HsinPu。
- 外部專案只作為研究、coverage 與設計參考，使用 `reference` 或 `reference-source` 欄位獨立記錄，不取代本專案的正式來源。
- Agent catalog 參考 [wshobson/agents](https://github.com/wshobson/agents) 的角色名稱、plugin 路徑與高層責任；prompt 內容經過重新設計與加強，不是原文完整複製。
- 同名上游定義會合併為一份較完整的 canonical Agent；199 個 reference paths、tree SHA 與合併結果保存在 [wshobson-agent-inventory.json](scripts/data/wshobson-agent-inventory.json)。
- Repository 與全部 134 個 Agents 採 Apache-2.0。Skills 的個別授權以各自 `SKILL.md` 與 `skills.json` 為準；目前 184 個為 Apache-2.0，`karpathy-guidelines` 保留 MIT 授權與外部 reference metadata。

## 疑難排解

<details>
<summary><strong>出現 Target is required</strong></summary>

安裝器不使用隱性平台預設。請加入 `-Target codex` 或 `--target codex`；若要安裝 project scope Agent，改用 `codex-project` 或 `claude-project`。

</details>

<details>
<summary><strong>出現 Refusing to replace ... ownership metadata does not match</strong></summary>

這表示同名路徑已存在，但 ownership metadata 缺失、無效、來自其他 repository，或 component／name／target／Agent identity 不一致。

先檢查 Skill 內的 `.skill-meta.json`，或 Agent 旁的 `.autoverse.json` sidecar，確認現有內容的來源。不要直接刪除或覆蓋別人的安裝。只有在確定應由 Autoverse 取代並完成備份後，才使用 `-Force`／`--force`。

</details>

<details>
<summary><strong>安裝後 Codex／Claude Code 沒有顯示新 Agent</strong></summary>

確認 target 與實際使用的平台、scope 相符，再檢查 adapter 是否位於對應的 `agents/` 目錄。已開啟的工作階段可能尚未重新載入設定，請開新工作階段或重新啟動工具。

也可以執行：

```bash
node autoverse-cli.js list --installed --type agent --target codex
```

</details>

<details>
<summary><strong>沒有 Node.js，還能安裝嗎？</strong></summary>

可以。PowerShell 與 Bash 安裝器不需要 Node.js。只有 catalog CLI、產生 adapters、驗證與 package 預覽需要 Node.js 16 或更新版本。

</details>

<details>
<summary><strong>Bash 安裝器回報缺少 command</strong></summary>

確認系統已安裝 Bash、`curl`、`tar` 與 `mktemp`。如果只想從本機 checkout 安裝，仍需 Bash，但不需要下載 GitHub archive。

</details>

## 參與貢獻

歡迎提出新 Agent、Skill、平台 adapter 改善、文件修正與驗證規則。

1. 先到 [Issues](https://github.com/HsinPu/Autoverse-Ai-Agent-Skills/issues) 說明需求或問題。
2. Fork repository 並建立聚焦的 branch。
3. 只修改 canonical source；Agent 變更不要直接編輯 generated adapters。
4. 執行 `npm run generate:agents`（若 Agent 有變更）與 `npm run validate`。
5. 建立 [Pull Request](https://github.com/HsinPu/Autoverse-Ai-Agent-Skills/pulls)，附上變更目的與驗證結果。

## License

Repository 以 [Apache License 2.0](LICENSE) 授權，Copyright © 2026 HsinPu。個別 Skill 若保留不同授權，會在該 package 的 metadata 中明確標示。

---

Maintained by [HsinPu](https://github.com/HsinPu) · [Issues](https://github.com/HsinPu/Autoverse-Ai-Agent-Skills/issues) · [Actions](https://github.com/HsinPu/Autoverse-Ai-Agent-Skills/actions)
