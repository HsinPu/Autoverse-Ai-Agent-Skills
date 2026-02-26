# 選擇器與效能（Selectors and Performance）

## DOM 查找

- **縮小範圍**：在容器節點內查找（`$root.find(".item")`），避免全域選擇器。
- **避免過度複雜 selector**：尤其是深層 descendant selector。
- **避免在迴圈中重複查找**：先快取再用。

```js
const $list = $("#user-list");

for (const user of users) {
  // good: build HTML once, append once
}
```

## 快取與一致性

- 對常用節點（容器、表單）做 `$el` 變數快取。
- 變數命名用 `$` 前綴（`$form`, `$button`）表示是 jQuery 物件。

## 批次 DOM 更新

- 多次 append/attr/css 會觸發多次 reflow；改成：
  - 先組字串或 DocumentFragment
  - 最後一次 `html(...)` 或 `append(...)`

```js
const html = items.map(renderItem).join("");
$("#items").html(html);
```

## 事件委派

- 動態新增的元素不要直接 `.on("click", ...)` 綁在元素上。
- 用委派：`$container.on("click", ".selector", handler)`。

```js
const $table = $("#orders");

$table.on("click", "[data-action='remove']", async (e) => {
  const $row = $(e.currentTarget).closest("tr");
  // ...
});
```

## 動畫與操作

- 避免在大量元素上頻繁 `.show()`/`.hide()`；用 class 切換更穩定：`$el.toggleClass("is-hidden", true)`。
- 若使用 jQuery animation（`slideUp`/`fadeIn`），注意 stop/queue。
