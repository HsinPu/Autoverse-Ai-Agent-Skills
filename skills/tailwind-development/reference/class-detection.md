# Build / Class Detection

## 最重要規則：不要動態拼 class 名

- Tailwind 以純文字掃描 source files，無法理解字串插值/拼接。
- 不要 `bg-${color}-500`；要用 map：`{ blue: 'bg-blue-500', red: 'bg-red-500' }[color]`。

## Source 掃描與 monorepo

- 預設不掃 `.gitignore`、`node_modules`、binary、CSS 等。
- 若要掃描外部 UI package：用 `@source "../node_modules/@scope/ui"`。
- monorepo/build 從 root 執行時可用 `@import "tailwindcss" source("../src");` 指定 base path。

## Safelist / Exclude

- 需要強制生成某些 utilities：用 `@source inline("underline")`。
- 需要 hover/focus 變體：`@source inline("{hover:,focus:,}underline")`。
- 需要排除大量 class（即使被偵測到）：`@source not inline(...)` 或忽略特定路徑 `@source not "..."`。
