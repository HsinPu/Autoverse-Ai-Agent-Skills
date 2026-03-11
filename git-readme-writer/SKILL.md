---
name: git-readme-writer
description: Analyze Git repository structure and write professional README.md documentation. Use when the user wants to create or write a README file for a Git repository, document a project, or generate project documentation.
---

# Git README Writer

## Purpose

此 skill 協助分析 Git 專案結構並撰寫專業、完整的 README.md 介紹文件。

## When to Use

- 使用者要求為 Git 專案寫 README
- 需要建立專案介紹文件
- 需要文件化專案結構、安裝方式、使用說明
- 需要更新或重構現有 README

## Workflow

### Step 1: 分析專案結構

執行以下命令了解專案：

```bash
# 查看專案檔案結構
ls -la

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

### Step 4: 調整內容

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

## References

- 參考現有 skill 的 README 結構：[README.md](../README.md)
- Markdown 撰寫規範：參考 [markdown-writer](../markdown-writer/) skill
