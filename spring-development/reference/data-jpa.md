# Data / JPA（Transactions and Persistence）

## 交易（Transactions）

- 交易通常應該放在 service 層（application layer）。
- 用 `@Transactional(readOnly = true)` 明確標註查詢。
- 注意 propagation 與 nested calls；不要在 controller 到處開交易。

## N+1 與 fetch

- 預設假設會遇到 N+1；讀取列表時優先用：
  - fetch join（適量）
  - projection DTO
  - batch size（視專案）

## Repository 設計

- repository 方法命名要可讀；複雜查詢優先用 query object/specification。
- 大量動態查詢：考慮 Specifications / Querydsl（依專案）。

## Migration

- DB schema 變更用 Flyway/Liquibase，不要靠 `ddl-auto=update`。
