# Autoverse AI Agent Skills

[![Validate](https://github.com/HsinPu/Autoverse-Ai-Agent-Skills/actions/workflows/validate.yml/badge.svg)](https://github.com/HsinPu/Autoverse-Ai-Agent-Skills/actions/workflows/validate.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
![Skills](https://img.shields.io/badge/Skills-189-7c3aed)
![Agents](https://img.shields.io/badge/Agents-223-2563eb)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D16-339933?logo=nodedotjs&logoColor=white)

由 **HsinPu** 維護的開源 AI Agent 與 Skill catalog，提供可直接安裝的 Codex、Claude Code、Cursor、VS Code／GitHub Copilot、OpenCode Agents 與 Skills，並包含安全更新機制及本機 catalog 查詢 CLI。

這個專案不是另一套 Agent runtime 或 orchestration framework；它專注在可攜、可查詢、可驗證的角色與能力定義，讓現有 coding agent 能直接使用。

[快速開始](#快速開始) · [Agents](#agents) · [Skills](#skills) · [影片製作工作流](#影片製作工作流) · [Catalog CLI](#catalog-cli) · [開發與驗證](#開發與驗證) · [回報問題](https://github.com/HsinPu/Autoverse-Ai-Agent-Skills/issues)

## 目錄

- [快速開始](#快速開始)
- [專案內容](#專案內容)
- [安裝目標](#安裝目標)
- [安裝單一元件](#安裝單一元件)
- [安全更新與覆蓋保護](#安全更新與覆蓋保護)
- [如何使用 Agent](#如何使用-agent)
- [影片製作工作流](#影片製作工作流)
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
powershell -ExecutionPolicy Bypass -NoProfile -Command '$s = irm https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.ps1; $installer = [scriptblock]::Create($s); & $installer -Target codex -Type skill; & $installer -Target codex -Type agent -EnableAutoDelegation'
```

Linux／macOS：

```bash
curl -fsSL https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.sh | bash -s -- --target codex --type skill && curl -fsSL https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.sh | bash -s -- --target codex --type agent --enable-auto-delegation
```

這組命令會安裝全部 189 個 Skills、223 個 Agents，並啟用不依賴專案 `AGENTS.md` 的全域主動委派。

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

任何平台的全量 Agent 安裝都會自動帶入該平台可讀取的 `subagent-architecture` Skill；單一 Agent 安裝則不會，除非同時啟用下一節的全域主動委派。

### 安裝全部 Agents 並啟用全域主動委派

這是選用功能，不依賴每個專案的 `AGENTS.md`。Codex 會安全合併全域 `developer_instructions`；OpenCode 會把已安裝的 routing guidance 加入全域 `instructions`。

Windows PowerShell（Codex）：

```powershell
powershell -ExecutionPolicy Bypass -NoProfile -Command '$s = irm https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.ps1; & ([scriptblock]::Create($s)) -Target codex -Type agent -EnableAutoDelegation'
```

Linux／macOS（Codex）：

```bash
curl -fsSL https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.sh | bash -s -- --target codex --type agent --enable-auto-delegation
```

Windows PowerShell（OpenCode）：

```powershell
powershell -ExecutionPolicy Bypass -NoProfile -Command '$s = irm https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.ps1; & ([scriptblock]::Create($s)) -Target opencode -Type agent -EnableAutoDelegation'
```

Linux／macOS（OpenCode）：

```bash
curl -fsSL https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.sh | bash -s -- --target opencode --type agent --enable-auto-delegation
```

> [!NOTE]
> `-EnableAutoDelegation`／`--enable-auto-delegation` 只接受全域 `codex` 或 `opencode` Agent target。若偵測到使用者自行管理的衝突設定，安裝器會拒絕修改並提示手動合併，不會讓 Force 覆蓋它。

### 安裝到目前專案的所有工具

先切換到要安裝的專案／workspace 根目錄，再執行下列命令。`project` 不會尋找 Git root；它直接使用執行命令當下的工作目錄。

Windows PowerShell：

```powershell
powershell -ExecutionPolicy Bypass -NoProfile -Command '$s = irm https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.ps1; $installer = [scriptblock]::Create($s); & $installer -Target project -Type skill; & $installer -Target project -Type agent'
```

Linux／macOS：

```bash
curl -fsSL https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.sh | bash -s -- --target project --type skill && curl -fsSL https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.sh | bash -s -- --target project --type agent
```

這會建立 `.agents/skills` 與 Claude 相容鏡像 `.claude/skills`，並把五種 Agent adapter 分別寫入 `.codex/agents`、`.claude/agents`、`.cursor/agents`、`.github/agents`、`.opencode/agents`。

### 執行需求

| 功能 | 需求 |
|---|---|
| PowerShell 安裝器 | Windows PowerShell／PowerShell 與網路連線 |
| Bash 安裝器 | Bash、`curl`、`tar`、`mktemp`、`cksum` 與網路連線；安全合併既有 OpenCode JSON 時另需 Python 3 或 Node.js |
| Catalog CLI | Node.js 16 或更新版本 |
| 專案開發與驗證 | Node.js 16 或更新版本；CI 使用 Node.js 20 |

一般安裝 Skills 或 Agents **不需要 Node.js**；只有 Bash 要安全合併既有、自訂的 OpenCode JSON 時，需有 Python 3 或 Node.js 其中之一。如果不想直接執行遠端腳本，請先 clone repository、檢查 `scripts/install.ps1` 或 `scripts/install.sh`，再依照[本機安裝](#從本機-checkout-安裝)執行。

## 專案內容

| 類型 | 數量 | 用途 | Canonical source |
|---|---:|---|---|
| Skills | **189 Skills**／7 類 | 可重複使用的工作流程、規範、工具指引與領域知識 | `skills/<name>/SKILL.md` |
| Agents | 223／31 類 | 可委派的專業角色，包含任務、限制、權限與輸出契約 | `agents/<role>.md` |
| Codex adapters | 223 | Codex custom Agent 的 TOML 設定 | `adapters/codex/<role>.toml` |
| Claude adapters | 223 | Claude Code subagent 的 Markdown 設定 | `adapters/claude/<role>.md` |
| Cursor adapters | 223 | Cursor subagent 的 Markdown 設定 | `adapters/cursor/<role>.md` |
| Copilot adapters | 223 | VS Code／GitHub Copilot custom Agent 設定 | `adapters/copilot/<role>.agent.md` |
| OpenCode adapters | 223 | OpenCode `mode: subagent` 的 Markdown 設定 | `adapters/opencode/<role>.md` |
| wshobson reference ledger | 199 definitions | 保存原始角色集合的 reference path 與合併追蹤資料 | `scripts/data/wshobson-agent-inventory.json` |
| Additional Agent references | 106 paths／14 repositories | 保存在各 canonical Agent 的 `reference-*` metadata | `agents/<role>.md` |

各 adapter 會把 canonical `read-only`／`workspace-write` 權限轉成平台可理解的設定。例如 OpenCode 的唯讀角色會設定 `edit: deny` 與 `bash: deny`；Copilot 的唯讀角色只開放 `read`、`search`、`web`、`agent` tools。

<!-- AGENT_COUNT_START -->
目前共收錄 **223** 個不重複 Agents。
<!-- AGENT_COUNT_END -->

`wshobson/agents` ledger 的 199 份 definitions 內含 65 份同名角色變體，共形成 134 個上游角色名稱。內容級覆核後，198 份通用 definitions 對應 132 個 independently rewritten canonical Agents；RunAPI 的產品專屬 `task-executor` 則保留在 ledger 並明確標記為 `excluded`。另外 91 個 Agents 來自其餘十四個 reference repositories，加入前同樣會先比對名稱、職責邊界與 prompt 內容。

### Agent 與 Skill 的差別

| | Agent | Skill |
|---|---|---|
| 核心概念 | 一個可被委派任務的專業角色 | 一套可套用到任務的操作知識或工作流程 |
| 典型例子 | `code-reviewer`、`debugger`、`security-auditor` | `code-review`、`python-development`、`threat-modeling` |
| 安裝位置 | 各工具的 `agents/` 目錄；格式依平台不同 | 各工具支援的 `skills/<name>/SKILL.md` 目錄 |
| 安裝單位 | 單一 adapter 檔案與 ownership sidecar | 含 `SKILL.md`、references、scripts、assets 的資料夾 |

Agent 可以引用一個或多個相關 Skills；Skill 也能由主 Agent 直接使用，不必先建立 subagent。

## 安裝目標

安裝器只接受以下 targets；除了 `project` 之外都安裝到使用者層級。

| Target | Skill 預設位置 | Agent 預設位置 | Agent 格式 |
|---|---|---|---|
| `codex` | `$CODEX_HOME/skills/`（預設 `~/.codex/skills/`） | `$CODEX_HOME/agents/`（預設 `~/.codex/agents/`） | `<role>.toml` |
| `claude` | `~/.claude/skills/` | `~/.claude/agents/` | `<role>.md` |
| `cursor` | `~/.cursor/skills/` | `~/.cursor/agents/` | `<role>.md` |
| `vscode` | `~/.copilot/skills/` | `~/.copilot/agents/` | `<role>.agent.md` |
| `copilot` | `~/.copilot/skills/` | `~/.copilot/agents/` | `<role>.agent.md` |
| `opencode` | `~/.config/opencode/skills/` | `~/.config/opencode/agents/` | `<role>.md` |
| `project` | `<cwd>/.agents/skills/` + `<cwd>/.claude/skills/` | 五個平台各自的 project 目錄 | 依平台產生 |

`vscode` 是 `copilot` 的等價 alias；兩者使用同一組路徑與 `copilot` ownership identity，所以可交替執行更新。OpenCode 會優先採用官方 [custom directory](https://opencode.ai/docs/config/#custom-directory) 環境變數 `OPENCODE_CONFIG_DIR`；未設定時依序使用 `XDG_CONFIG_HOME/opencode` 或 `~/.config/opencode`。全域 `codex` target 跟隨 Codex 內建 `$skill-installer`：config、Skills 與 Agents 都以 `CODEX_HOME` 為根目錄，新 Skill 安裝到 `$CODEX_HOME/skills`，未設定時即 `~/.codex/skills`。若同名元件已由 Autoverse 安全安裝在 `~/.agents/skills`，安裝器仍會原地更新，避免建立重複副本。

### `project` target 的實際位置

`project` 是 Autoverse 提供的整合 scope，不是另一種 Agent 格式。預設 root 是安裝命令執行當下的工作目錄；請先 `cd` 到專案或 VS Code workspace 根目錄。若提供 `-InstallDir`／`--dir`，該值會被視為 project root，再附加以下目錄：

```text
<project-root>/
├─ .agents/skills/       # Codex、Cursor、VS Code/Copilot、OpenCode
├─ .claude/skills/       # Claude Code compatibility mirror
├─ .codex/agents/        # Codex TOML
├─ .claude/agents/       # Claude Markdown
├─ .cursor/agents/       # Cursor Markdown
├─ .github/agents/       # VS Code/Copilot .agent.md
└─ .opencode/agents/     # OpenCode Markdown
```

Skills 有可共用的 Agent Skills package 結構，但 custom Agent 並沒有跨工具通用格式；因此 project Agent 安裝會從同一份 canonical source 產生五種 adapter。安裝器會先預檢所有目的地，任一重名或 ownership 衝突都會在開始寫入前停止。

`project` 的 `.agents/skills` 依據 [Codex Skills](https://learn.chatgpt.com/docs/build-skills) 所列 repository discovery 位置；全域 `codex` target 則跟隨內建 `$skill-installer` 的 `$CODEX_HOME/skills` 安裝行為。其餘路徑與格式依據各平台官方文件：[Codex Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)、[Claude Skills](https://code.claude.com/docs/en/skills)、[Claude Subagents](https://code.claude.com/docs/en/sub-agents)、[Cursor Skills](https://cursor.com/docs/skills.md)、[Cursor Subagents](https://cursor.com/docs/subagents.md)、[VS Code Agent Skills](https://code.visualstudio.com/docs/agent-customization/agent-skills)、[VS Code Custom Agents](https://code.visualstudio.com/docs/agent-customization/custom-agents)、[GitHub Copilot Custom Agents](https://docs.github.com/en/copilot/reference/custom-agents-configuration)、[OpenCode Skills](https://opencode.ai/docs/skills)、[OpenCode Agents](https://opencode.ai/docs/agents/)。

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
.\scripts\install.ps1 -Target codex -Type agent -SourceDir . -EnableAutoDelegation
```

```bash
git clone https://github.com/HsinPu/Autoverse-Ai-Agent-Skills.git
cd Autoverse-Ai-Agent-Skills

bash scripts/install.sh --target codex --type skill --source-dir .
bash scripts/install.sh --target codex --type agent --source-dir . --enable-auto-delegation
```

### 安裝器選項

| 用途 | PowerShell | Bash | 說明 |
|---|---|---|---|
| 目標平台 | `-Target` | `--target` | 必填 |
| 元件類型 | `-Type skill\|agent` | `--type skill\|agent` | 預設為 Skill，建議明確填寫 |
| 單一元件 | `-Name` | `--name` | 省略即安裝該類型全部內容 |
| Git branch | `-Branch` | `--branch` | 預設 `main` |
| GitHub repository | `-Repo` | `--repo` | 預設本 repository |
| 自訂安裝位置 | `-InstallDir` | `--dir` | 一般 target：直接目的地；`project`：project root |
| 本機來源 | `-SourceDir` | `--source-dir` | 從 checkout 安裝，不下載 archive |
| 全域主動委派 | `-EnableAutoDelegation` | `--enable-auto-delegation` | 僅全域 Codex／OpenCode Agent target；同時安裝 companion Skill |
| 預演 | `-DryRun` | `--dry-run` | 只顯示計畫，不寫入 |
| 強制覆蓋 | `-Force` | `--force` | 明確略過 ownership 保護 |

相容舊參數：PowerShell 的 `-Agent` 是 `-Target` alias、`-Skill` 是 `-Name` alias；Bash 支援 `--agent`、`--skill` 與 `--agent-profile`。新腳本建議使用 `Target + Type + Name`。

## 安全更新與覆蓋保護

更新不需要先刪除舊版本；重新執行同一條安裝命令即可。安裝器會依 ownership metadata 判斷是否能安全更新。

| 狀態 | 安裝器行為 |
|---|---|
| 目標不存在 | 正常安裝 |
| metadata 與目前 repository、元件、名稱及 target 相符 | 安全更新 |
| Agent 檔缺失，但 sidecar identity 完整吻合 | 執行 `repair` |
| 舊 Skill metadata 與新內容身份完整吻合 | 執行一次 `migrate-update` |
| 同名內容沒有 metadata | 拒絕覆蓋 |
| metadata 無效、來源不同或身份不符 | 拒絕覆蓋 |
| 明確使用 Force | 執行 `force-replace` |

Ownership metadata：

- Skill：`<skill>/.skill-meta.json`，比對 `repo + component + name + target`。
- Agent：`<agent-file>.autoverse.json`，除上述欄位外再比對 `id + adapter`。
- Agent 與 sidecar 會先寫入同目錄暫存檔，再以 atomic replace 更新；不會沿著 symbolic link 或 hard link 改寫安裝目錄外的檔案。
- 全量 Skill 安裝也會先預檢整批目標；只要一個 ownership 衝突，就不會先更新前面的 Skill 再中途失敗。
- 全量 Agent 安裝會先預檢整批目標；只要一個衝突，就會在開始寫入前停止。
- 所有平台的全量 Agent 安裝都會先預檢並安裝 `subagent-architecture`；一般 target 的 `InstallDir`／`--dir` 只覆蓋 Agent 位置，companion Skill 仍使用該 runtime 的標準 Skill 位置。`project` 則以同一 project root 建立完整多目的地計畫。
- 舊版 Skill 只有在 repository、舊欄位，以及 `name`、`source/reference-source`、`license/previous-license` 都吻合時才會遷移。

啟用全域主動委派時：

- Codex 只管理 `~/.codex/config.toml` 內的 `AUTOVERSE_AUTO_DELEGATION` marker 區塊；若已有區塊外的 `developer_instructions` 就停止。
- OpenCode 只對 strict UTF-8 JSON 的全域 `opencode.json` 合併一個 guidance 路徑；其根目錄依序採用 `OPENCODE_CONFIG_DIR`、`XDG_CONFIG_HOME/opencode` 或 `~/.config/opencode`。JSONC、無效型別、多份衝突 config 或重複 JSON key 會停止並要求手動合併。Bash 在既有自訂 config 上需要 Python 3 或 Node.js 做 strict validation；安裝器自己建立的最小 config 可在兩者皆無時安全重跑。
- 修改既有全域 config 前會留下 `*.autoverse-backup-*` 備份；`Force` 不會繞過這些設定保護。
- 安裝計畫完成後若全域 config 又被其他程式修改，安裝器會在 replace 前停止，避免用舊快照蓋掉新設定。

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

安裝完成後，各工具會從上方表格列出的使用者目錄讀取 Agents；`project` 則寫入各工具自己的 project discovery 目錄。Cursor 不會直接使用 Codex TOML，Copilot 也不會直接使用 OpenCode frontmatter；這正是 repository 保留 generated adapters 的原因。

- 系統可依任務內容與 Agent 的 `description` 選擇是否委派。
- 你也可以直接指定角色，例如：「請使用 `code-reviewer` 檢查目前變更」。
- 安裝時使用全域主動委派選項後，AI 會在任務包含兩個以上可獨立處理的工作流時主動評估子代理，不需要每個專案另外提供 `AGENTS.md`。
- 專案自己的 `AGENTS.md` 仍可選擇性補充該專案的限制，但不是 Autoverse Agents 的載入或委派前提。
- 若安裝後目前工作階段尚未出現新 Agent，請開啟新的工作階段或重新啟動對應工具。

啟用全域主動委派後，平常直接描述任務即可，例如：「請重新設計登入流程，同時檢查安全與測試覆蓋，完成後整合結果。」主 Agent 會依角色描述判斷是否值得拆成子代理。需要固定角色時也可以明確指定：Codex 可說「請委派 `code-reviewer` 檢查目前變更」；OpenCode 可輸入 `@code-reviewer 檢查目前變更`。

從本機 checkout 確認 Autoverse 已安裝的 Codex Agents：

```bash
node autoverse-cli.js list --installed --type agent --target codex
node autoverse-cli.js list --installed --type agent --target opencode
node autoverse-cli.js list --installed --type agent --target project
```

CLI 只列出同時具有 adapter 與有效 Autoverse ownership sidecar 的檔案；它用來確認安裝結果，不等同於檢查目前已開啟的工具是否重新載入。

平台格式的官方連結集中在 [`project` target 的實際位置](#project-target-的實際位置)一節。

## 影片製作工作流

`video-production-workflow` 是一套工具中立、具審批閘門且可恢復執行的完整影片流程。它不綁定特定生成模型或剪輯器；可以由一個 Agent 依序執行，也可以由 `video-director` 統籌多個專業角色。

```text
brief → creative treatment → script → storyboard／shot list
      → production design／camera-lighting／sound／continuity／production plan
      → assets → edit／sound／compose → review／delivery
```

| 角色 | 主要責任 | 何時加入 |
|---|---|---|
| `video-director` | 統籌創意、角色路由、階段閘門、修改仲裁與最終審查 | 完整影片專案的預設入口 |
| `video-producer` | 排程、預算、權利、供應商、素材與 checkpoint 狀態 | 有外部素材、付費生成、多人或交期限制時 |
| `creative-director` | 跨媒介創意願景、品牌一致性與設計到製作的交接 | 網站、品牌、活動與影片需要共用創意方向時 |
| `screenwriter` | 故事結構、可拍攝場景、動作、對白／旁白與改稿 | 需要敘事腳本或長短篇改編時 |
| `storyboard-artist` | 分鏡、shot list、鏡位、運鏡、節奏與場面調度 | 腳本核准後、產生或拍攝素材前 |
| `production-designer` | 場景、環境、道具、服裝、材質、標示與可製作的視覺世界規格 | 世界觀、品牌場景或大量資產需要一致設計時 |
| `cinematographer` | 鏡頭、焦段、運鏡、對焦、燈光、曝光、拍攝／render 規格與影像技術審查 | 攝影、燈光、renderer 或多 setup 執行複雜時 |
| `visual-continuity-supervisor` | 角色、服裝、產品、道具、場景、時間與畫面狀態連續性 | 多鏡頭、跨場景或生成內容容易漂移時 |
| `sound-designer` | 對白、旁白、環境、foley、音效、音樂關係、cue、stem、mix 與聲音 QC | 聲音來源多、需生成／錄製、混音或 loudness 管理時 |
| `video-editor` | 素材選擇、timeline、節奏、音畫同步、字幕／圖卡、版本化 cut 與交付 QC | 多素材、反覆修改、長篇或交付規格複雜時 |

執行模式依專案大小調整：短片可由 `video-director` 單獨依序完成；一般專案由導演搭配製片，再按需要加入編劇、分鏡、continuity 與剪輯；視覺世界、攝影燈光或聲音較複雜時，再加入 `production-designer`、`cinematographer` 或 `sound-designer`。長篇、多場景或 recurring-character 專案可完整使用九個影片專職角色，只有品牌活動或跨媒介創意系統才額外加入 `creative-director`。若目前工具不支援 subagent，主 Agent 仍會依相同階段、產物與審批點逐步執行，不會跳過治理要求。

新專案可從 [`skills/video-production-workflow/assets/project-template`](skills/video-production-workflow/assets/project-template) 複製完整模板，預設工作目錄為 `video-projects/<project-id>/`。模板包含 brief、treatment、script、shot、production design、camera-lighting、sound、素材、edit 與 review 契約；每份 artifact 都有版本、owner、輸入、決策與核准狀態，方便中斷後從第一個未驗證階段繼續。

以下節點必須明確核准：creative treatment、script、storyboard 與適用的 production-design／camera-lighting／sound／continuity／production plans、付費或大量生成、會改變成本／權利／隱私的 provider 替換，以及最終 render／發布。前一階段的核准不會自動授權後續外部操作。

可直接這樣要求主 Agent：

```text
使用 video-production-workflow 規劃這支影片，由 video-director 統籌。
先建立專案模板並完成 brief 與 creative treatment；在我核准 treatment 前不要開始腳本或素材生成。
```

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
| `--installed` | 列出 target 安裝位置中具有有效 Autoverse ownership sidecar 的元件 |
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
<summary><strong>展開 31 類、223 個 Agents 的完整索引</strong></summary>

<!-- AGENT_SUMMARY_START -->
| Category | Count | Agents |
|---|---:|---|
| `analysis` | 7 | [`business-analyst`](agents/business-analyst.md), [`business-intelligence-analyst`](agents/business-intelligence-analyst.md), [`competitive-intelligence-analyst`](agents/competitive-intelligence-analyst.md), [`experimentation-methodologist`](agents/experimentation-methodologist.md), [`quant-analyst`](agents/quant-analyst.md), [`reverse-engineer`](agents/reverse-engineer.md), [`startup-analyst`](agents/startup-analyst.md) |
| `architecture` | 12 | [`api-contract-architect`](agents/api-contract-architect.md), [`architect`](agents/architect.md), [`architect-review`](agents/architect-review.md), [`backend-architect`](agents/backend-architect.md), [`database-architect`](agents/database-architect.md), [`dotnet-architect`](agents/dotnet-architect.md), [`event-sourcing-architect`](agents/event-sourcing-architect.md), [`graphql-architect`](agents/graphql-architect.md), [`legacy-modernizer`](agents/legacy-modernizer.md), [`monorepo-architect`](agents/monorepo-architect.md), [`saas-platform-architect`](agents/saas-platform-architect.md), [`seo-structure-architect`](agents/seo-structure-architect.md) |
| `artificial-intelligence` | 9 | [`ai-engineer`](agents/ai-engineer.md), [`ai-safety-evaluator`](agents/ai-safety-evaluator.md), [`eval-judge`](agents/eval-judge.md), [`eval-orchestrator`](agents/eval-orchestrator.md), [`llm-platform-engineer`](agents/llm-platform-engineer.md), [`mcp-developer`](agents/mcp-developer.md), [`model-advisor`](agents/model-advisor.md), [`prompt-crafter`](agents/prompt-crafter.md), [`prompt-engineer`](agents/prompt-engineer.md) |
| `business-operations` | 7 | [`change-management-consultant`](agents/change-management-consultant.md), [`hr-pro`](agents/hr-pro.md), [`learning-development-specialist`](agents/learning-development-specialist.md), [`operations-manager`](agents/operations-manager.md), [`partnership-manager`](agents/partnership-manager.md), [`pricing-strategist`](agents/pricing-strategist.md), [`procurement-specialist`](agents/procurement-specialist.md) |
| `cloud-infrastructure` | 10 | [`aws-solutions-architect`](agents/aws-solutions-architect.md), [`cloud-architect`](agents/cloud-architect.md), [`finops-engineer`](agents/finops-engineer.md), [`hybrid-cloud-architect`](agents/hybrid-cloud-architect.md), [`kubernetes-architect`](agents/kubernetes-architect.md), [`linux-systems-administrator`](agents/linux-systems-administrator.md), [`network-engineer`](agents/network-engineer.md), [`service-mesh-expert`](agents/service-mesh-expert.md), [`terraform-specialist`](agents/terraform-specialist.md), [`windows-infrastructure-admin`](agents/windows-infrastructure-admin.md) |
| `commerce` | 2 | [`ecommerce-operations-manager`](agents/ecommerce-operations-manager.md), [`payment-integration`](agents/payment-integration.md) |
| `creative` | 3 | [`creative-director`](agents/creative-director.md), [`gallery-researcher`](agents/gallery-researcher.md), [`image-generator`](agents/image-generator.md) |
| `customer-operations` | 2 | [`customer-success-manager`](agents/customer-success-manager.md), [`customer-support`](agents/customer-support.md) |
| `data` | 9 | [`analytics-engineer`](agents/analytics-engineer.md), [`data-engineer`](agents/data-engineer.md), [`data-governance-engineer`](agents/data-governance-engineer.md), [`data-scientist`](agents/data-scientist.md), [`database-admin`](agents/database-admin.md), [`gis-analyst`](agents/gis-analyst.md), [`search-relevance-engineer`](agents/search-relevance-engineer.md), [`sql-pro`](agents/sql-pro.md), [`vector-database-engineer`](agents/vector-database-engineer.md) |
| `developer-experience` | 8 | [`agent-designer`](agents/agent-designer.md), [`agent-harness-optimizer`](agents/agent-harness-optimizer.md), [`codebase-onboarding-engineer`](agents/codebase-onboarding-engineer.md), [`dependency-manager`](agents/dependency-manager.md), [`developer-advocate`](agents/developer-advocate.md), [`developer-tooling-engineer`](agents/developer-tooling-engineer.md), [`dx-optimizer`](agents/dx-optimizer.md), [`platform-engineer`](agents/platform-engineer.md) |
| `development` | 35 | [`backend-developer`](agents/backend-developer.md), [`bash-pro`](agents/bash-pro.md), [`blockchain-developer`](agents/blockchain-developer.md), [`c-pro`](agents/c-pro.md), [`cms-platform-engineer`](agents/cms-platform-engineer.md), [`cpp-pro`](agents/cpp-pro.md), [`csharp-pro`](agents/csharp-pro.md), [`debugger`](agents/debugger.md), [`django-pro`](agents/django-pro.md), [`electron-pro`](agents/electron-pro.md), [`elixir-pro`](agents/elixir-pro.md), [`fastapi-pro`](agents/fastapi-pro.md), [`flutter-expert`](agents/flutter-expert.md), [`frontend-developer`](agents/frontend-developer.md), [`golang-pro`](agents/golang-pro.md), [`haskell-pro`](agents/haskell-pro.md), [`internationalization-engineer`](agents/internationalization-engineer.md), [`ios-developer`](agents/ios-developer.md), [`java-pro`](agents/java-pro.md), [`javascript-pro`](agents/javascript-pro.md), [`julia-pro`](agents/julia-pro.md), [`minecraft-bukkit-pro`](agents/minecraft-bukkit-pro.md), [`mobile-developer`](agents/mobile-developer.md), [`php-pro`](agents/php-pro.md), [`posix-shell-pro`](agents/posix-shell-pro.md), [`powershell-pro`](agents/powershell-pro.md), [`python-pro`](agents/python-pro.md), [`realtime-systems-engineer`](agents/realtime-systems-engineer.md), [`refactoring-specialist`](agents/refactoring-specialist.md), [`ruby-pro`](agents/ruby-pro.md), [`rust-pro`](agents/rust-pro.md), [`scala-pro`](agents/scala-pro.md), [`temporal-python-pro`](agents/temporal-python-pro.md), [`typescript-pro`](agents/typescript-pro.md), [`unity-developer`](agents/unity-developer.md) |
| `documentation` | 9 | [`api-documenter`](agents/api-documenter.md), [`c4-code`](agents/c4-code.md), [`c4-component`](agents/c4-component.md), [`c4-container`](agents/c4-container.md), [`c4-context`](agents/c4-context.md), [`docs-architect`](agents/docs-architect.md), [`mermaid-expert`](agents/mermaid-expert.md), [`reference-builder`](agents/reference-builder.md), [`tutorial-engineer`](agents/tutorial-engineer.md) |
| `embedded-systems` | 2 | [`arm-cortex-expert`](agents/arm-cortex-expert.md), [`firmware-analyst`](agents/firmware-analyst.md) |
| `finance` | 2 | [`accounting-controller`](agents/accounting-controller.md), [`fpa-analyst`](agents/fpa-analyst.md) |
| `governance` | 6 | [`compliance-auditor`](agents/compliance-auditor.md), [`legal-advisor`](agents/legal-advisor.md), [`policy-enforcer`](agents/policy-enforcer.md), [`review-policy-author`](agents/review-policy-author.md), [`risk-manager`](agents/risk-manager.md), [`software-license-compliance-engineer`](agents/software-license-compliance-engineer.md) |
| `healthcare` | 6 | [`clinical-data-manager`](agents/clinical-data-manager.md), [`clinical-evidence-reviewer`](agents/clinical-evidence-reviewer.md), [`emergency-preparedness-coordinator`](agents/emergency-preparedness-coordinator.md), [`health-information-manager`](agents/health-information-manager.md), [`healthcare-compliance-specialist`](agents/healthcare-compliance-specialist.md), [`patient-safety-officer`](agents/patient-safety-officer.md) |
| `machine-learning` | 3 | [`ml-engineer`](agents/ml-engineer.md), [`mlops-engineer`](agents/mlops-engineer.md), [`model-validation-specialist`](agents/model-validation-specialist.md) |
| `marketing` | 13 | [`content-marketer`](agents/content-marketer.md), [`marketing-measurement-specialist`](agents/marketing-measurement-specialist.md), [`paid-media-auditor`](agents/paid-media-auditor.md), [`seo-authority-builder`](agents/seo-authority-builder.md), [`seo-cannibalization-detector`](agents/seo-cannibalization-detector.md), [`seo-content-auditor`](agents/seo-content-auditor.md), [`seo-content-planner`](agents/seo-content-planner.md), [`seo-content-refresher`](agents/seo-content-refresher.md), [`seo-content-writer`](agents/seo-content-writer.md), [`seo-keyword-strategist`](agents/seo-keyword-strategist.md), [`seo-meta-optimizer`](agents/seo-meta-optimizer.md), [`seo-snippet-hunter`](agents/seo-snippet-hunter.md), [`social-publishing-publisher`](agents/social-publishing-publisher.md) |
| `media-production` | 9 | [`cinematographer`](agents/cinematographer.md), [`production-designer`](agents/production-designer.md), [`screenwriter`](agents/screenwriter.md), [`sound-designer`](agents/sound-designer.md), [`storyboard-artist`](agents/storyboard-artist.md), [`video-director`](agents/video-director.md), [`video-editor`](agents/video-editor.md), [`video-producer`](agents/video-producer.md), [`visual-continuity-supervisor`](agents/visual-continuity-supervisor.md) |
| `operations` | 11 | [`chaos-engineer`](agents/chaos-engineer.md), [`deploy-with-verification`](agents/deploy-with-verification.md), [`deployment-engineer`](agents/deployment-engineer.md), [`devops-troubleshooter`](agents/devops-troubleshooter.md), [`error-detective`](agents/error-detective.md), [`incident-responder`](agents/incident-responder.md), [`it-service-manager`](agents/it-service-manager.md), [`mobile-release-engineer`](agents/mobile-release-engineer.md), [`observability-engineer`](agents/observability-engineer.md), [`prod-logs-health-check`](agents/prod-logs-health-check.md), [`sre-engineer`](agents/sre-engineer.md) |
| `orchestration` | 9 | [`conductor-validator`](agents/conductor-validator.md), [`context-manager`](agents/context-manager.md), [`implement`](agents/implement.md), [`orchestrate`](agents/orchestrate.md), [`session-end`](agents/session-end.md), [`session-start`](agents/session-start.md), [`team-debugger`](agents/team-debugger.md), [`team-implementer`](agents/team-implementer.md), [`team-lead`](agents/team-lead.md) |
| `performance` | 2 | [`database-optimizer`](agents/database-optimizer.md), [`performance-engineer`](agents/performance-engineer.md) |
| `product-management` | 3 | [`product-manager`](agents/product-manager.md), [`product-spec-orchestrator`](agents/product-spec-orchestrator.md), [`technical-product-manager`](agents/technical-product-manager.md) |
| `project-management` | 2 | [`project-manager`](agents/project-manager.md), [`release-manager`](agents/release-manager.md) |
| `quality-assurance` | 11 | [`browser-runtime-debugger`](agents/browser-runtime-debugger.md), [`code-review-preshipment`](agents/code-review-preshipment.md), [`code-reviewer`](agents/code-reviewer.md), [`playwright`](agents/playwright.md), [`qa`](agents/qa.md), [`receipt-verifier`](agents/receipt-verifier.md), [`review-feedback-resolver`](agents/review-feedback-resolver.md), [`tdd-orchestrator`](agents/tdd-orchestrator.md), [`team-reviewer`](agents/team-reviewer.md), [`test-automator`](agents/test-automator.md), [`ui-visual-validator`](agents/ui-visual-validator.md) |
| `research` | 2 | [`market-researcher`](agents/market-researcher.md), [`search-specialist`](agents/search-specialist.md) |
| `sales` | 3 | [`revenue-operations-analyst`](agents/revenue-operations-analyst.md), [`sales-automator`](agents/sales-automator.md), [`sales-engineer`](agents/sales-engineer.md) |
| `security` | 13 | [`application-security-engineer`](agents/application-security-engineer.md), [`backend-security-coder`](agents/backend-security-coder.md), [`cloud-security-engineer`](agents/cloud-security-engineer.md), [`frontend-security-coder`](agents/frontend-security-coder.md), [`identity-access-engineer`](agents/identity-access-engineer.md), [`malware-analyst`](agents/malware-analyst.md), [`mobile-security-coder`](agents/mobile-security-coder.md), [`penetration-tester`](agents/penetration-tester.md), [`privacy-engineer`](agents/privacy-engineer.md), [`security-auditor`](agents/security-auditor.md), [`threat-detection-engineer`](agents/threat-detection-engineer.md), [`threat-intelligence-analyst`](agents/threat-intelligence-analyst.md), [`threat-modeling-expert`](agents/threat-modeling-expert.md) |
| `strategy` | 3 | [`brand-strategist`](agents/brand-strategist.md), [`business-strategy-consultant`](agents/business-strategy-consultant.md), [`grant-strategist`](agents/grant-strategist.md) |
| `user-experience` | 5 | [`accessibility-expert`](agents/accessibility-expert.md), [`design-system-architect`](agents/design-system-architect.md), [`ui-designer`](agents/ui-designer.md), [`ui-ux-designer`](agents/ui-ux-designer.md), [`ux-researcher`](agents/ux-researcher.md) |
| `writing` | 5 | [`article-writer`](agents/article-writer.md), [`content-editor`](agents/content-editor.md), [`copywriter`](agents/copywriter.md), [`technical-writer`](agents/technical-writer.md), [`ux-writer`](agents/ux-writer.md) |
<!-- AGENT_SUMMARY_END -->

</details>

## Skills

189 個 Skills 分成 7 類。每個 package 以 `SKILL.md` 為入口，相關 references、scripts 與 assets 保留在同一資料夾中。

| Category | Count | 說明 |
|---|---:|---|
| `development` | 151 | 軟體開發、架構、框架、測試、安全、資料與平台工程 |
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
│  ├─ claude/<role>.md              # Generated Claude Code adapters
│  ├─ cursor/<role>.md              # Generated Cursor subagents
│  ├─ copilot/<role>.agent.md       # Generated VS Code/Copilot agents
│  └─ opencode/<role>.md            # Generated OpenCode subagents
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
│  ├─ smoke-install.ps1             # Isolated Windows installer smoke test
│  ├─ smoke-install.sh              # Isolated Linux／macOS installer smoke test
│  ├─ generate-agent-adapters.js
│  ├─ generate-agent-catalog.js
│  ├─ sync-agent-reference.js
│  ├─ verify-agent-references.js
│  ├─ audit-agent-originality.js
│  ├─ validate-catalog.js
│  └─ data/
│     ├─ agent-reference-sources.json
│     └─ wshobson-agent-inventory.json
├─ tests/cli.test.js                # Zero-dependency CLI argument tests
└─ .github/workflows/validate.yml   # Catalog, CLI and installer CI
```

`agents/<role>.md` 是 Agent 的唯一人工維護來源。請勿直接修改 `adapters/`；五套平台 adapter 與 `agents.json` 都由 scripts 產生。

## 開發與驗證

需要 Node.js 16 或更新版本。

```bash
# 從 canonical Agents 重建五平台 adapters 與 agents.json
npm run generate:agents

# 更新 wshobson/agents reference tree 與逐項 ledger
npm run sync:agent-reference

# 驗證 catalogs、frontmatter、來源、授權、adapters、ledger 與 README counts
npm run validate

# 驗證 CLI 單值參數、未知選項與正常 Skill／Agent 查詢
npm run test:cli

# 在隔離暫存目錄實測安裝、更新、修復、metadata 與同名保護
npm run smoke:install:powershell   # Windows
npm run smoke:install:bash         # Linux／macOS 或 Git Bash

# Git Bash 本機快速模式；CI 仍會執行完整 catalog
AUTOVERSE_SMOKE_MODE=quick npm run smoke:install:bash

# 連線 GitHub，驗證每個 pinned commit、tree、reference path 與 license
npm run verify:agent-references:remote

# 下載 pinned upstream revisions，檢查長行與 12-word verbatim overlap
npm run audit:agent-originality

# 預覽 npm package 會包含的檔案
npm pack --dry-run
```

`npm run validate`、CLI tests 與 installer smoke tests 都不需要網路；兩個 installer smoke scripts 會建立獨立暫存 HOME，驗證 project／全域 targets、ownership metadata 與防覆寫行為，完成後自動清除，不會修改真正的使用者安裝。來源遠端驗證與 originality audit 需要連線 GitHub。CI 會在 push 到 `main` 與每個 pull request 上使用 Node.js 20 執行 catalog／來源檢查、CLI argument tests，以及 Windows PowerShell、Ubuntu Bash 兩套安裝煙霧測試。GitHub Actions 只授予 `contents: read`。

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
- 外部專案只作為研究、coverage 與設計參考；Agents 使用 `reference-repo`、`reference-paths`、`reference-tree`，Skills 使用 `reference-source`、`reference-license` 獨立記錄，不取代本專案的正式來源。
- Agent reference repository 的 pinned commit、實際 Git tree、license identifier 與 license path 集中保存在 [agent-reference-sources.json](scripts/data/agent-reference-sources.json)。CI 會向 GitHub 重新驗證 commit → tree 關係、每個 reference path，以及授權檔內容。
- Agent catalog 參考 [wshobson/agents](https://github.com/wshobson/agents)、[msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents)、[VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents)、[github/awesome-copilot](https://github.com/github/awesome-copilot)、[affaan-m/ECC](https://github.com/affaan-m/ECC)、[supatest-ai/awesome-claude-code-sub-agents](https://github.com/supatest-ai/awesome-claude-code-sub-agents)、[devsforge/marketplace](https://github.com/devsforge/marketplace)、[ajhcs/healthcare-agents](https://github.com/ajhcs/healthcare-agents)、[aws-samples/sample-claude-code-agent-team](https://github.com/aws-samples/sample-claude-code-agent-team)、[DojoCodingLabs/remotion-superpowers](https://github.com/DojoCodingLabs/remotion-superpowers)、[HKUDS/ViMax](https://github.com/HKUDS/ViMax)、[paperclipai/companies](https://github.com/paperclipai/companies)、[HITsz-TMG/AIGC-Claw](https://github.com/HITsz-TMG/AIGC-Claw)、[davila7/claude-code-templates](https://github.com/davila7/claude-code-templates) 與 [Donchitos/Claude-Code-Game-Studios](https://github.com/Donchitos/Claude-Code-Game-Studios) 的角色定位、路徑與高層責任；prompt 內容均由本專案重新設計與加強，不是原文完整複製。
- 影片工作流另研究 [calesthio/OpenMontage](https://github.com/calesthio/OpenMontage) 的階段化產物與人工核准概念、[showlab/MovieAgent](https://github.com/showlab/MovieAgent) 公開文件中的電影職責分工，以及 [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) 的 renderer review 與 task graph。OpenMontage 的 AGPL-3.0 reference metadata 已保留；MovieAgent 在採用的 revision 未找到 repository-wide license，因此只使用公開的高層概念，沒有重用程式碼或 prompt 文字。詳細 revision 與改寫邊界記錄在 [`source-notes.md`](skills/video-production-workflow/references/source-notes.md)。
- 同名或職責相近的上游定義會先依內容合併或排除。`wshobson/agents` 的 199 個 definitions、commit SHA、tree SHA、198 個 canonical mappings 與 1 個明確 exclusion 保存在 [wshobson-agent-inventory.json](scripts/data/wshobson-agent-inventory.json)；其他來源的 repository、path 與 tree SHA 則保存在各 canonical Agent frontmatter。
- `npm run audit:agent-originality` 會針對 223 個 canonical Agent prompt 與 pinned upstream references 執行逐字重疊檢查；若出現至少 60 個字元的相同行，或 12 個單字的逐字片段，CI 會拒絕通過。這是保護改寫原創性的保守靜態閘門，不等同法律上的相似性判定。
- Repository 與全部 223 個 Agents 採 Apache-2.0。Skills 的個別授權以各自 `SKILL.md` 與 `skills.json` 為準；目前 188 個為 Apache-2.0，`karpathy-guidelines` 保留 MIT 授權與外部 reference metadata。

## 疑難排解

<details>
<summary><strong>出現 Target is required</strong></summary>

安裝器不使用隱性平台預設。請加入 `-Target codex` 或 `--target codex`；若要安裝到目前 workspace 的所有支援工具，使用 `project`。

</details>

<details>
<summary><strong>出現 Refusing to replace ... ownership metadata does not match</strong></summary>

這表示同名路徑已存在，但 ownership metadata 缺失、無效、來自其他 repository，或 component／name／target／Agent identity 不一致。

先檢查 Skill 內的 `.skill-meta.json`，或 Agent 旁的 `.autoverse.json` sidecar，確認現有內容的來源。不要直接刪除或覆蓋別人的安裝。只有在確定應由 Autoverse 取代並完成備份後，才使用 `-Force`／`--force`。

</details>

<details>
<summary><strong>安裝後工具沒有顯示新 Agent</strong></summary>

確認 target 與實際使用的平台、scope 相符，再檢查 adapter 是否位於對應的 `agents/` 目錄。已開啟的工作階段可能尚未重新載入設定，請開新工作階段或重新啟動工具。

也可以執行：

```bash
node autoverse-cli.js list --installed --type agent --target codex
```

其他工具請換成對應 target。若安裝的是 `project`，請在相同專案目錄執行 CLI 並使用 `--target project`；CLI 會分平台顯示五個 Agent 目的地。

</details>

<details>
<summary><strong>全域主動委派設定被拒絕</strong></summary>

這表示安裝器偵測到不能安全自動合併的使用者設定，例如 Codex 已有自訂 `developer_instructions`，或 OpenCode 使用 JSONC／非陣列 `instructions`。Agent 與 companion Skill 會在寫入前停止；請依錯誤訊息手動合併 [global-auto-delegation.md](skills/subagent-architecture/references/global-auto-delegation.md)，不要用 Force 覆蓋原設定。

</details>

<details>
<summary><strong>沒有 Node.js，還能安裝嗎？</strong></summary>

可以。一般安裝不需要 Node.js；只有 Bash 要合併既有、自訂的 OpenCode JSON 時，需要 Python 3 或 Node.js 其中之一。Catalog CLI、產生 adapters、驗證與 package 預覽則需要 Node.js 16 或更新版本。

</details>

<details>
<summary><strong>Bash 安裝器回報缺少 command</strong></summary>

確認系統已安裝 Bash、`curl`、`tar`、`mktemp` 與 `cksum`。如果只想從本機 checkout 安裝，仍需 Bash，但不需要下載 GitHub archive。若要把 guidance 合併進既有的 OpenCode `opencode.json`，還需要 Python 3 或 Node.js；兩者皆無時仍可建立並重跑安裝器自己的最小 config，但不會冒險改寫自訂 JSON。

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
