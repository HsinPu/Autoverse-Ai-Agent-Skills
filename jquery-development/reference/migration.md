# 遷移與共存（Migration）

## 目標

- 不是「一次移除 jQuery」，而是把 UI 邏輯從 DOM 操作逐步抽離。

## 漸進式策略

1. **先收斂入口**：把散落的 `$(...).ready(...)` 收斂到 `init*` 函式。
2. **事件委派一致化**：以容器為單位集中 bind。
3. **抽出 service 層**：把 AJAX 封裝到 `api.*`；UI 只呼叫 service。
4. **抽出 component**：將複雜 widget 用小元件模式封裝。
5. **新功能用原生或框架**：舊的保持不動；新舊透過清楚介面互動。

## 升版策略（建議）

若專案可能仍有 jQuery 1.x / 2.x / 3.x 混用，先用 `jquery-version-migration` 做版本盤點和分段升級路線，不要直接跳到最新版本。

若你要把老專案升到 jQuery 3+：

1. 用 jQuery Migrate 先跑起來，收斂 console 的 warning
2. 逐一移除 deprecated API（例如 `.bind()`/`.delegate()`/`.live()` 與各種 shorthand events）
3. 參照 upgrade guide 修正破壞性變更（Deferred/ready、Ajax script、安全相關行為）

舊版優先清理：

- `.live()` / `.die()` -> delegated `.on()` / `.off()`
- `.bind()` / `.unbind()` / `.delegate()` / `.undelegate()` -> `.on()` / `.off()`
- `.success()` / `.error()` / `.complete()` -> `.done()` / `.fail()` / `.always()`
- event shorthand handlers -> `.on("event", handler)`
- 多版本 jQuery -> 儘量合併；短期共存需 `noConflict(true)` 和明確 DOM ownership

若目標是 jQuery 4，優先使用 `jquery-4-migration`，並特別檢查：

- `$.isArray` -> `Array.isArray`
- `$.parseJSON` -> `JSON.parse`
- `$.trim` -> `String(value).trim()`，並保留 null/undefined 防護
- `$.now` -> `Date.now`
- `$.type` / `$.isFunction` / `$.isNumeric` -> 明確的 native type checks
- `toggleClass(boolean)` -> `addClass` / `removeClass` / `toggleClass(className, state)`
- focus/blur/focusin/focusout event order 是否影響表單驗證、dropdown、autocomplete
- slim build 是否缺少 AJAX、effects、Deferreds 或 Callbacks

## 現代 API 替代表

新程式或可隔離的重構優先使用現代 Web API，但先確認專案 browser support：

- `$.ajax` -> `fetch` + `AbortController` + 專案統一 error wrapper
- `$.Deferred` -> native `Promise`
- jQuery animation -> CSS transitions/animations 或 Web Animations API
- 手寫 form validation -> Constraint Validation API 或專案表單驗證層
- URL 字串拼接 -> `URL` / `URLSearchParams`
- resize/scroll polling -> `ResizeObserver` / `IntersectionObserver` / throttled events
- `document.execCommand("copy")` -> Clipboard API

## 與原生 DOM 共存

- `$(el)` 與 `el` 交界要明確：
  - `const el = $el.get(0)`
  - `const $el = $(el)`

## noConflict

若需要避免 `$` 與其他庫衝突：

```js
const jq = jQuery.noConflict(true);
jq("#app").text("ok");
```

另一種常用寫法：保留全域 `$` 給其他庫，讓 jQuery 的 `$` 只在 ready callback 內有效：

```js
jQuery.noConflict();
jQuery(function ($) {
  $("#app").text("ok");
});
```

## 何時應該直接改掉

- 如果現有頁面已經嚴重耦合、無法可靠測試、bug 很多：考慮拆成新頁/新元件逐步替換，而不是在原本的 jQuery 泥沼中擴寫。
- 如果同一 DOM 區域同時被 jQuery plugin 和 React/Vue/Alpine 控制：先定義 ownership boundary，再移除其中一方的直接 DOM mutation。

## 現代化前先盤點

如果不確定頁面用了哪些前端技術，先用 `frontend-stack-inference` 盤點：

- jQuery/Bootstrap/plugin/global script usage
- bundler 或 no-bundler
- server-rendered templates 和 script order
- framework-owned DOM regions
- browser support / browserslist

---

## 參考

- jQuery Upgrade Guide 3.0：https://jquery.com/upgrade-guide/3.0/
- jQuery Upgrade Guide 4.0：https://jquery.com/upgrade-guide/4.0/
- jQuery Learning Center: noConflict：https://learn.jquery.com/using-jquery-core/avoid-conflicts-other-libraries/
- Deprecated API index：https://api.jquery.com/category/deprecated/
