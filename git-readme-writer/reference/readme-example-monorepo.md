# Monorepo README 範例

## When to Use

- root repository 包含多個 apps、packages、services 或 shared libs。
- root README 主要工作不是解釋單一 app，而是當作 workspace guide。

## Reader Focus

- newcomer：repo 裡面有哪些東西、從哪裡開始。
- contributor：常用 workspace commands、各 package 的子文件在哪。

## What to Highlight

- workspace layout
- package / app map
- common commands
- links to child READMEs
- ownership or release strategy if needed

## Example Skeleton

~~~markdown
# Atlas Workspace

這是一個包含 web app、API service 與 shared packages 的 monorepo。

## Workspace Layout

- `apps/web`：前端應用
- `apps/api`：後端服務
- `packages/ui`：共用 UI components
- `packages/config`：shared configs

## Common Commands

```bash
pnpm install
pnpm dev
pnpm test
```

## Working on a Package

- Web app: `pnpm --filter web dev`
- API: `pnpm --filter api dev`

## Additional Docs

- `apps/web/README.md`
- `apps/api/README.md`
~~~

## Variation Notes

- 若 monorepo 很大，可加 `Ownership` 或 `Dependency Graph`。
- 若不同 package 發版方式不同，可補 `Release Strategy`。
- 避免在 root README 重複寫每個 package 的完整 docs。
