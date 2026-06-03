# Minimal README 範例（Minimal README Examples）

## When to Use

- repo 還在 early stage，只需要讓讀者快速知道用途與啟動方式。
- 專案很小，使用者只需要 install / run / one example。
- 暫時不需要完整 architecture、FAQ、roadmap、deployment docs。

## What to Highlight

- 一句話說明 value proposition。
- 最短路徑的 install / quick start。
- 一個最小 usage example。
- 若是公開專案，至少補 `License`。

## Minimal App README

~~~markdown
# Aurora Notes

一個簡單的個人筆記 web app。

## Quick Start

```bash
npm install
npm run dev
```

## Tech Stack

- React
- Vite
- LocalStorage

## License

MIT
~~~

## Minimal Library README

~~~markdown
# tiny-cache

一個輕量的 in-memory cache library。

## Installation

```bash
npm install tiny-cache
```

## Usage

```ts
import { createCache } from "tiny-cache"

const cache = createCache()
cache.set("user", { id: 1 })
```
~~~

## Minimal CLI README

~~~markdown
# img-resize-cli

批次調整圖片尺寸的 CLI 工具。

## Install

```bash
npm install -g img-resize-cli
```

## Example

```bash
img-resize input/*.png --width 800
```
~~~
