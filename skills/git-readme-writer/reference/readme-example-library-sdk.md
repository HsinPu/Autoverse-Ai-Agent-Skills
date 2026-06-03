# Library / SDK README 範例

## When to Use

- repository 提供 reusable package、SDK、framework extension、shared module。
- 讀者主要關心 installation、compatibility、API surface 與 quick example。

## Reader Focus

- integrator：如何安裝、相容哪些版本、最小接法是什麼。
- maintainer / contributor：如何開發、如何發版、如何測試。

## What to Highlight

- package purpose
- installation steps
- supported versions / compatibility matrix
- quick example and API overview
- links to detailed docs if API 很大

## Example Skeleton

~~~markdown
# fast-rule-engine

一個用於定義與執行 business rules 的 TypeScript library。

## Installation

```bash
npm install fast-rule-engine
```

## Quick Example

```ts
import { createEngine } from "fast-rule-engine"

const engine = createEngine()
engine.addRule({ when: { score: { gte: 80 } }, then: "pass" })
```

## Compatibility

- Node.js 18+
- TypeScript 5+

## API Overview

- `createEngine()`
- `addRule()`
- `evaluate()`

## Contributing

請先閱讀 `CONTRIBUTING.md`。
~~~

## Variation Notes

- 若是 multi-language SDK，可把 `Installation` 分成多語言小節。
- 若是 large API library，README 只放 `Quick Example` 與 `Key Modules`，再連到 docs site。
- 若是 internal SDK，可補 `Release Process` 或 `Ownership`。
