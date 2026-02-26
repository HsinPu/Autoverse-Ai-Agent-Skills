# JavaScript 非同步與錯誤處理（Async and Errors）

## async/await

- I/O（HTTP、DB、FS）一律用 async/await。
- 避免 `.then().catch()` 鏈式混雜在主流程；用 `try/catch` 包住清楚的區塊。

```js
export async function loadConfig(path) {
  try {
    const text = await fs.readFile(path, "utf8");
    return JSON.parse(text);
  } catch (err) {
    throw new Error(`Failed to load config at ${path}: ${toErrorMessage(err)}`);
  }
}
```

## Promise 併發

- 互相獨立的請求：`await Promise.all([...])`
- 需要「有成功就算」：`Promise.any([...])`
- 需要「收集成功/失敗」：`Promise.allSettled([...])`

避免無腦 `Promise.all` 導致大量併發壓垮外部服務；必要時用 concurrency limit。

## 逾時與取消（AbortController）

- HTTP/長任務建議支援 `AbortSignal`
- 對外 API 提供 `timeoutMs`，內部轉成 abort

```js
export async function fetchJson(url, { signal } = {}) {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
```

## 錯誤型別與訊息

- 只 catch 你能處理的錯誤；其他讓它往上拋。
- 錯誤訊息要能指引下一步（參數哪裡錯、預期格式是什麼、可用例子）。
- 盡量保留原始錯誤：
  - Node 16+ 支援 `new Error(msg, { cause: err })`

```js
export function toErrorMessage(err) {
  if (err instanceof Error) return err.message;
  return String(err);
}
```

## 重試（Retry）

- 僅對「暫時性錯誤」重試（429、503、timeout）。
- 使用退避（exponential backoff + jitter）。
- 重要：重試前確認操作是否 idempotent（避免重複下單/重複扣款）。

## Logging 與可觀測性

- 日誌要結構化（至少 key-value），避免全靠拼字串。
- 在錯誤訊息中帶上 requestId / correlationId（如果系統有）。
