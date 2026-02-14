---
name: database-design
description: Database schema design, optimization, and migration patterns for PostgreSQL, MySQL, and NoSQL. Use when designing schemas, writing migrations, optimizing queries, or discussing indexes, normalization, or data integrity.
source: wshobson/agents
license: MIT
---

# Database Design

Schema design、索引、遷移與查詢優化。適用於 PostgreSQL、MySQL 及關聯式資料庫。

## Schema 設計原則

### 正規化（Normalization）

- **1NF**：原子值，無重複群組  
- **2NF**：複合主鍵無部分相依  
- **3NF**：無遞移相依  

關聯拆成獨立實體（如 `users` 與 `addresses`），必要時用 FK + `ON DELETE CASCADE`。

### 反正規化（Denormalization）

讀取效能優先於寫入一致性時，可將常用欄位冗餘到摘要表（如 `order_summaries` 含 `customer_name`、`total_amount`、`item_count`），並維護 `last_updated`。

---

## 索引設計

| 情境 | 類型／寫法 |
|------|------------|
| 等值與範圍查詢 | B-tree（預設），如 `CREATE INDEX idx_users_email ON users(email)` |
| 複合條件 | 複合索引，**欄位順序重要**，如 `(user_id, created_at DESC)` |
| 部分條件 | Partial index：`WHERE deleted_at IS NULL` |
| 陣列／JSONB | GIN：`USING GIN(tags)` |
| 涵蓋查詢 | `INCLUDE (col1, col2)` 減少回表 |

**分析**：用 `pg_stat_user_indexes` 看 `idx_scan`；用 `pg_stat_user_tables` 比較 `seq_scan` 與 `idx_scan`，找出高 `seq_tup_read` 且缺索引的表格。

---

## Migration 模式

- **一律使用 transaction**（`BEGIN` / `COMMIT`）。
- 加欄位：`ADD COLUMN ... DEFAULT`（PG 11+ 非阻塞）。
- 建索引：`CREATE INDEX CONCURRENTLY` 避免鎖表。
- 回填：分批 `UPDATE`（例如依 `id` 區間）。

**零停機遷移**：  
1) 新增可為 NULL 的新欄位 → 2) 部署同時寫新舊欄位的程式 → 3) 回填舊資料 → 4) 部署只讀新欄位的程式 → 5) 移除舊欄位。

---

## 查詢優化

- 使用 **EXPLAIN (ANALYZE, BUFFERS)**；關注 Seq Scan vs Index Scan、實際列數 vs 估計列數、shared hit vs read。
- 大集合用 **EXISTS** 取代 `IN`。
- 分頁用 **keyset（cursor）** 取代 `OFFSET`（例如 `WHERE created_at < ? ORDER BY created_at DESC LIMIT n`）。
- 複雜邏輯用 **CTE** 拆步驟。

---

## 約束與資料完整性

- **PK**：`PRIMARY KEY`
- **FK**：`REFERENCES ... ON DELETE CASCADE`（或 SET NULL / RESTRICT）
- **CHECK**：如 `price >= 0`
- **UNIQUE**：如 `UNIQUE(email)`
- **EXCLUSION**：避免區間重疊，如 `EXCLUDE USING gist (room_id WITH =, tsrange(start_time, end_time) WITH &&)`

---

## 實務建議

- 對外 ID 可採 **UUID**，內部用 **SERIAL/BIGSERIAL**。
- 表上保留 **created_at**、**updated_at**。
- 重要資料用 **soft delete**（`deleted_at`）。
- 分散式情境設計為 **最終一致性**。
- 在 migration 檔內註解 schema 決策；上線前在接近生產資料量下測試 migration。

---

## 進階與參考（Bundled resources）

- **SQL 語法與範例**：需撰寫或查閱完整 SQL、migration 範本、索引與約束語法時，見 [reference/sql-reference.md](reference/sql-reference.md)。
