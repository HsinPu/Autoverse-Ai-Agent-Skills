# Autoverse AI Agent Skills

由 HsinPu 維護的開源 AI Agent 與 Skill catalog。專案同時提供平台中立的原始定義、Codex／Claude Code 原生 Agent adapters、免 Node 安裝器，以及可搜尋的 JSON catalog。

## 目前規模

- **185 Skills**：可安裝到 12 種 coding-agent／IDE 目標。
- **199 Agent definitions**：分布於 **80 plugins**，涵蓋 **134 個 role names**。
- 其中 **30 個 role names** 出現在多個 plugin；多出的 **65 份定義不是捨棄的重複項目**，而是針對不同工作情境強化的 plugin-specific variants。
- 每個 Agent 都維持 `author: HsinPu`、`source: HsinPu/Autoverse-Ai-Agent-Skills`、`license: Apache-2.0`。

<!-- AGENT_COUNT_START -->
目前共收錄 **199** 個 plugin-scoped Agents。
<!-- AGENT_COUNT_END -->

## 專案結構

```text
Autoverse-Ai-Agent-Skills/
├─ agents/<plugin>/<role>.md       # 平台中立、人工維護的 Agent 原始定義
├─ adapters/
│  ├─ codex/<plugin>/<role>.toml   # 由原始定義產生的 Codex adapter
│  └─ claude/<plugin>/<role>.md    # 由原始定義產生的 Claude Code adapter
├─ skills/<skill>/SKILL.md         # Skill packages
├─ agents.json                     # Agent catalog 2.0
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

Agent 的唯一 ID 使用 `plugin/role`，例如 `comprehensive-review/code-reviewer`；安裝後的執行名稱會扁平化為 `comprehensive-review-code-reviewer`，因此同名角色不會互相覆蓋。

## 安裝 Agent

Agent 目前提供 Codex 與 Claude Code 的 user scope 與 project scope。Codex 使用 `.toml` custom agent；Claude Code 使用帶 YAML frontmatter 的 `.md` subagent。格式與路徑分別遵循 [OpenAI Codex Subagents](https://developers.openai.com/codex/agent-configuration/subagents) 與 [Claude Code Subagents](https://code.claude.com/docs/en/sub-agents) 文件。

### Windows PowerShell

安裝到使用者的 Codex：

```powershell
powershell -ExecutionPolicy Bypass -NoProfile -Command '$s = irm https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.ps1; & ([scriptblock]::Create($s)) -Target codex -Type agent -Name comprehensive-review/code-reviewer'
```

安裝到目前專案的 Claude Code：

```powershell
powershell -ExecutionPolicy Bypass -NoProfile -Command '$s = irm https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.ps1; & ([scriptblock]::Create($s)) -Target claude-project -Type agent -Name incident-response/debugger'
```

### Linux／macOS

安裝到使用者的 Claude Code：

```bash
curl -fsSL https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.sh | bash -s -- --target claude --type agent --name comprehensive-review/code-reviewer
```

安裝到目前專案的 Codex：

```bash
curl -fsSL https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.sh | bash -s -- --target codex-project --type agent --name incident-response/debugger
```

### Agent 安裝位置

| Target | Scope | 安裝位置 |
|---|---|---|
| `codex` | 使用者 | `~/.codex/agents/` |
| `codex-project` | 目前專案 | `.codex/agents/` |
| `claude` | 使用者 | `~/.claude/agents/` |
| `claude-project` | 目前專案 | `.claude/agents/` |

每次 Agent 安裝會建立 `<agent-file>.autoverse.json`。只有 metadata 顯示來自同一 repo 時才會自動更新；既有同名內容沒有 metadata、metadata 無效或來自其他 repo 時，安裝器會拒絕覆蓋。確認要取代時才使用 `-Force`／`--force`。

## 安裝 Skills

新參數使用 `Target + Type + Name`；舊版的 `-Agent ... -Skill ...` 與 `--agent ... --skill ...` 仍可繼續使用。

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

兩套安裝器都支援自訂 `-InstallDir`／`--dir`、預演 `-DryRun`／`--dry-run`，以及本機開發測試用的 `-SourceDir`／`--source-dir`。

## Catalog CLI

```bash
# Skills（預設）
node autoverse-cli.js list
node autoverse-cli.js search "python development"
node autoverse-cli.js info python-development

