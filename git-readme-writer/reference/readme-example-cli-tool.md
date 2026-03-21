# CLI Tool README 範例

## When to Use

- repository 的核心是 command-line tool、generator、audit tool、migration utility。
- 使用者多半會先找 install command、command reference、real-world examples。

## Reader Focus

- operators / developers：如何安裝、怎麼執行、有哪些 flags。
- contributors：如何本機開發與釋出。

## What to Highlight

- install command
- quick start
- commands / flags / examples
- config file or env vars
- troubleshooting for common failures

## Example Skeleton

~~~markdown
# repo-audit

`repo-audit` 用來掃描 repository 中的 secrets、large files 與 risky configs。

## Installation

```bash
npm install -g repo-audit
```

## Quick Start

```bash
repo-audit scan .
```

## Commands

- `repo-audit scan <path>`：掃描指定目錄
- `repo-audit report`：輸出 HTML 報告
- `repo-audit config init`：建立設定檔

## Examples

```bash
repo-audit scan . --format json
repo-audit report --input result.json
```

## Troubleshooting

若掃描大型 monorepo 太慢，請加上 `--exclude`。
~~~

## Variation Notes

- 若有多平台安裝方式，可增加 Homebrew / Scoop / npm / PyPI 小節。
- 若 CLI 輸出有固定格式，可加 `Output Format` 或 `Exit Codes`。
- 若是 internal tool，可補 binary distribution 或 internal registry 位置。
