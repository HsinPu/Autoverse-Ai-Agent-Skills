# 目錄結構與約定（Directory & Conventions）

## 生成輸出：`.nuxt/`

- `.nuxt/` 是開發期生成的檔案（VFS / templates 也會出現在這裡）。
- **不要修改** `.nuxt/` 內的任何檔案；每次 `nuxt dev` 都可能重建。
- `.nuxt/` 必須加入 `.gitignore`。

## Auto-imports 與使用情境

- Nuxt 會 auto-import：`app/components/`、`app/composables/`、`app/utils/`，以及 Vue / Nuxt 內建 API。
- auto-import 不是「全域宣告」：只會把實際用到的東西打包（tree-shaking）。
- 需要顯式 import 時可從 `#imports` 匯入。

## Nuxt Context / 可用範圍

- 許多 Nuxt composables 依賴 Nuxt context；只能在：
  - `defineNuxtPlugin`（plugins）
  - `defineNuxtRouteMiddleware`（route middleware）
  - Vue setup（pages / components）
  - 特定 Nuxt hooks
- 遇到 `Nuxt instance is unavailable` 幾乎都是「在錯的地方呼叫 composable」或「先 await 再呼叫」造成。

## 建議的結構分層

- `app/pages/` 放 route views（資料抓取 + layout 組裝）。
- 可重用 UI 放 `app/components/`；可重用邏輯放 `app/composables/`。
- 服務端 API 放 `server/api/`；共用 server helper 放 `server/utils/`。
