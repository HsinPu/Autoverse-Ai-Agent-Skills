# Data Fetching

## 核心原則

- 初次渲染需要的資料：用 `useFetch` / `useAsyncData`，避免 SSR + hydration double fetch。
- 只有互動事件才需要的資料：用 `$fetch`（例如 submit、點擊、client-only 行為）。

## `useFetch` vs `useAsyncData`

- `useFetch`：`$fetch` + `useAsyncData` 的常用糖；key 預設依 URL/選項生成。
- `useAsyncData`：更細粒度控制；建議自己指定 key（避免自動 key 只看檔案+行數造成碰撞）。

## 快取/去重（key, dedupe）

- 同 key 的 calls 會共享 `data/error/status` refs；部分 options 必須一致（官方文件列出一致性要求）。
- 需要獨立狀態就用不同 key。

## Payload 與最小化

- Nuxt 會把 server 取得的資料透過 payload 傳到 client，避免 hydration 後重抓。
- 用 `pick` / `transform` 減少 payload 體積（不會阻止後端回傳，但會降低傳到 client 的內容）。

## 取消/逾時/競態

- 使用 `signal`（AbortSignal）讓 handler 可取消；`refresh()` 在 `dedupe: 'cancel'` 時可中止前一次請求。
- 路由快速切換時要避免舊請求覆蓋新結果；可用 key 包含 route params。

## 避免 side effects

- `useAsyncData` / `useFetch` 的 handler 盡量 side-effect free。
- 若需要觸發一次性的副作用，使用 `callOnce`（Nuxt 提供 utility）。
