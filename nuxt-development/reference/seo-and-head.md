# SEO / Head

## Head 管理（Unhead）

- 全站固定的 tags 放 `nuxt.config.ts` 的 `app.head`（不可 reactive）。
- 需要 reactive 的 head：用 `useHead()`（通常放 `app.vue` 做全域 titleTemplate），各頁面再補充。
- 需要 SEO meta 的 type-safe 快捷：用 `useSeoMeta()`。

## `definePageMeta`

- 在 `app/pages/` 可用 `definePageMeta()` 設定 route-level metadata（例如 title）。
- macro 在 build-time 萃取，**不適合**做動態 title；動態 title 用 `useHead`。

## 安全注意

- 盡量避免把使用者輸入直接塞進 `useHead`（尤其 `script.innerHTML` / `v-html`）；必要時做 sanitize。
- 若涉及渲染不可信 HTML，請參考 Vue Security Best Practices。
