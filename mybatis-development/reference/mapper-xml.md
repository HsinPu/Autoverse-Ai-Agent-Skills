# Mapper / XML（MyBatis Mapper Best Practices）

## Mapper 設計

- 以「**Mapper interface**」作為主要使用入口；方法命名與 mapped statement `id` 一致。
- 一個 Mapper 對應一個 domain boundary（例如 User/Order）；避免用「巨大共用 Mapper」。
- 多參數方法一律用 `@Param` 命名參數，避免 `param1/param2` 可讀性差。

## 參數綁定：`#{}` 優先

- 預設只用 `#{...}`（PreparedStatement 參數）
- 僅在必須做「動態識別字」（表名/欄位名/ORDER BY）時才用 `${...}`，且必須做白名單/轉義（見 `security` 章節）
- 可 null 的欄位在必要時指定 `jdbcType`（JDBC driver 對 `null` 參數可能需要）

## ResultMap 與 mapping

- 簡單查詢可用 `resultType`；只要出現 join / nested object / 欄位名不一致，優先改用 `resultMap`
- nested results mapping（association/collection）務必定義 `<id .../>`，避免效能與記憶體問題（MyBatis 官方文件強調）
- ResultMap 建議「逐步擴充」並搭配單元測試驗證（官方 Best Practice）

## Dynamic SQL（XML）

- 動態條件用 `<where>` / `<set>` / `<trim>`，避免手動拼 `WHERE`/逗號
- `IN (...)` 用 `<foreach>`，不要拼字串
- 需要 like pattern 時可用 `<bind>` 產生變數，避免在 Java 端預先拼接

## SQL fragments（`<sql>` / `<include>`）

- 將重複欄位清單、join 片段抽到 `<sql>`；優先讓片段**純 SQL**，避免把易出錯的動態識別字混進 fragments
- 若片段需要 alias 等變數，使用 `<include><property .../></include>`，但對 `${}` 風險保持警覺

## 交易與語意

- `select` 預設 `useCache=true`、DML 預設 `flushCache=true`（可在 statement attributes 調整）
- DML 若需要回傳資料（例如 PostgreSQL `RETURNING` / SQL Server `OUTPUT`），用 `<select ... affectData="true" flushCache="true">`（官方建議寫法）
