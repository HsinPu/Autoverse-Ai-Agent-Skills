---
name: jquery-development
description: jQuery development guide for legacy or hybrid frontends, covering selectors, event delegation, DOM performance, plugin patterns, AJAX, security, and migration concerns. Use when maintaining, reviewing, or modernizing jQuery-based code.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# jQuery 開發（jQuery Development）

**撰寫或維護 jQuery 程式碼時請讀取本 skill。**

本 skill 聚焦在現有專案的 jQuery 最佳實踐：效能、可維護性、事件綁定、AJAX、常見陷阱（記憶體洩漏、重複綁定、XSS）、以及逐步遷移策略。

本 skill 以「官方文件 + 安全最佳實踐」為優先依據；遇到行為差異或升版問題，請以 jQuery Upgrade Guide 與 jQuery Migrate 的警告為準。

## 進階與參考（Bundled resources）

- **選擇器與效能**：DOM 查找、快取、批次更新、事件委派，見 [reference/selectors-and-performance.md](reference/selectors-and-performance.md)。
- **事件與元件化**：事件命名空間、重複綁定避免、資料屬性、可測試的初始化流程，見 [reference/events-and-components.md](reference/events-and-components.md)。
- **AJAX 與資料流**：`$.ajax` / `$.getJSON`、timeout、錯誤處理、序列化與防呆，見 [reference/ajax-and-data.md](reference/ajax-and-data.md)。
- **安全**：XSS/HTML 注入、DOM-based XSS、URL 與 selector 注入等，見 [reference/security.md](reference/security.md)。
- **遷移**：逐步減少 jQuery、與原生 DOM/現代框架共存、`noConflict`，見 [reference/migration.md](reference/migration.md)。

---

## 外部參考（官方/安全）

- jQuery API（Events/.on）：`https://api.jquery.com/on/`
- jQuery Learning Center（Event Delegation）：`https://learn.jquery.com/events/event-delegation/`
- jQuery API（.off）：`https://api.jquery.com/off/`
- jQuery API（Ajax）：`https://api.jquery.com/jQuery.ajax/`
- jQuery Upgrade Guide 3.0：`https://jquery.com/upgrade-guide/3.0/`
- jQuery Blog（3.5.0 security fix）：`https://blog.jquery.com/2020/04/10/jquery-3-5-0-released/`
- OWASP（DOM Based XSS）：`https://owasp.org/www-community/attacks/DOM_Based_XSS`
