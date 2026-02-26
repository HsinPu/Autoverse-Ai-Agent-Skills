# 安全（Security）

## XSS / HTML 注入

- **預設用 `.text()`**，只有在內容完全可信時才用 `.html()`。

```js
$("#msg").text(serverMessage);
```

- 若必須插入 HTML：使用可信 template + escape（或 sanitize library，例如 DOMPurify）。

### 安全預設

- 不信任任何來自使用者、URL、後端回傳的 HTML 字串。
- 只要你用了 `.html()`/`.append("<...>")` 之類的 API，**就要假設有 XSS 風險**。

jQuery 團隊在 3.5.0 提到 `htmlPrefilter` 相關的安全修正，並建議用 DOMPurify 來 sanitize user HTML。

## DOM-based XSS

- 避免把 `location.search` / hash 直接丟到 `.html()` 或 selector。
- 若要用 query 參數：先 parse + allowlist。

## Selector 注入

如果 selector 是由外部輸入拼出來（尤其包含 `]`、`'`、`"`），容易出錯或被利用。
- 改用 `data-*` 查找或 `document.getElementById`。
- 若必須用動態 selector，請先 `$.escapeSelector(...)`。

## URL 與跳轉

- 外部連結/跳轉 URL 用 allowlist 或同源限制。

## AJAX 安全

- POST/PUT/DELETE 一律帶 CSRF token（依後端）。
- 不要把敏感資訊放 query string。

---

## 參考

- OWASP: DOM Based XSS：https://owasp.org/www-community/attacks/DOM_Based_XSS
- jQuery Blog: jQuery 3.5.0 security fix & DOMPurify mention：https://blog.jquery.com/2020/04/10/jquery-3-5-0-released/
