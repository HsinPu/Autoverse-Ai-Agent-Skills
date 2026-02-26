---
name: jquery-development
description: Read when working with jQuery in legacy or hybrid frontends. Provides best practices for selectors, event delegation, DOM performance, plugin patterns, AJAX, security, and migration guidance.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# jQuery 開發（jQuery Development）

**撰寫或維護 jQuery 程式碼時請讀取本 skill。**

本 skill 聚焦在現有專案的 jQuery 最佳實踐：效能、可維護性、事件綁定、AJAX、常見陷阱（記憶體洩漏、重複綁定、XSS）、以及逐步遷移策略。

## 進階與參考（Bundled resources）

- **選擇器與效能**：DOM 查找、快取、批次更新、事件委派，見 [reference/selectors-and-performance.md](reference/selectors-and-performance.md)。
- **事件與元件化**：事件命名空間、重複綁定避免、資料屬性、可測試的初始化流程，見 [reference/events-and-components.md](reference/events-and-components.md)。
- **AJAX 與資料流**：`$.ajax` / `$.getJSON`、timeout、錯誤處理、序列化與防呆，見 [reference/ajax-and-data.md](reference/ajax-and-data.md)。
- **安全**：XSS/HTML 注入、DOM-based XSS、URL 與 selector 注入等，見 [reference/security.md](reference/security.md)。
- **遷移**：逐步減少 jQuery、與原生 DOM/現代框架共存、`noConflict`，見 [reference/migration.md](reference/migration.md)。
