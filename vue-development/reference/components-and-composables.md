# Components / Composables

## 元件介面設計

- 以「props down, events up」為預設：子元件不要直接改父層狀態。
- 不要 mutate props；需要雙向綁定時用 `v-model`（`modelValue` + `update:modelValue`）。
- 對外暴露的 props 盡量小而穩定；把「可選 UI 行為」做成語意清楚的 props（例如 `disabled`, `loading`, `variant`）。
- Slots 用於「內容/結構的擴展」，不要把資料流程塞進 slot。

## Composables（useXxx）

- composable 負責可重用的狀態/副作用/資料存取；元件負責 UI 與互動。
- composable 內部若使用 lifecycle hooks / provide/inject，測試時需要 host component 包起來（見 Vue Testing 官方建議）。
- 避免在 composable 隱式依賴全域單例（尤其 SSR）；必要時用參數注入依賴（例如傳入 `fetcher`, `router`, `storage`）。

## 常見反模式

- 把大型物件直接當 props 傳遞且每次 render 都重新建立，導致子元件大量更新（見效能章節的 props stability）。
- 把「可控的資料」放在多個地方（本地 ref + store + URL query）並互相同步；請選一個 source of truth。
