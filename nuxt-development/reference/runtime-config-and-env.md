# Runtime Config / Env

## 公私分離

- `runtimeConfig` 的 private keys 只能在 server-side 讀取；`runtimeConfig.public` 才會暴露給 client。
- 不要把 secret 放進 `public`；也不要把 private config 透過 template render / `useState` 傳到 client。

## 環境變數覆寫規則

- Runtime config 會在 runtime 被環境變數覆寫，但必須符合 `NUXT_` 前綴與 key 結構（官方規則）。
- `nuxt.config` 裡把 runtimeConfig 預設值寫成 `process.env.OTHER_VARIABLE` 只會在 build-time 生效，runtime 會壞掉（官方警告）。

## `.env` 讀取時機

- Nuxt CLI 在 dev/build/generate 會讀 `.env`；但**跑 build 後的 server**時，`.env` 不會自動讀取（要靠部署環境注入 env）。
