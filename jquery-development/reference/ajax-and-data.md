# AJAX 與資料流（AJAX and Data）

## 優先使用 fetch（若可）

在可用環境中，建議新程式用 `fetch`；但若專案全用 `$.ajax`，維持一致性也合理。

若正在逐步現代化，先建立一個小型 request wrapper，統一 CSRF、timeout、JSON parsing、錯誤格式與 cancellation，再逐步把 `$.ajax` 呼叫搬進 wrapper。

## $.ajax 基本模式

- 一律處理失敗（HTTP 非 2xx、timeout、JSON parse error）。
- 對會修改資料的請求加上 CSRF header（依專案機制）。
- 避免 `async: false`（會鎖 UI；jQuery 也不鼓勵）。

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

## jqXHR 的正確用法（done/fail/always）

`$.ajax()` 回傳的是 jqXHR（Promise-like）。

- 建議：`.done()` / `.fail()` / `.always()`
- 不要用：`jqXHR.success()` / `jqXHR.error()` / `jqXHR.complete()`（jQuery 3.0 起移除）

```js
$.ajax({ url: "/api/users", dataType: "json" })
  .done((data) => {
    // ...
  })
  .fail((jqXHR, textStatus, errorThrown) => {
    // ...
  })
  .always(() => {
    // ...
  });
```

## jqXHR 與 Promise

- jqXHR 是 thenable，但行為不完全等同原生 Promise。
- 若要統一 async/await，可用 `Promise.resolve(...)` 包一層：

```js
const result = await Promise.resolve($.getJSON("/api/users"));
```

## 取消與逾時

若你需要「逾時即取消」，可以用 `jqXHR.abort()`：

```js
export function ajaxWithTimeout(settings, timeoutMs) {
  const jqxhr = $.ajax(settings);
  const timer = setTimeout(() => jqxhr.abort("timeout"), timeoutMs);

  jqxhr.always(() => clearTimeout(timer));
  return jqxhr;
}
```

## 表單序列化

- 用 `$(form).serializeArray()` 時要處理 checkbox、多值欄位。
- 對敏感欄位避免直接組 HTML 回填。

## 競態（Race conditions）

- 連續輸入（搜尋、autocomplete）要做：
  - 取消前一個請求（若用 fetch/AbortController）
  - 或用 requestId/時間戳只接受最新回應

## 跨網域 script 與 JSONP（安全）

- 跨網域載入 script 時，jQuery 3.0 起需要顯式指定 `dataType: "script"`。
- jQuery 4 升級時也要重新測試 AJAX script execution；若預期執行 script，使用 `dataType: "script"` 或 `$.getScript()` 明確表達。
- JSONP 風險高（屬於 script injection 形式）；除非必要，不建議。
- 若你不信任目標站台，`$.ajax` 可設 `jsonp: false` 避免自動注入 callback。

## fetch 替代模式

```js
export async function requestJson(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 15000);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}
```

注意：`fetch` 不會因 HTTP 4xx/5xx 自動 reject，這和很多人對 `$.ajax().fail()` 的直覺不同。

---

## 參考

- jQuery API: `jQuery.ajax()`：https://api.jquery.com/jQuery.ajax/
- jQuery Upgrade Guide 3.0（Ajax/Deferred breaking changes）：https://jquery.com/upgrade-guide/3.0/
