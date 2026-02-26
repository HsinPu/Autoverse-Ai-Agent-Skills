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
