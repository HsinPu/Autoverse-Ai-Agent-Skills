# Server / API（Nitro）

## Nitro 與 `server/`

- Nuxt 的 server engine 是 Nitro，`server/api/` 會自動變成 API endpoints，`server/middleware/` 會成為 server middleware。
- Nitro 使用 h3，handler 可直接 return object/array（自動 JSON response），也支援 async。

## Direct API Calls

- 在 server side 執行 `$fetch('/api/...')` 可能會直接呼叫對應 handler（省一次 HTTP round trip）。

## Typed Routes

- 若 API routes 回傳值（不是 `res.end()`），Nitro 會生成 typings，`$fetch` / `useFetch` 可推導 response type。

## 序列化差異

- `useAsyncData` payload 使用 `devalue`（可序列化較多型別）。
- server API response 預設使用 `JSON.stringify`；Date/Map/Set 等需自行轉換或定義 `toJSON()`。
