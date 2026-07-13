# Autoverse AI Agent Skills

由 HsinPu 維護的開源 AI Agent 與 Skill catalog。專案同時提供平台中立的原始定義、Codex／Claude Code 原生 Agent adapters、免 Node 安裝器，以及可搜尋的 JSON catalog。

## 目前規模

- **185 Skills**：可安裝到 12 種 coding-agent／IDE 目標。
- **134 Agents**：每個 role name 只保留一份 canonical 定義，全部直接放在 `agents/`。
- 上游的 199 個 reference definitions 中有 65 份同名變體；本專案依 role 合併去重，不重複安裝。
- 每個 Agent 都維持 `author: HsinPu`、`source: HsinPu/Autoverse-Ai-Agent-Skills`、`license: Apache-2.0`。

<!-- AGENT_COUNT_START -->
目前共收錄 **134** 個不重複 Agents。
<!-- AGENT_COUNT_END -->

## 一鍵安裝全部 Skills 與 Agents

以下指令會直接從 GitHub `main` 下載安裝器，並安裝到目前使用者的 Codex。Skill 與 Agent 是兩個獨立指令，可直接分別複製執行；兩個指令都明確預填 Codex target，需要其他平台時再替換 `Target`。

### Windows PowerShell

安裝全部 185 個 Skill：

```powershell
powershell -ExecutionPolicy Bypass -NoProfile -Command '$s = irm https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.ps1; & ([scriptblock]::Create($s)) -Target codex -Type skill'
```

安裝全部 134 個 Agent（已預填 Codex target）：

```powershell
powershell -ExecutionPolicy Bypass -NoProfile -Command '$s = irm https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.ps1; & ([scriptblock]::Create($s)) -Target codex -Type agent'
```

### Linux／macOS

安裝全部 185 個 Skill：

```bash
curl -fsSL https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.sh | bash -s -- --target codex --type skill
```

安裝全部 134 個 Agent（已預填 Codex target）：

```bash
curl -fsSL https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.sh | bash -s -- --target codex --type agent
```

## 專案結構

```text
Autoverse-Ai-Agent-Skills/
├─ agents/<role>.md                # 平台中立、人工維護且不重複的 Agent 原始定義
├─ adapters/
│  ├─ codex/<role>.toml            # 由原始定義產生的 Codex adapter
│  └─ claude/<role>.md             # 由原始定義產生的 Claude Code adapter
├─ skills/<skill>/SKILL.md         # Skill packages
├─ agents.json                     # Agent catalog 3.0
├─ skills.json                     # Skill catalog
├─ autoverse-cli.js                # Catalog 查詢 CLI
└─ scripts/
   ├─ install.ps1                  # Windows installer
   ├─ install.sh                   # Linux／macOS installer
   ├─ generate-agent-adapters.js
   ├─ generate-agent-catalog.js
   ├─ sync-agent-reference.js
   └─ validate-catalog.js
```

Agent 的 ID、執行名稱與檔名都使用 role，例如 `code-reviewer` 對應 `agents/code-reviewer.md`。Canonical 定義、平台 adapters 與實際安裝目錄都是單層結構。

## 安裝 Agent

