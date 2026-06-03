# JavaScript 安全最佳實踐（Security）

## 依賴與供應鏈

- 鎖版：使用 lockfile（`package-lock.json` / `pnpm-lock.yaml` / `yarn.lock`）。
- 定期掃描：`npm audit`、SCA 工具（Dependabot 等）。
- 避免執行未知的 postinstall 腳本（特別在 CI）。

## Secrets

- Secrets 只能放環境變數或秘密管理服務；不要寫進 repo。
- log 時避免印出 token、cookie、Authorization header。

## 輸入驗證

- 所有外部輸入（HTTP body、query、env、file path）都必須驗證。
- schema 驗證工具：Zod / Valibot / Joi（依專案）。

## 路徑穿越（Path Traversal）

- 對使用者給的路徑要 normalize，並強制限制在允許的 root 下。

## SSRF / 任意 URL 請求

- 若 tool/服務允許輸入 URL，必須做 allowlist、禁止內網位址、限制協定（只允許 https）。

## 注入

- SQL：永遠用參數化查詢（不要字串拼接）。
- Shell：避免 `exec("cmd " + userInput)`；必要時用安全 API（spawn + args array）。
- HTML：輸出到 DOM 前要 escape / sanitize；避免 innerHTML 直接塞使用者輸入。
