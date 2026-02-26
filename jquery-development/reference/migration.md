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

若你要把老專案升到 jQuery 3+：

1. 用 jQuery Migrate 先跑起來，收斂 console 的 warning
2. 逐一移除 deprecated API（例如 `.bind()`/`.delegate()`/`.live()` 與各種 shorthand events）
3. 參照 upgrade guide 修正破壞性變更（Deferred/ready、Ajax script、安全相關行為）

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

---

## 參考

- jQuery Upgrade Guide 3.0：https://jquery.com/upgrade-guide/3.0/
- jQuery Learning Center: noConflict：https://learn.jquery.com/using-jquery-core/avoid-conflicts-other-libraries/
- Deprecated API index：https://api.jquery.com/category/deprecated/
