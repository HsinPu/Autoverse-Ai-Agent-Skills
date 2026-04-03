---
name: nuxt-development
description: Nuxt development guide covering application structure, rendering modes, data fetching, Nitro server routes, runtime config, SEO, performance, security, and deployment. Use when building, reviewing, or refactoring Nuxt 3/4 applications.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Nuxt 開發（Nuxt Development）

**在使用 Nuxt（以 Nuxt 3/4 + Vite + Vue 3 SFC 為主）開發全端/SSR 應用時請讀取本 skill。**

本 skill 以 Nuxt 官方文件為主要依據，整理偏實務的最佳做法：Nuxt 約定與目錄結構、渲染模式（SSR/CSR/Hybrid）、資料抓取與快取、Nitro（server engine）、Runtime Config、SEO/Head、效能與安全、部署。

## 適用範圍（Assumptions）

- Nuxt 3/4
- 以 `app/` 目錄（Nuxt 4 結構）為主
- 以 Nitro server routes（`server/`）提供 API / middleware

## 進階與參考（Bundled resources）

- **目錄結構與約定**：`app/`、`server/`、auto-imports、Nuxt context、生成輸出 `.nuxt/`，見 [reference/directory-and-conventions.md](reference/directory-and-conventions.md)。
- **Rendering / Route Rules**：SSR/CSR/Hybrid、hydration、`routeRules`、edge/ISR/SWR，見 [reference/rendering-and-route-rules.md](reference/rendering-and-route-rules.md)。
- **Data Fetching**：`$fetch` / `useFetch` / `useAsyncData`、key/cache/dedupe、payload、取消/timeout、避免 side effects，見 [reference/data-fetching.md](reference/data-fetching.md)。
- **Runtime Config / Env**：`runtimeConfig` 公私分離、環境變數覆寫規則、`.env` 讀取時機與安全，見 [reference/runtime-config-and-env.md](reference/runtime-config-and-env.md)。
- **SEO / Head**：Unhead、`app.head`、`useHead` / `useSeoMeta` / `definePageMeta`，見 [reference/seo-and-head.md](reference/seo-and-head.md)。
- **Server / API（Nitro）**：`server/api`、middleware、typed routes、direct API calls，見 [reference/server-and-api.md](reference/server-and-api.md)。
- **Deployment**：`.output`、Node/static/edge presets、`NITRO_PRESET`、反向代理注意事項，見 [reference/deployment.md](reference/deployment.md)。

---

## 外部參考（官方）

- Nuxt Introduction：`https://nuxt.com/docs/getting-started/introduction`
- Nuxt Rendering Modes：`https://nuxt.com/docs/guide/concepts/rendering`
- Nuxt Auto-imports：`https://nuxt.com/docs/guide/concepts/auto-imports`
- Nuxt Data Fetching：`https://nuxt.com/docs/getting-started/data-fetching`
- Nuxt SEO & Meta：`https://nuxt.com/docs/getting-started/seo-meta`
- Nuxt Runtime Config：`https://nuxt.com/docs/guide/going-further/runtime-config`
- Nuxt Server Engine（Nitro）：`https://nuxt.com/docs/guide/concepts/server-engine`
- Nuxt Deployment：`https://nuxt.com/docs/getting-started/deployment`
- Nuxt App Context：`https://nuxt.com/docs/guide/going-further/nuxt-app`
