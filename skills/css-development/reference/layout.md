# Layout：Flexbox / Grid

## 何時用 Flexbox

- 一維排列：row 或 column
- 對齊與分配空間：`justify-content`, `align-items`

常見陷阱：

- item 預設會 shrink；需要時用 `min-width: 0`（避免內容把容器撐爆）
- 不要用 flex 取代所有 2D 版面

參考（MDN）：

- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox

## 何時用 Grid

- 二維布局：同時控制 rows/columns
- 需要固定區塊/區域（template areas）、複雜版面

參考（MDN）：

- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
