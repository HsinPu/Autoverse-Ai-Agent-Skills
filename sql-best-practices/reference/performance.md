# SQL 效能優化（SQL Performance）

## 目錄（Table of Contents）

- [EXPLAIN 分析](#explain-分析)
- [常見效能陷阱](#常見效能陷阱)
- [N+1 查詢問題](#n1-查詢問題)
- [分頁策略](#分頁策略)
- [大量資料操作](#大量資料操作)
- [索引使用提示](#索引使用提示)
- [查詢改寫技巧](#查詢改寫技巧)
- [鎖與並行](#鎖與並行)

---

## EXPLAIN 分析

> `database-design` Skill 已涵蓋 EXPLAIN 基礎語法與索引設計。本節聚焦於**解讀方法**與**實戰判讀**。

### 怎麼看 EXPLAIN 輸出

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM orders WHERE user_id = 123 AND status = 'pending';
```

判讀重點（依嚴重度排序）：

| 指標 | 好 | 壞 | 怎麼修 |
|------|---|---|--------|
| Scan 類型 | Index Scan / Index Only Scan | Seq Scan（大表） | 加適當索引 |
| Rows（actual vs estimated） | 接近 | 差距 > 10× | `ANALYZE` 更新統計 |
| Buffers shared read | 低 | 高 | 資料不在快取，確認記憶體或查詢範圍 |
| Sort method | quicksort（memory） | external merge（disk） | 加大 `work_mem` 或加索引避免 sort |
| Loops | 1 | 大量 | Nested Loop 搭配不佳，考慮改 JOIN 策略 |

### 常見掃描類型效能排名

```
Index Only Scan  ≫  Index Scan  >  Bitmap Index Scan  >  Seq Scan（大表）
```

> Seq Scan 在小表上是正常的——最佳化器判斷全掃比走索引更快時會選 Seq Scan。

### MySQL 對照

```sql
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 123;
-- MySQL 8.0+ 支援 EXPLAIN ANALYZE
-- 關注 type 欄位：const > eq_ref > ref > range > index > ALL
```

---

## 常見效能陷阱

### 1. 函式包欄位（Index Killer）

```sql
-- Bad: 索引失效（函式套在欄位上）
SELECT * FROM users WHERE YEAR(created_at) = 2024;
SELECT * FROM users WHERE UPPER(email) = 'ALICE@EXAMPLE.COM';

-- Good: 改寫條件讓索引可用
SELECT * FROM users
WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';

-- 或建立表達式索引（PostgreSQL）
CREATE INDEX idx_users_email_lower ON users (LOWER(email));
```

### 2. 隱式型別轉換

```sql
-- Bad: phone 是 VARCHAR，傳入數字觸發隱式轉換 → 索引失效
SELECT * FROM users WHERE phone = 0912345678;

-- Good: 型別一致
SELECT * FROM users WHERE phone = '0912345678';
```

### 3. 萬用字元開頭的 LIKE

```sql
-- Bad: 前置萬用字元無法用 B-tree 索引
SELECT * FROM products WHERE name LIKE '%keyboard%';

-- Good: 前綴匹配可走索引
SELECT * FROM products WHERE name LIKE 'keyboard%';

-- 全文搜尋場景改用：
-- PostgreSQL: tsvector + GIN
-- MySQL: FULLTEXT INDEX
```

### 4. SELECT * 的隱藏代價

```sql
-- 多出的欄位 = 更多 I/O、更多網路傳輸、covering index 無法命中
-- 尤其 BLOB / TEXT / JSONB 大欄位影響更顯著
SELECT id, email, status FROM users;  -- 只取需要的欄位
```

### 5. OR 條件效能

```sql
-- Bad: OR 可能導致索引合併或全掃
SELECT * FROM orders WHERE user_id = 1 OR status = 'pending';

-- Good: 改用 UNION ALL（若兩個條件各有索引）
SELECT * FROM orders WHERE user_id = 1
UNION ALL
SELECT * FROM orders WHERE status = 'pending' AND user_id != 1;
```

### 6. COUNT(*) vs COUNT(column)

```sql
-- COUNT(*) 計算所有列（含 NULL），通常效能最佳
-- COUNT(column) 排除 NULL，需額外判斷
-- COUNT(DISTINCT column) 最慢
SELECT COUNT(*) FROM orders;              -- 推薦
SELECT COUNT(shipped_at) FROM orders;     -- 排除 NULL，語意不同
```

---

## N+1 查詢問題

### 問題

應用程式迴圈中對每筆主記錄各發一次查詢：

```
-- 1 次查使用者
SELECT * FROM users LIMIT 100;
-- 100 次查訂單（N+1）
SELECT * FROM orders WHERE user_id = 1;
SELECT * FROM orders WHERE user_id = 2;
...
```

### 解法

```sql
-- 批次 IN（注意 IN 清單過長的限制）
SELECT * FROM orders WHERE user_id IN (1, 2, 3, ..., 100);

-- 或直接 JOIN
SELECT u.id, u.email, o.id AS order_id, o.total
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
ORDER BY u.id;

-- ORM 層：使用 eager loading（如 JPA fetch join, SQLAlchemy joinedload）
```

### ORM 注意事項

| 框架 | Eager Loading 方式 |
|------|-------------------|
| JPA / Hibernate | `@EntityGraph`, `JOIN FETCH` |
| SQLAlchemy | `joinedload()`, `subqueryload()` |
| Django | `select_related()`, `prefetch_related()` |
| ActiveRecord | `includes()`, `eager_load()` |

---

## 分頁策略

> `database-design` Skill 已介紹 keyset 分頁概念。本節補充**各策略比較**與**實作細節**。

### OFFSET 分頁（簡單但慢）

```sql
-- 第 101 頁（每頁 20 筆）→ 資料庫需掃描前 2000 筆再丟棄
SELECT * FROM orders ORDER BY created_at DESC LIMIT 20 OFFSET 2000;
```

**問題**：OFFSET 越大越慢（O(n)），且併發寫入時頁面可能漂移。

### Keyset 分頁（推薦）

```sql
-- 首頁
SELECT id, title, created_at
FROM posts
ORDER BY created_at DESC, id DESC
LIMIT 20;

-- 下一頁（帶上上一頁最後一筆的 cursor）
SELECT id, title, created_at
FROM posts
WHERE (created_at, id) < ('2024-06-15T10:30:00', 9527)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

**優點**：效能穩定 O(1)，不受資料量影響。
**限制**：無法直接跳頁；需 `(排序欄位, 唯一欄位)` 複合索引。

### 策略比較

| | OFFSET | Keyset | 雜湊/Token |
|---|--------|--------|-----------|
| 實作難度 | 低 | 中 | 中 |
| 大頁碼效能 | 差 | 好 | 好 |
| 跳頁 | 支援 | 不支援 | 不支援 |
| 資料漂移 | 有 | 無 | 無 |
| 適用場景 | 小資料集、後台 | API、無限捲動 | API、token-based |

---

## 大量資料操作

### 分批 UPDATE

```sql
-- 不要一次更新百萬筆
-- Bad
UPDATE orders SET status = 'archived' WHERE created_at < '2023-01-01';

-- Good: 分批（依主鍵區間）
UPDATE orders
SET status = 'archived'
WHERE created_at < '2023-01-01'
    AND id BETWEEN 1 AND 10000;
-- 重複執行，每次調整 id 範圍
```

### 分批 DELETE

```sql
-- PostgreSQL: 用 CTE + LIMIT
WITH to_delete AS (
    SELECT id FROM sessions
    WHERE expired_at < NOW() - INTERVAL '90 days'
    LIMIT 5000
)
DELETE FROM sessions
WHERE id IN (SELECT id FROM to_delete);

-- MySQL: 直接 LIMIT
DELETE FROM sessions
WHERE expired_at < NOW() - INTERVAL 90 DAY
LIMIT 5000;
```

### 大量 INSERT

```sql
-- 用多值 INSERT 取代逐筆 INSERT
INSERT INTO logs (level, message, created_at)
VALUES
    ('INFO', 'msg1', NOW()),
    ('WARN', 'msg2', NOW()),
    ('ERROR', 'msg3', NOW());

-- 更大量：考慮 COPY（PostgreSQL）或 LOAD DATA INFILE（MySQL）
```

---

## 索引使用提示

> 索引的**建立與設計**請見 `database-design` Skill。本節聚焦**撰寫查詢時如何善用索引**。

### 複合索引的欄位順序

複合索引 `(a, b, c)` 可用於：

- `WHERE a = ?`
- `WHERE a = ? AND b = ?`
- `WHERE a = ? AND b = ? AND c = ?`
- `WHERE a = ? AND b > ?`（range 後的欄位不再走索引）

**不能**用於：

- `WHERE b = ?`（跳過前導欄位）
- `WHERE b = ? AND c = ?`

### 排序與索引

```sql
-- 索引 (user_id, created_at DESC) 可同時滿足 WHERE + ORDER BY
SELECT * FROM orders
WHERE user_id = 123
ORDER BY created_at DESC
LIMIT 10;
-- → Index Scan，不需額外排序
```

### Covering Index（涵蓋索引）

```sql
-- 若查詢只需要索引中的欄位，可達到 Index Only Scan（不回表）
CREATE INDEX idx_orders_user_status ON orders (user_id) INCLUDE (status, total);

SELECT status, total FROM orders WHERE user_id = 123;
-- → Index Only Scan
```

---

## 查詢改寫技巧

### EXISTS vs IN

```sql
-- 大外表、小子查詢 → IN 可接受
SELECT * FROM users WHERE id IN (SELECT user_id FROM vip_list);

-- 大子查詢 → EXISTS 通常更快（短路評估）
SELECT * FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);
```

### UNION ALL vs UNION

```sql
-- UNION 會去重（隱含 DISTINCT + sort），效能差
-- 若確定無重複或不需去重，用 UNION ALL
SELECT id, email FROM active_users
UNION ALL
SELECT id, email FROM pending_users;
```

### 避免相關子查詢（Correlated Subquery）

```sql
-- Bad: 每列都執行一次子查詢
SELECT u.email,
       (SELECT MAX(o.total) FROM orders o WHERE o.user_id = u.id) AS max_order
FROM users u;

-- Good: 改用 JOIN
SELECT u.email, o_max.max_total
FROM users u
LEFT JOIN (
    SELECT user_id, MAX(total) AS max_total
    FROM orders
    GROUP BY user_id
) o_max ON o_max.user_id = u.id;
```

### 視窗函式（Window Functions）

```sql
-- 排名、累計、移動平均等，避免自我 JOIN
SELECT
    id,
    user_id,
    total,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS rn,
    SUM(total) OVER (PARTITION BY user_id ORDER BY created_at) AS running_total
FROM orders;

-- 取每位使用者最新訂單（Top-N per group）
WITH ranked AS (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS rn
    FROM orders
)
SELECT * FROM ranked WHERE rn = 1;
```

---

## 鎖與並行

### 明確鎖定

```sql
-- 悲觀鎖：確保讀取後到更新前不被其他交易修改
SELECT * FROM accounts WHERE id = 1 FOR UPDATE;
-- 然後在同一交易內 UPDATE

-- SKIP LOCKED：跳過已被鎖定的列（適合 job queue）
SELECT * FROM jobs
WHERE status = 'pending'
ORDER BY created_at
LIMIT 1
FOR UPDATE SKIP LOCKED;
```

### 死鎖預防

- 多表操作時，**固定存取順序**（如按表名字母序）。
- 縮短交易時間，避免在交易中做 I/O 或外部呼叫。
- 需要多列鎖定時，**排序主鍵後再鎖**。

### 隔離等級速查

| 等級 | Dirty Read | Non-repeatable Read | Phantom Read |
|------|-----------|-------------------|-------------|
| READ UNCOMMITTED | 可能 | 可能 | 可能 |
| READ COMMITTED | 不會 | 可能 | 可能 |
| REPEATABLE READ | 不會 | 不會 | 可能（InnoDB 不會） |
| SERIALIZABLE | 不會 | 不會 | 不會 |

> 大多數 OLTP 系統使用 READ COMMITTED（PostgreSQL 預設）或 REPEATABLE READ（MySQL InnoDB 預設）。只在必要時提高隔離等級。