Agent 目前提供 Codex 與 Claude Code 的 user scope 與 project scope。Codex 使用 `.toml` custom agent；Claude Code 使用帶 YAML frontmatter 的 `.md` subagent。格式與路徑分別遵循 [OpenAI Codex Subagents](https://developers.openai.com/codex/agent-configuration/subagents) 與 [Claude Code Subagents](https://code.claude.com/docs/en/sub-agents) 文件。

### Windows PowerShell

一鍵安裝全部 Agent 到目前專案的 Claude Code：

```powershell
powershell -ExecutionPolicy Bypass -NoProfile -Command '$s = irm https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.ps1; & ([scriptblock]::Create($s)) -Target claude-project -Type agent'
```

只安裝單一 Agent 時才加上 `-Name role`：

```powershell
.\scripts\install.ps1 -Target codex -Type agent -Name code-reviewer -SourceDir .
```

### Linux／macOS

一鍵安裝全部 Agent 到使用者的 Claude Code：

```bash
curl -fsSL https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.sh | bash -s -- --target claude --type agent
```

一鍵安裝全部 Agent 到目前專案的 Codex：

```bash
curl -fsSL https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.sh | bash -s -- --target codex-project --type agent
```

### Agent 安裝位置

| Target | Scope | 安裝位置 |
|---|---|---|
| `codex` | 使用者 | `~/.codex/agents/` |
| `codex-project` | 目前專案 | `.codex/agents/` |
| `claude` | 使用者 | `~/.claude/agents/` |
| `claude-project` | 目前專案 | `.claude/agents/` |

省略 `Name`／`--name` 會安裝全部 Agent；指定 role（例如 `code-reviewer`）則只安裝一個。大量安裝會先完成全部目標的覆蓋安全預檢，確認無衝突後才開始寫入。每次 Agent 安裝會建立 `<agent-file>.autoverse.json`。只有 metadata 的 `repo`、`component`、`name`、`target`、`id` 與 `adapter` 全部相符時才會自動更新；既有同名內容沒有 metadata、metadata 無效、欄位不符或來自其他 repo 時，安裝器會拒絕覆蓋。確認要取代時才使用 `-Force`／`--force`。

## 安裝 Skills

新參數使用 `Target + Type + 選填 Name`；舊版的 `-Agent ... -Skill ...` 與 `--agent ... --skill ...` 仍可繼續使用。

Windows 安裝單一 Skill：

```powershell
powershell -ExecutionPolicy Bypass -NoProfile -Command '$s = irm https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.ps1; & ([scriptblock]::Create($s)) -Target codex -Name python-development'
```

Linux／macOS 安裝單一 Skill：

```bash
curl -fsSL https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.sh | bash -s -- --target codex --name python-development
```

省略 `Name`／`--name` 會安裝全部 Skills。支援的 Skill targets：

| Target | 安裝位置 |
|---|---|
| `codex` | `~/.codex/skills/` |
| `claude` | `~/.claude/skills/` |
| `cursor` | `.cursor/skills/` |
| `vscode`, `copilot` | `.github/skills/` |
| `project` | `.skills/` |
| `opencode` | `~/.config/opencode/skills/` |
| `opencode-project` | `.opencode/skills/` |
| `goose` | `~/.config/goose/skills/` |
| `amp` | `~/.amp/skills/` |
| `letta` | `~/.letta/skills/` |
| `gemini` | `~/.gemini/skills/` |

每個 Skill 安裝後會在其目錄內建立 `.skill-meta.json`。只有 metadata 的 `repo`、`component`、`name` 與 `target` 全部相符時，安裝器才會刪除舊目錄並更新；沒有 metadata、欄位不符或屬於其他 repo 的同名 Skill 都會保留原狀並拒絕安裝，除非明確使用 `-Force`／`--force`。舊版 metadata 使用 `name + agent`；安裝器只有在 repo、舊欄位，以及既有與新版 `SKILL.md` 的 `name`、`source`／`reference-source`、`license`／明確列出的 `previous-license` 全部互相吻合時，才會執行一次 `migrate-update` 並升級 metadata。

兩套安裝器都支援自訂 `-InstallDir`／`--dir`、預演 `-DryRun`／`--dry-run`，以及本機開發測試用的 `-SourceDir`／`--source-dir`。

## Catalog CLI

```bash
# Skills（預設）
node autoverse-cli.js list
node autoverse-cli.js search "python development"
node autoverse-cli.js info python-development

# Agents
node autoverse-cli.js list --type agent --category quality-assurance
node autoverse-cli.js search "incident debugger" --type agent
node autoverse-cli.js info code-reviewer --type agent
```

也可全域安裝 CLI：

```bash
npm install -g autoverse-ai-agent-skills
autoverse search reviewer --type agent
```

## Agent catalog

以下清單由 `agents.json` 自動產生。完整 metadata、權限、相關 Skills 與 reference path 以 [agents.json](agents.json) 為準。

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

## Skills catalog

完整 185 項清單與分類請參考 [skills.json](skills.json) 及 [skills/](skills/)。每個 Skill 都有獨立 `SKILL.md`，需要的 references、scripts 與 assets 留在同一個 Skill package 內。

## 來源與改寫政策

本專案參考 [wshobson/agents](https://github.com/wshobson/agents) 的 plugin 路徑、角色名稱與高層責任，用來確認 catalog coverage；不直接複製其 prompt 內容。

- 所有 Agent 與 Skill 的正式 `source` 均為 `HsinPu/Autoverse-Ai-Agent-Skills`；外部參考另以 `reference` 或 `reference-source` 記錄。
- Agent prompt 的作者與發布來源均為 HsinPu。
- 每份 prompt 都重新設計為固定的 `Role → Task → Constraints → Output` 結構。
- 同名上游定義會依 role 合併成一份較完整的 canonical Agent，不保留重複檔案或重複安裝項目。
- [scripts/data/wshobson-agent-inventory.json](scripts/data/wshobson-agent-inventory.json) 仍逐一記錄 199 個 reference path、blob SHA、合併後 target path 與 consolidation 狀態；reference 不會取代 first-party `source` 欄位。

## 開發與驗證

```bash
# 從 canonical Agents 重建兩套 adapters 與 agents.json
npm run generate:agents

# 更新目前 upstream tree 與逐定義 ledger
npm run sync:agent-reference

# 驗證 Skills、Agents、adapters、ledger 與 README counts
npm run validate

# 檢查 npm 發布內容
npm pack --dry-run
```

請直接編輯 `agents/<role>.md`，不要手動修改 `adapters/`。Agent frontmatter、catalog metadata、adapter identity、來源 ledger 與四個頂層章節都會由 validator 對照。

## License

本專案以 [Apache License 2.0](LICENSE) 授權。
