# Security

## 最重要規則：不要用不可信 template

- **永遠不要**把使用者輸入拼成 Vue template（等同允許任意 JS 執行；SSR 時甚至可能影響伺服器）。

## XSS / Injection 常見來源

- `v-html`：只有在你「確定內容安全」時使用；使用者輸入的 HTML 不應直接渲染。
- URL 注入：`href/src` 等若來自使用者資料，要後端先做 sanitize；前端可再做基本檢查（但不要把前端當防線）。
- style 注入：避免讓使用者直接控制整段 CSS；改用 object 語法，只允許安全屬性白名單。

## 掛載點安全

- 不要把 Vue mount 在「可能包含 server-rendered 使用者內容」的節點上，避免把原本安全的 HTML 變成可被 template expression 執行的上下文（Vue 官方安全章節提到此類風險）。

## SSR

- SSR 序列化/注入狀態要 escape（Pinia 官方 SSR 章節特別提醒）；避免把可控內容直接插進 `<script>`。
