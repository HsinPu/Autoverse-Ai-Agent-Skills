# AJAX 與資料流（AJAX and Data）

## 優先使用 fetch（若可）

在可用環境中，建議新程式用 `fetch`；但若專案全用 `$.ajax`，維持一致性也合理。

## $.ajax 基本模式

- 一律處理失敗（HTTP 非 2xx、timeout、JSON parse error）。
- 對會修改資料的請求加上 CSRF header（依專案機制）。

```js
export function apiPost(url, data, { timeoutMs = 15000 } = {}) {
  return $.ajax({
    url,
    method: "POST",
    data: JSON.stringify(data),
    contentType: "application/json",
    dataType: "json",
    timeout: timeoutMs,
  });
}
```

## jqXHR 與 Promise

- jqXHR 是 thenable，但行為不完全等同原生 Promise。
- 若要統一 async/await，可用 `Promise.resolve(...)` 包一層：

```js
const result = await Promise.resolve($.getJSON("/api/users"));
```

## 表單序列化

- 用 `$(form).serializeArray()` 時要處理 checkbox、多值欄位。
- 對敏感欄位避免直接組 HTML 回填。

## 競態（Race conditions）

- 連續輸入（搜尋、autocomplete）要做：
  - 取消前一個請求（若用 fetch/AbortController）
  - 或用 requestId/時間戳只接受最新回應
