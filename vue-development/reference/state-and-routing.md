# State / Routing

## State（本地 vs 全域）

- 能本地就本地（元件內 `ref/reactive`）；跨多個頁面或深層樹狀共用才上升到 store。
- 小型共享狀態可用 module-scope `reactive()`，但一旦涉及大型協作/DevTools/HMR/SSR，建議用 Pinia。

## Pinia（建議做法）

- 一個 store 一個檔案，命名慣例 `useXxxStore`。
- 需要從 store 解構出 state/getters 時，用 `storeToRefs()`，不要直接 destructure（會破壞 reactivity）。
- Setup store 更彈性，但要注意 SSR 與 composables 的複雜度；Option store 較直觀。

## SSR 注意事項

- 任何 module-scope 單例狀態在 SSR 可能造成 cross-request state pollution；SSR 需 per-request 建立 app/router/store。
- Pinia SSR hydration：序列化 state 時要 escape（Pinia 官方建議使用 `devalue`；或可用 `JSON.stringify`/`JSON.parse`，視 state 可否安全序列化）。

## Routing（Vue Router）

- 路由元件（views/pages）優先做 route-level code splitting：用 dynamic import lazy load（Vue Router 官方建議）。
- 需要 route meta 權限控制時，用 navigation guards + meta，避免把權限判斷散落在每個頁面。
- Data fetching 與路由切換要處理取消/競態（例如快速切頁導致舊請求覆蓋新結果）。
