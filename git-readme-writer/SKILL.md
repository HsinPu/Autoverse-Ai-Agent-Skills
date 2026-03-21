---
name: git-readme-writer
description: Analyze Git-based repositories and write or update professional README.md documentation for Git, GitHub, or Gerrit-hosted projects. Use when the user wants to create, rewrite, expand, or standardize project documentation after inspecting repository structure, setup steps, usage flows, contribution process, or platform-specific links and review workflow.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Git README Writer

## Purpose

此 skill 協助分析 Git-based 專案結構，撰寫或重構專業、完整的 README.md。
適用於一般 Git repository，也適用於託管在 GitHub 或 Gerrit 的專案。

## When to Use

- 使用者要求為 Git / GitHub / Gerrit 專案建立 README.md
- 現有 README 過於簡短、內容過時，或缺少安裝、使用、設定、貢獻說明
- 需要從專案結構、套件定義、執行命令、既有文件中整理出正式文件
- 需要把 README 標準化，讓它同時適用於一般 Git repository 與 GitHub / Gerrit 託管環境
- 需要補充平台相關內容，例如 GitHub 的 Issues / Pull Requests / Actions，或 Gerrit 的 code review 流程與 Change-Id 要求
- 需要將內部專案或開源專案的 onboarding / contribution flow 寫清楚

## Workflow

### Step 1: 分析專案結構

執行以下命令了解專案：

```bash
# 查看專案檔案結構
ls -la

# 查看 Git 遠端與託管平台
git remote -v
git branch --show-current

# 查看套件定義（若有）
cat package.json  # Node.js
cat pyproject.toml  # Python
cat pom.xml  # Java/Maven
cat Cargo.toml  # Rust

# 查看現有文件
ls *.md 2>/dev/null || echo "No markdown files"

# 查看原始碼結構
find . -name "*.ts" -o -name "*.js" -o -name "*.py" -o -name "*.java" | head -20
```

### Step 2: 收集專案資訊

從以下來源提取資訊：

1. **套件檔案**（package.json, pyproject.toml 等）：
   - 專案名稱、版本、描述
   - 主要依賴
   - Scripts/命令

2. **原始碼結構**：
   - 主要模組/元件
   - 架構模式

3. **現有文件**（若有）：
   - 既有說明
   - 使用範例

4. **託管平台資訊**（GitHub / Gerrit / 其他 Git hosting）：
   - Repository URL、default branch、clone 方式
   - Issue tracker / Pull Request / Code Review 入口
   - CI/CD 或平台功能（GitHub Actions、Releases、Pages、Gerrit review flow）
   - 貢獻流程限制（例如 Change-Id、commit message 規範、submit 流程）

### Step 3: 撰寫 README.md

遵循以下結構：

```markdown
# [專案名稱]

[簡短描述，1-2 句話說明專案用途]

## Features

- [主要功能 1]
- [主要功能 2]
- [主要功能 3]

## Installation

[安裝步驟，依專案類型調整]

```bash
[安裝命令]
```

## Usage

[使用範例]

```[語言]
[程式碼範例]
```

## Project Structure

```
[專案目錄結構]
```

## Configuration

[設定選項說明，若有]

## Development

[開發環境設定]

```bash
[開發相關命令]
```

## Testing

[測試執行方式]

```bash
[測試命令]
```

## Contributing

[貢獻指南，可簡化]

## License

[授權資訊]
```

### Step 4: 依託管平台調整內容

- **Generic Git**：保持平台中立，優先說明 clone、install、usage、project structure、license。
- **GitHub**：視需要加入 repository links、badges、Issues、Pull Requests、GitHub Actions、Releases、Packages、Pages 或 Demo 連結。
- **Gerrit**：視需要加入 clone URL、review URL、Change-Id 要求、`git review` 或 `git push origin HEAD:refs/for/<branch>` 流程。
- **GitHub + Gerrit 並存**：主體保持平台通用，把 review / issue / contribution 差異獨立寫在 `Contributing`、`Development` 或 `Links` 章節。

### Step 5: 依專案類型調整內容

依專案類型調整章節：

- **前端專案**：加入 Screenshots、Demo 連結
- **API/後端**：加入 API 文件連結、Swagger 資訊
- **CLI 工具**：加入命令參考、使用範例
- **函式庫**：加入 API 參考、整合範例

## Writing Guidelines

1. **簡潔清晰**：避免冗長，直接說明用途
2. **提供範例**：程式碼範例勝過千言萬語
3. **結構完整**：至少包含 Installation、Usage
4. **語氣一致**：使用祈使句或描述句，保持一致
5. **避免 emoji**：除非使用者明確要求
6. **平台分層**：先寫平台通用內容，再補 GitHub / Gerrit 專屬資訊，避免 README 過度綁定單一平台

## References

- 參考現有 skill 的 README 結構：[README.md](../README.md)
- Markdown 撰寫規範：參考 [markdown-writer](../markdown-writer/) skill
