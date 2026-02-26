# 事件與元件化（Events and Components）

## 初始化（Init）

- 建議單一進入點：`initPage()` / `initWidget($root)`。
- 初始只做一次；避免局部更新時重複 bind。

```js
export function initUserPage($root) {
  bindUserEvents($root);
  hydrateFromServer($root);
}
```

## 避免重複綁定

- **事件命名空間**：`"click.userPage"`，重掛前先 `off`。

```js
function bindUserEvents($root) {
  $root.off("click.userPage");
  $root.on("click.userPage", "[data-action='save']", onSave);
}
```

建議：用「namespace + selector」精準移除，避免影響其他功能綁定的 handler。

## `this` 與 `e.currentTarget`

- 在 jQuery handler：
  - `this` 通常是 currentTarget（不要依賴除非你確定）
  - 更建議用 `e.currentTarget`

```js
function onSave(e) {
  const $btn = $(e.currentTarget);
  $btn.prop("disabled", true);
}
```

注意：`e.target` 可能是更深層的子元素（例如 icon），在委派事件中多數情況你要用 `e.currentTarget`。

## `return false` 的語意

在 jQuery 事件 handler 裡 `return false` 會同時執行：

- `e.preventDefault()`
- `e.stopPropagation()`

這常常比預期「更強」；除非你真的要同時阻止預設行為與冒泡，不然建議明確呼叫其中一個。

## focus/blur 與委派

原生 `focus`/`blur` 不 bubble；jQuery 會用 `focusin`/`focusout` 做跨瀏覽器一致化。

委派時建議直接用 `focusin`/`focusout`：

```js
$root.on("focusin.form", "input, textarea", onFocus);
$root.on("focusout.form", "input, textarea", onBlur);
```

## Delegation 限制

- jQuery 官方文件註記：委派事件不支援 SVG。

## 資料來源

- 優先用 `data-*` 當 UI 與邏輯界線：
  - `data-action`, `data-id`, `data-url`
- 用 `$el.data("id")` 讀取；必要時在渲染時就寫入。

## 元件模式（小型）

- 用 closure 包狀態，暴露最小 API：

```js
export function createToast($root) {
  let timer = null;

  function show(message) {
    $root.text(message).addClass("is-visible");
    clearTimeout(timer);
    timer = setTimeout(hide, 2500);
  }

  function hide() {
    $root.removeClass("is-visible");
  }

  return { show, hide };
}
```

## Plugin pattern（需要可重用時）

- 只在需要跨頁重用、可配置、可鏈式操作時才做 plugin。
- 使用 `$.fn.myPlugin = function(options) { ...; return this; }`。

---

## 參考

- jQuery API: `.on()`：https://api.jquery.com/on/
- jQuery API: `.off()`（namespaces best practice）：https://api.jquery.com/off/
- jQuery Learning Center: Event Delegation：https://learn.jquery.com/events/event-delegation/
