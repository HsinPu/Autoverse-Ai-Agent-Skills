# 安全（Security）

## XSS / HTML 注入

- **預設用 `.text()`**，只有在內容完全可信時才用 `.html()`。

```js
$("#msg").text(serverMessage);
```

- 若必須插入 HTML：使用可信 template + escape（或 sanitize library）。

## DOM-based XSS

- 避免把 `location.search` / hash 直接丟到 `.html()` 或 selector。
- 若要用 query 參數：先 parse + allowlist。

## Selector 注入

如果 selector 是由外部輸入拼出來（尤其包含 `]`、`'`、`"`），容易出錯或被利用。
- 改用 `data-*` 查找或 `document.getElementById`。

## URL 與跳轉

- 外部連結/跳轉 URL 用 allowlist 或同源限制。

## AJAX 安全

- POST/PUT/DELETE 一律帶 CSRF token（依後端）。
- 不要把敏感資訊放 query string。
