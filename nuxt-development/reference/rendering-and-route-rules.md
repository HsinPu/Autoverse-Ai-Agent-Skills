# Rendering / Route Rules

## 渲染模式選擇

- 預設 SSR（universal rendering）通常更有利於首屏與 SEO。
- 若整站不需要 SEO 且更像 web app，可考慮 `ssr: false`（但要接受首屏 JS 成本與 SEO 代價）。

## Hydration 與環境差異

- 同一份程式在 server render 與 client hydration 都會跑一遍；不要依賴「只會跑一次」。
- Browser-only API（`window/document/localStorage`）只能在 client-only 時機使用（例如 `onMounted` 或以 client-only 元件包起來）。
- 匯入帶 side effects 且依賴瀏覽器 API 的套件時，確保它只會在 client side 被執行。

## Hybrid Rendering（Route Rules）

- Nuxt 支援以 `routeRules` 針對不同路由指定：`prerender`、`swr`、`isr`、`ssr: false`、headers、redirect、cors 等。
- 常見策略：
  - 行銷/內容頁：`prerender` / `isr`
  - 產品列表：`swr`
  - 管理後台：`ssr: false`
- 注意：`nuxt generate` 不能使用 Hybrid Rendering。
