# JavaScript 程式碼風格（Code Style）

## 原則

- **可讀性優先**：寧可多寫 2 行，也不要省略到難讀。
- **一致性優先**：遵循 repo 現有風格（命名、縮排、匯入順序、錯誤處理）。
- **避免隱式行為**：偏好明確型別/結構/回傳值；避免魔法字串與硬編碼。

## 語言與語法

- **目標版本**：預設以 ES2022+ 為基準（Node 18+ / 現代瀏覽器）。
- **嚴格模式**：
  - ESM 天然是 strict mode。
  - CJS 建議檔案頂部加上 `"use strict";`。

## 命名

- `camelCase`：變數、函式、方法（`getUserById`）。
- `PascalCase`：class、建構器（`UserService`）。
- `SCREAMING_SNAKE_CASE`：模組常數（`DEFAULT_TIMEOUT_MS`）。
- **動詞導向**：函式用動詞開頭（`parse...`、`format...`、`build...`、`list...`）。
- **避免縮寫**：除非是領域常用（API、URL、ID）。

## 模組（ESM/CJS）

- **優先 ESM**：新專案推薦 ESM（`"type": "module"`）。
- **CJS 與 ESM 不要混用**：除非真的需要相容性層；要混用則集中在單一 adapter。

ESM：

```js
import { readFile } from "node:fs/promises";
import { z } from "zod";

export function parseConfig(text) {
  return z.object({}).parse(JSON.parse(text));
}
```

CJS：

```js
"use strict";

const { readFile } = require("node:fs/promises");

module.exports = { readFile };
```

## 匯入順序

建議分組並保持穩定：

1. Node 內建（`node:`）
2. 第三方套件
3. 專案內部模組

## 物件與不可變

- 預設用 `const`；需要重新指派才用 `let`。
- 偏好不可變資料流：
  - 小物件更新用展開（`{ ...obj, x: 1 }`）
  - 大資料結構用專用結構或 immutable helper（視專案而定）

## 函式與 API 設計

- 單一職責：一個函式做一件事。
- **輸入/輸出清楚**：
  - 回傳值一致（不要有時回 `null` 有時丟 error）
  - 避免 boolean 旗標爆炸（用 options object 取代）

### 用 options object 取代多參數

```js
export function fetchUsers({ query, limit = 20, offset = 0 }) {
  // ...
}
```

## 型別提示（JSDoc + @ts-check）

即使不寫 TypeScript，也建議用 `@ts-check` + JSDoc 提升安全性：

```js
// @ts-check

/** @typedef {{ id: string, name: string }} User */

/** @param {User[]} users */
export function indexById(users) {
  /** @type {Record<string, User>} */
  const map = {};
  for (const u of users) map[u.id] = u;
  return map;
}
```

## Lint / Format（建議）

- **Formatter**：Prettier（或 biome）
- **Linter**：ESLint（配合 `eslint-config`）
- **基本規則**：
  - `no-unused-vars`
  - `no-floating-promises`（若有 TS/型別工具）
  - `eqeqeq`
  - `no-implicit-coercion`
  - `prefer-const`

原則：格式交給 formatter；lint 負責語意與 bug 風險。
