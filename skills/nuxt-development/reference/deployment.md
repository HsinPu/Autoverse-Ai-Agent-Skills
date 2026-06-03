# Deployment

## 產物與啟動

- `nuxt build` 會輸出到 `.output/`（包含 server 與 public assets）。
- Node preset 可用 `node .output/server/index.mjs` 啟動。

## Presets / Edge / Serverless

- 可在 `nuxt.config.ts` 設定 `nitro.preset`，或用環境變數 `NITRO_PRESET=...`。
- 依平台選擇 edge/serverless preset 以獲得最佳 cold start 與快取能力。

## Static hosting

- `nuxt generate` 或 `nuxt build --prerender` 會輸出靜態頁面；此模式下沒有 server endpoints。
- `ssr: false` 的 static 會輸出 SPA entrypoint（SEO 與首屏要自己承擔）。

## 反向代理 / CDN 注意

- 部分 CDN（例如 Cloudflare）可能注入腳本或最佳化行為造成 hydration mismatch；官方文件建議關掉 Rocket Loader 與 Email Address Obfuscation。
