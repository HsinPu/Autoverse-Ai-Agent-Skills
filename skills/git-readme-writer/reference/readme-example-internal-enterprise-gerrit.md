# Internal / Enterprise / Gerrit README 範例

## When to Use

- repository 主要供企業內部或封閉團隊使用。
- 專案依賴 Gerrit review flow、VPN、權限控管、內部工具鏈。

## Reader Focus

- internal developers：如何取得權限、如何 setup、如何提交 review。
- reviewers / approvers：review expectations、submit flow、ownership。

## What to Highlight

- prerequisites and access requirements
- local setup
- development workflow
- Gerrit review / submit flow
- support and ownership contacts

## Example Skeleton

~~~markdown
# vehicle-platform-config

此 repository 管理車載平台的 deployment config 與 environment profiles。

## Prerequisites

- 公司 Git 帳號
- VPN access
- `git-review` 已安裝

## Local Setup

```bash
git clone ssh://gerrit.example.com:29418/vehicle-platform-config
git review -s
```

## Development Workflow

1. 建立 branch。
2. 修改設定並執行驗證腳本。
3. commit 時保留 `Change-Id`。

## Code Review

```bash
git push origin HEAD:refs/for/main
```

## Support

若需 production access，請聯絡 Platform Ops team。
~~~

## Variation Notes

- 若 GitHub 只是 mirror，可在 `Contributing` 明寫 authoritative review platform 是 Gerrit。
- 若有嚴格 branch policy，可額外補 `Branch Strategy`。
- 若 repo 不是開源，不一定要有 `License`，可改成 `Ownership` 或 `Usage Policy`。