# Agents
node autoverse-cli.js list --type agent --plugin comprehensive-review
node autoverse-cli.js search "incident debugger" --type agent
node autoverse-cli.js info comprehensive-review/code-reviewer --type agent
```

也可全域安裝 CLI：

```bash
npm install -g autoverse-ai-agent-skills
autoverse search reviewer --type agent
```

## Agent catalog

以下清單由 `agents.json` 自動產生。完整 metadata、權限、相關 Skills 與 reference path 以 [agents.json](agents.json) 為準。

<!-- AGENT_SUMMARY_START -->
| Plugin | Count | Agents |
|---|---:|---|
| `accessibility-compliance` | 1 | [`ui-visual-validator`](agents/accessibility-compliance/ui-visual-validator.md) |
| `agent-orchestration` | 1 | [`context-manager`](agents/agent-orchestration/context-manager.md) |
| `agent-teams` | 4 | [`team-debugger`](agents/agent-teams/team-debugger.md), [`team-implementer`](agents/agent-teams/team-implementer.md), [`team-lead`](agents/agent-teams/team-lead.md), [`team-reviewer`](agents/agent-teams/team-reviewer.md) |
| `api-scaffolding` | 4 | [`backend-architect`](agents/api-scaffolding/backend-architect.md), [`django-pro`](agents/api-scaffolding/django-pro.md), [`fastapi-pro`](agents/api-scaffolding/fastapi-pro.md), [`graphql-architect`](agents/api-scaffolding/graphql-architect.md) |
| `api-testing-observability` | 1 | [`api-documenter`](agents/api-testing-observability/api-documenter.md) |
| `application-performance` | 3 | [`frontend-developer`](agents/application-performance/frontend-developer.md), [`observability-engineer`](agents/application-performance/observability-engineer.md), [`performance-engineer`](agents/application-performance/performance-engineer.md) |
| `arm-cortex-microcontrollers` | 1 | [`arm-cortex-expert`](agents/arm-cortex-microcontrollers/arm-cortex-expert.md) |
| `backend-api-security` | 2 | [`backend-architect`](agents/backend-api-security/backend-architect.md), [`backend-security-coder`](agents/backend-api-security/backend-security-coder.md) |
| `backend-development` | 8 | [`backend-architect`](agents/backend-development/backend-architect.md), [`event-sourcing-architect`](agents/backend-development/event-sourcing-architect.md), [`graphql-architect`](agents/backend-development/graphql-architect.md), [`performance-engineer`](agents/backend-development/performance-engineer.md), [`security-auditor`](agents/backend-development/security-auditor.md), [`tdd-orchestrator`](agents/backend-development/tdd-orchestrator.md), [`temporal-python-pro`](agents/backend-development/temporal-python-pro.md), [`test-automator`](agents/backend-development/test-automator.md) |
| `blockchain-web3` | 1 | [`blockchain-developer`](agents/blockchain-web3/blockchain-developer.md) |
| `business-analytics` | 1 | [`business-analyst`](agents/business-analytics/business-analyst.md) |
| `c4-architecture` | 4 | [`c4-code`](agents/c4-architecture/c4-code.md), [`c4-component`](agents/c4-architecture/c4-component.md), [`c4-container`](agents/c4-architecture/c4-container.md), [`c4-context`](agents/c4-architecture/c4-context.md) |
| `cicd-automation` | 5 | [`cloud-architect`](agents/cicd-automation/cloud-architect.md), [`deployment-engineer`](agents/cicd-automation/deployment-engineer.md), [`devops-troubleshooter`](agents/cicd-automation/devops-troubleshooter.md), [`kubernetes-architect`](agents/cicd-automation/kubernetes-architect.md), [`terraform-specialist`](agents/cicd-automation/terraform-specialist.md) |
| `cloud-infrastructure` | 7 | [`cloud-architect`](agents/cloud-infrastructure/cloud-architect.md), [`deployment-engineer`](agents/cloud-infrastructure/deployment-engineer.md), [`hybrid-cloud-architect`](agents/cloud-infrastructure/hybrid-cloud-architect.md), [`kubernetes-architect`](agents/cloud-infrastructure/kubernetes-architect.md), [`network-engineer`](agents/cloud-infrastructure/network-engineer.md), [`service-mesh-expert`](agents/cloud-infrastructure/service-mesh-expert.md), [`terraform-specialist`](agents/cloud-infrastructure/terraform-specialist.md) |
| `code-documentation` | 3 | [`code-reviewer`](agents/code-documentation/code-reviewer.md), [`docs-architect`](agents/code-documentation/docs-architect.md), [`tutorial-engineer`](agents/code-documentation/tutorial-engineer.md) |
| `code-refactoring` | 2 | [`code-reviewer`](agents/code-refactoring/code-reviewer.md), [`legacy-modernizer`](agents/code-refactoring/legacy-modernizer.md) |
| `codebase-cleanup` | 2 | [`code-reviewer`](agents/codebase-cleanup/code-reviewer.md), [`test-automator`](agents/codebase-cleanup/test-automator.md) |
| `comprehensive-review` | 3 | [`architect-review`](agents/comprehensive-review/architect-review.md), [`code-reviewer`](agents/comprehensive-review/code-reviewer.md), [`security-auditor`](agents/comprehensive-review/security-auditor.md) |
| `conductor` | 1 | [`conductor-validator`](agents/conductor/conductor-validator.md) |
| `content-marketing` | 2 | [`content-marketer`](agents/content-marketing/content-marketer.md), [`search-specialist`](agents/content-marketing/search-specialist.md) |
| `context-management` | 1 | [`context-manager`](agents/context-management/context-manager.md) |
| `customer-sales-automation` | 2 | [`customer-support`](agents/customer-sales-automation/customer-support.md), [`sales-automator`](agents/customer-sales-automation/sales-automator.md) |
| `data-engineering` | 2 | [`backend-architect`](agents/data-engineering/backend-architect.md), [`data-engineer`](agents/data-engineering/data-engineer.md) |
| `data-validation-suite` | 1 | [`backend-security-coder`](agents/data-validation-suite/backend-security-coder.md) |
| `database-cloud-optimization` | 4 | [`backend-architect`](agents/database-cloud-optimization/backend-architect.md), [`cloud-architect`](agents/database-cloud-optimization/cloud-architect.md), [`database-architect`](agents/database-cloud-optimization/database-architect.md), [`database-optimizer`](agents/database-cloud-optimization/database-optimizer.md) |
| `database-design` | 2 | [`database-architect`](agents/database-design/database-architect.md), [`sql-pro`](agents/database-design/sql-pro.md) |
| `database-migrations` | 2 | [`database-admin`](agents/database-migrations/database-admin.md), [`database-optimizer`](agents/database-migrations/database-optimizer.md) |
| `debugging-toolkit` | 2 | [`debugger`](agents/debugging-toolkit/debugger.md), [`dx-optimizer`](agents/debugging-toolkit/dx-optimizer.md) |
| `dependency-management` | 1 | [`legacy-modernizer`](agents/dependency-management/legacy-modernizer.md) |
| `deployment-strategies` | 2 | [`deployment-engineer`](agents/deployment-strategies/deployment-engineer.md), [`terraform-specialist`](agents/deployment-strategies/terraform-specialist.md) |
| `deployment-validation` | 1 | [`cloud-architect`](agents/deployment-validation/cloud-architect.md) |
| `developer-essentials` | 1 | [`monorepo-architect`](agents/developer-essentials/monorepo-architect.md) |
| `distributed-debugging` | 2 | [`devops-troubleshooter`](agents/distributed-debugging/devops-troubleshooter.md), [`error-detective`](agents/distributed-debugging/error-detective.md) |
| `documentation-generation` | 5 | [`api-documenter`](agents/documentation-generation/api-documenter.md), [`docs-architect`](agents/documentation-generation/docs-architect.md), [`mermaid-expert`](agents/documentation-generation/mermaid-expert.md), [`reference-builder`](agents/documentation-generation/reference-builder.md), [`tutorial-engineer`](agents/documentation-generation/tutorial-engineer.md) |
| `dotnet-contribution` | 1 | [`dotnet-architect`](agents/dotnet-contribution/dotnet-architect.md) |
| `error-debugging` | 2 | [`debugger`](agents/error-debugging/debugger.md), [`error-detective`](agents/error-debugging/error-detective.md) |
| `error-diagnostics` | 2 | [`debugger`](agents/error-diagnostics/debugger.md), [`error-detective`](agents/error-diagnostics/error-detective.md) |
| `framework-migration` | 2 | [`architect-review`](agents/framework-migration/architect-review.md), [`legacy-modernizer`](agents/framework-migration/legacy-modernizer.md) |
| `frontend-mobile-development` | 2 | [`frontend-developer`](agents/frontend-mobile-development/frontend-developer.md), [`mobile-developer`](agents/frontend-mobile-development/mobile-developer.md) |
| `frontend-mobile-security` | 3 | [`frontend-developer`](agents/frontend-mobile-security/frontend-developer.md), [`frontend-security-coder`](agents/frontend-mobile-security/frontend-security-coder.md), [`mobile-security-coder`](agents/frontend-mobile-security/mobile-security-coder.md) |
| `full-stack-orchestration` | 4 | [`deployment-engineer`](agents/full-stack-orchestration/deployment-engineer.md), [`performance-engineer`](agents/full-stack-orchestration/performance-engineer.md), [`security-auditor`](agents/full-stack-orchestration/security-auditor.md), [`test-automator`](agents/full-stack-orchestration/test-automator.md) |
| `functional-programming` | 2 | [`elixir-pro`](agents/functional-programming/elixir-pro.md), [`haskell-pro`](agents/functional-programming/haskell-pro.md) |
| `game-development` | 2 | [`minecraft-bukkit-pro`](agents/game-development/minecraft-bukkit-pro.md), [`unity-developer`](agents/game-development/unity-developer.md) |
| `git-pr-workflows` | 1 | [`code-reviewer`](agents/git-pr-workflows/code-reviewer.md) |
| `hr-legal-compliance` | 2 | [`hr-pro`](agents/hr-legal-compliance/hr-pro.md), [`legal-advisor`](agents/hr-legal-compliance/legal-advisor.md) |
| `incident-response` | 6 | [`code-reviewer`](agents/incident-response/code-reviewer.md), [`debugger`](agents/incident-response/debugger.md), [`devops-troubleshooter`](agents/incident-response/devops-troubleshooter.md), [`error-detective`](agents/incident-response/error-detective.md), [`incident-responder`](agents/incident-response/incident-responder.md), [`test-automator`](agents/incident-response/test-automator.md) |
| `javascript-typescript` | 2 | [`javascript-pro`](agents/javascript-typescript/javascript-pro.md), [`typescript-pro`](agents/javascript-typescript/typescript-pro.md) |
| `julia-development` | 1 | [`julia-pro`](agents/julia-development/julia-pro.md) |
| `jvm-languages` | 3 | [`csharp-pro`](agents/jvm-languages/csharp-pro.md), [`java-pro`](agents/jvm-languages/java-pro.md), [`scala-pro`](agents/jvm-languages/scala-pro.md) |
| `kubernetes-operations` | 1 | [`kubernetes-architect`](agents/kubernetes-operations/kubernetes-architect.md) |
| `llm-application-dev` | 3 | [`ai-engineer`](agents/llm-application-dev/ai-engineer.md), [`prompt-engineer`](agents/llm-application-dev/prompt-engineer.md), [`vector-database-engineer`](agents/llm-application-dev/vector-database-engineer.md) |
| `machine-learning-ops` | 3 | [`data-scientist`](agents/machine-learning-ops/data-scientist.md), [`ml-engineer`](agents/machine-learning-ops/ml-engineer.md), [`mlops-engineer`](agents/machine-learning-ops/mlops-engineer.md) |
| `meigen-ai-design` | 3 | [`gallery-researcher`](agents/meigen-ai-design/gallery-researcher.md), [`image-generator`](agents/meigen-ai-design/image-generator.md), [`prompt-crafter`](agents/meigen-ai-design/prompt-crafter.md) |
| `multi-platform-apps` | 6 | [`backend-architect`](agents/multi-platform-apps/backend-architect.md), [`flutter-expert`](agents/multi-platform-apps/flutter-expert.md), [`frontend-developer`](agents/multi-platform-apps/frontend-developer.md), [`ios-developer`](agents/multi-platform-apps/ios-developer.md), [`mobile-developer`](agents/multi-platform-apps/mobile-developer.md), [`ui-ux-designer`](agents/multi-platform-apps/ui-ux-designer.md) |
| `observability-monitoring` | 4 | [`database-optimizer`](agents/observability-monitoring/database-optimizer.md), [`network-engineer`](agents/observability-monitoring/network-engineer.md), [`observability-engineer`](agents/observability-monitoring/observability-engineer.md), [`performance-engineer`](agents/observability-monitoring/performance-engineer.md) |
| `operating-kit` | 5 | [`code-review-preshipment`](agents/operating-kit/code-review-preshipment.md), [`deploy-with-verification`](agents/operating-kit/deploy-with-verification.md), [`prod-logs-health-check`](agents/operating-kit/prod-logs-health-check.md), [`session-end`](agents/operating-kit/session-end.md), [`session-start`](agents/operating-kit/session-start.md) |
| `payment-processing` | 1 | [`payment-integration`](agents/payment-processing/payment-integration.md) |
| `performance-testing-review` | 2 | [`performance-engineer`](agents/performance-testing-review/performance-engineer.md), [`test-automator`](agents/performance-testing-review/test-automator.md) |
| `plugin-eval` | 2 | [`eval-judge`](agents/plugin-eval/eval-judge.md), [`eval-orchestrator`](agents/plugin-eval/eval-orchestrator.md) |
| `protect-mcp` | 2 | [`policy-enforcer`](agents/protect-mcp/policy-enforcer.md), [`receipt-verifier`](agents/protect-mcp/receipt-verifier.md) |
| `python-development` | 3 | [`django-pro`](agents/python-development/django-pro.md), [`fastapi-pro`](agents/python-development/fastapi-pro.md), [`python-pro`](agents/python-development/python-pro.md) |
| `quantitative-trading` | 2 | [`quant-analyst`](agents/quantitative-trading/quant-analyst.md), [`risk-manager`](agents/quantitative-trading/risk-manager.md) |
| `reverse-engineering` | 3 | [`firmware-analyst`](agents/reverse-engineering/firmware-analyst.md), [`malware-analyst`](agents/reverse-engineering/malware-analyst.md), [`reverse-engineer`](agents/reverse-engineering/reverse-engineer.md) |
| `review-agent-governance` | 1 | [`review-policy-author`](agents/review-agent-governance/review-policy-author.md) |
| `runapi-mcp` | 2 | [`model-advisor`](agents/runapi-mcp/model-advisor.md), [`task-executor`](agents/runapi-mcp/task-executor.md) |
| `security-compliance` | 1 | [`security-auditor`](agents/security-compliance/security-auditor.md) |
| `security-scanning` | 2 | [`security-auditor`](agents/security-scanning/security-auditor.md), [`threat-modeling-expert`](agents/security-scanning/threat-modeling-expert.md) |
| `seo-analysis-monitoring` | 3 | [`seo-authority-builder`](agents/seo-analysis-monitoring/seo-authority-builder.md), [`seo-cannibalization-detector`](agents/seo-analysis-monitoring/seo-cannibalization-detector.md), [`seo-content-refresher`](agents/seo-analysis-monitoring/seo-content-refresher.md) |
| `seo-content-creation` | 3 | [`seo-content-auditor`](agents/seo-content-creation/seo-content-auditor.md), [`seo-content-planner`](agents/seo-content-creation/seo-content-planner.md), [`seo-content-writer`](agents/seo-content-creation/seo-content-writer.md) |
| `seo-technical-optimization` | 4 | [`seo-keyword-strategist`](agents/seo-technical-optimization/seo-keyword-strategist.md), [`seo-meta-optimizer`](agents/seo-technical-optimization/seo-meta-optimizer.md), [`seo-snippet-hunter`](agents/seo-technical-optimization/seo-snippet-hunter.md), [`seo-structure-architect`](agents/seo-technical-optimization/seo-structure-architect.md) |
| `shell-scripting` | 2 | [`bash-pro`](agents/shell-scripting/bash-pro.md), [`posix-shell-pro`](agents/shell-scripting/posix-shell-pro.md) |
| `ship-mate` | 6 | [`architect`](agents/ship-mate/architect.md), [`implement`](agents/ship-mate/implement.md), [`orchestrate`](agents/ship-mate/orchestrate.md), [`playwright`](agents/ship-mate/playwright.md), [`qa`](agents/ship-mate/qa.md), [`review`](agents/ship-mate/review.md) |
| `social-publishing` | 1 | [`social-publishing-publisher`](agents/social-publishing/social-publishing-publisher.md) |
| `startup-business-analyst` | 1 | [`startup-analyst`](agents/startup-business-analyst/startup-analyst.md) |
| `systems-programming` | 4 | [`c-pro`](agents/systems-programming/c-pro.md), [`cpp-pro`](agents/systems-programming/cpp-pro.md), [`golang-pro`](agents/systems-programming/golang-pro.md), [`rust-pro`](agents/systems-programming/rust-pro.md) |
| `tdd-workflows` | 2 | [`code-reviewer`](agents/tdd-workflows/code-reviewer.md), [`tdd-orchestrator`](agents/tdd-workflows/tdd-orchestrator.md) |
| `team-collaboration` | 1 | [`dx-optimizer`](agents/team-collaboration/dx-optimizer.md) |
| `ui-design` | 3 | [`accessibility-expert`](agents/ui-design/accessibility-expert.md), [`design-system-architect`](agents/ui-design/design-system-architect.md), [`ui-designer`](agents/ui-design/ui-designer.md) |
| `unit-testing` | 2 | [`debugger`](agents/unit-testing/debugger.md), [`test-automator`](agents/unit-testing/test-automator.md) |
| `web-scripting` | 2 | [`php-pro`](agents/web-scripting/php-pro.md), [`ruby-pro`](agents/web-scripting/ruby-pro.md) |
<!-- AGENT_SUMMARY_END -->

## Skills catalog

完整 185 項清單與分類請參考 [skills.json](skills.json) 及 [skills/](skills/)。每個 Skill 都有獨立 `SKILL.md`，需要的 references、scripts 與 assets 留在同一個 Skill package 內。

## 來源與改寫政策

本專案參考 [wshobson/agents](https://github.com/wshobson/agents) 的 plugin 路徑、角色名稱與高層責任，用來確認 catalog coverage；不直接複製其 prompt 內容。

- Agent prompt 的作者與發布來源均為 HsinPu。
- 每份 prompt 都重新設計為固定的 `Role → Task → Constraints → Output` 結構。
- 同名角色會依 plugin 的目的加入不同任務焦點、證據要求、邊界與輸出契約。
- [scripts/data/wshobson-agent-inventory.json](scripts/data/wshobson-agent-inventory.json) 逐一記錄 199 個 reference path、blob SHA、target path 與 rewrite 狀態；reference 不會取代 first-party `source` 欄位。

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

請直接編輯 `agents/<plugin>/<role>.md`，不要手動修改 `adapters/`。Agent frontmatter、catalog metadata、adapter identity、來源 ledger 與四個頂層章節都會由 validator 對照。

## License

本專案以 [Apache License 2.0](LICENSE) 授權。
