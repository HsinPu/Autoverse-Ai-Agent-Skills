# 效能（Performance）

## 避免 N+1：nested select vs join/nested results

- `<association select="...">` / `<collection select="...">` 很容易形成 N+1；大型列表優先用 join + nested results（ResultMap chaining）
- nested results 務必標註 `<id>`（官方：不標註仍能跑，但效能會非常差）

## Statement 層級調校

- 對慢查詢：設定 statement `timeout`（秒）與 `fetchSize`（driver hint）
- 依需求調整 `useCache/flushCache`，避免不必要的 cache flush

## ExecutorType

- `SIMPLE`：每次建立新 PreparedStatement（預設）
- `REUSE`：重用 PreparedStatement
- `BATCH`：批次更新（可搭配 `flushStatements()` 控制送出時機）

## RowBounds / Cursor / ResultHandler

- `RowBounds(offset, limit)` 會跳過/限制回傳筆數；不同 JDBC driver 的效率不同（若要較佳效率，官方建議使用 `SCROLL_SENSITIVE`/`SCROLL_INSENSITIVE`）
- 大型資料處理可用 `selectCursor()`（lazy iterator）
- 使用 `ResultHandler` 時：結果不會被 cache；且在複雜 `resultMap` 下可能拿到尚未填滿 association/collection 的物件（官方限制）

## Local Cache（SqlSession local cache）

- local cache 會在 `update/commit/rollback/close` 清除；可用 `localCacheScope=STATEMENT` 降低 session 期間共享
- 當 `localCacheScope=SESSION` 時，同一個 session 內重複查詢可能回傳同一個物件參考；官方 Best Practice：**不要修改** MyBatis 回傳的物件（會污染 cache）
