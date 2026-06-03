# Performance

## 先量測再優化

- 使用 Chrome DevTools Performance 與 Vue DevTools profiler；必要時開啟 `app.config.performance` 取得 Vue markers（Vue 官方建議）。

## Page Load（初次載入）

- 避免把所有頁面當純 CSR SPA 發佈給 SEO/首屏敏感頁：考慮 SSR / SSG（Vue 官方在效能章節強調架構選擇）。
- 控制 bundle size：使用 build step（模板預編譯、tree-shaking），避免不必要的大型依賴。
- 路由層級 lazy loading；大型功能模組再做更細 code split。

## Update（互動更新）

- **Props stability**：傳給子元件的 props 盡量穩定；把「是否 active」等判斷先在父層算好，避免一個變更導致整個列表全部更新。
- 善用 `v-once`（不再更新的子樹）、`v-memo`（條件性跳過更新）。
- 大列表：使用 virtualization；不要一次 render 上千 DOM。

## 大型資料的 Reactivity 成本

- Vue reactivity 預設是 deep；遇到大型且近似 immutable 的巢狀結構，可用 `shallowRef()` / `shallowReactive()` 降低追蹤成本（但更新要以替換 root 為主）。

## 抽象成本

- 避免為了「乾淨」而堆大量 renderless / HOC 元件；component instance 比 DOM node 貴，在大列表特別顯著。
