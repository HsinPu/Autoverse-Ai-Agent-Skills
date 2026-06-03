# Template / Boilerplate README 範例

## When to Use

- repository 是 starter kit、template repository、scaffold、boilerplate。
- README 需要告訴讀者「這個 template 包含什麼」以及「如何拿來開新專案」。

## Reader Focus

- new project authors：如何建立新 repo、怎麼改名、哪些地方需要客製化。
- maintainers：如何更新 template baseline。

## What to Highlight

- included stack and defaults
- how to use this template
- files to customize first
- known limitations or opinionated choices

## Example Skeleton

~~~markdown
# react-enterprise-template

這是一個用於快速建立企業內部 React 專案的 template repository。

## Included

- Vite + React + TypeScript
- ESLint + Prettier
- Vitest + Playwright
- CI workflow

## How to Use

1. Click `Use this template`。
2. 建立新 repository。
3. 更新 `package.json` 與 `README.md`。

## Customize

- 修改 `src/app/config.ts`
- 替換 `docs/branding/` 中的品牌資產

## Limitations

此 template 預設採用 pnpm 與 Node.js 20。
~~~

## Variation Notes

- 若不是 GitHub template repo，可把 `Use this template` 改成 fork / clone / bootstrap script。
- 若 template 支援多種部署目標，可加 `Deployment Presets`。
- 若 template 很大，可補 `Remove What You Don't Need` 小節。
