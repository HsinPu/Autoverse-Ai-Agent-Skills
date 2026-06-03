# SQL 撰寫風格（SQL Code Style）

## 目錄（Table of Contents）

- [命名慣例](#命名慣例naming-conventions)
- [格式與排版](#格式與排版formatting)
- [SELECT 與欄位](#select-與欄位)
- [JOIN](#join)
- [子查詢與 CTE](#子查詢與-cte)
- [條件式](#條件式where--having)
- [INSERT / UPDATE / DELETE](#insert--update--delete)
- [註解](#註解comments)
- [資料庫差異速查](#資料庫差異速查)

---

## 命名慣例（Naming Conventions）

### 表格與欄位

| 項目 | 慣例 | 範例 |
|------|------|------|
| 表格 | `snake_case`，**複數名詞** | `users`, `order_items` |
| 欄位 | `snake_case`，**單數** | `user_id`, `email`, `created_at` |
| 主鍵 | `id` 或 `{table_singular}_id` | `id`, `user_id` |
| 外鍵 | `{referenced_table_singular}_id` | `user_id`, `order_id` |
| 布林 | `is_` / `has_` / `can_` 前綴 | `is_active`, `has_paid` |
| 時間戳 | `_at` 後綴 | `created_at`, `deleted_at` |
| 日期 | `_on` 或 `_date` 後綴 | `birth_date`, `shipped_on` |

### 其他物件

| 物件 | 慣例 | 範例 |
|------|------|------|
| 索引 | `idx_{table}_{columns}` | `idx_users_email` |
| 唯一約束 | `uniq_{table}_{columns}` | `uniq_users_email` |
| 外鍵約束 | `fk_{table}_{ref_table}` | `fk_orders_users` |
| CHECK | `chk_{table}_{condition}` | `chk_products_price_positive` |
| VIEW | 語意化名稱或 `v_` 前綴 | `active_users`, `v_monthly_sales` |
| 預存程序 | 動詞開頭 | `calculate_totals`, `sync_inventory` |

### 避免

- 保留字作為表格或欄位名（`user`, `order`, `group`, `table`, `index`）。若必須使用，加引號或改名。
- 單一字母別名（除非極短的子查詢）。
- 含糊縮寫（`amt` → `amount`、`qty` → `quantity` 較佳，但團隊統一即可）。

---

## 格式與排版（Formatting）

### 關鍵字大寫

SQL 關鍵字一律**大寫**；表格、欄位、別名一律**小寫**：

```sql
SELECT u.email, u.created_at
FROM users u
WHERE u.is_active = TRUE;
```

### 縮排

- 使用 **4 格空白**（或團隊統一 2 格）。
- 主要子句（`SELECT`, `FROM`, `WHERE`, `GROUP BY`, `ORDER BY`, `HAVING`, `LIMIT`）靠左對齊。
- 子句內的項目縮排一層：

```sql
SELECT
    u.id,
    u.email,
    COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o
    ON o.user_id = u.id
WHERE u.is_active = TRUE
    AND u.created_at >= '2024-01-01'
GROUP BY u.id, u.email
HAVING COUNT(o.id) > 5
ORDER BY order_count DESC
LIMIT 20;
```

### 逗號位置

建議**逗號放行尾**（trailing comma）：

```sql
SELECT
    id,
    email,
    created_at
FROM users;
```

> 亦有團隊偏好 leading comma（逗號放行首），重點是**全專案一致**。

---

## SELECT 與欄位

### 明確列出欄位

永遠寫出需要的欄位，不用 `SELECT *`（除了 ad-hoc 查詢或 `EXISTS` 子查詢）：

```sql
-- Good
SELECT id, email, created_at FROM users;

-- Avoid in production code
SELECT * FROM users;
```

### 別名

- 表格用**有意義的短名**（`u` for `users`、`oi` for `order_items`）。
- 欄位別名用 `AS`，不要省略：

```sql
SELECT
    COUNT(o.id) AS order_count,   -- Good: explicit AS
    SUM(o.total) total_sum        -- Avoid: implicit alias
FROM orders o;
```

---

## JOIN

### 寫法

- 明確寫出 JOIN 類型（`INNER JOIN`, `LEFT JOIN`），不要只寫 `JOIN`（雖等同 `INNER JOIN`，但明確較佳）。
- `ON` 條件接在 JOIN 後面，縮排一層：

```sql
SELECT
    u.email,
    o.total
FROM users u
INNER JOIN orders o
    ON o.user_id = u.id
    AND o.status = 'completed'
LEFT JOIN order_items oi
    ON oi.order_id = o.id;
```

### 避免

- **隱式 JOIN**（comma join）：

```sql
-- Avoid
SELECT u.email, o.total
FROM users u, orders o
WHERE o.user_id = u.id;

-- Use explicit JOIN instead
SELECT u.email, o.total
FROM users u
INNER JOIN orders o ON o.user_id = u.id;
```

---

## 子查詢與 CTE

### 優先使用 CTE

多步驟邏輯用 **CTE（WITH）** 拆解，比巢狀子查詢可讀性高：

```sql
-- Good: CTE
WITH active_users AS (
    SELECT id, email
    FROM users
    WHERE is_active = TRUE
        AND last_login >= CURRENT_DATE - INTERVAL '30 days'
),
user_orders AS (
    SELECT
        au.id AS user_id,
        COUNT(o.id) AS order_count,
        SUM(o.total) AS total_spent
    FROM active_users au
    INNER JOIN orders o ON o.user_id = au.id
    GROUP BY au.id
)
SELECT
    au.email,
    uo.order_count,
    uo.total_spent
FROM active_users au
INNER JOIN user_orders uo ON uo.user_id = au.id
ORDER BY uo.total_spent DESC;
```

### 子查詢適用場景

- `EXISTS` / `NOT EXISTS` 判斷：

```sql
SELECT u.email
FROM users u
WHERE EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.user_id = u.id
        AND o.created_at >= CURRENT_DATE - INTERVAL '7 days'
);
```

- 單一純量值：

```sql
SELECT
    u.email,
    (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) AS order_count
FROM users u;
```

> 純量子查詢在大資料集上可能效能不佳，考慮改用 JOIN + GROUP BY。

---

## 條件式（WHERE / HAVING）

### 多條件排列

每個條件獨立一行，邏輯運算子（`AND`, `OR`）放行首：

```sql
WHERE u.is_active = TRUE
    AND u.role = 'admin'
    AND (u.department = 'engineering'
         OR u.department = 'product')
```

### NULL 處理

- 比較用 `IS NULL` / `IS NOT NULL`，不用 `= NULL`。
- 注意 `NOT IN` 含 NULL 的陷阱：

```sql
-- 危險：若 subquery 回傳含 NULL 的集合，整個 NOT IN 結果為空
SELECT * FROM users WHERE id NOT IN (SELECT user_id FROM banned_users);

-- 安全：用 NOT EXISTS
SELECT * FROM users u
WHERE NOT EXISTS (
    SELECT 1 FROM banned_users b WHERE b.user_id = u.id
);
```

### CASE 表達式

```sql
SELECT
    u.email,
    CASE u.role
        WHEN 'admin' THEN '管理員'
        WHEN 'editor' THEN '編輯者'
        ELSE '一般使用者'
    END AS role_label
FROM users u;
```

---

## INSERT / UPDATE / DELETE

### INSERT

```sql
-- 明確列出欄位
INSERT INTO users (email, name, role, created_at)
VALUES ('alice@example.com', 'Alice', 'editor', NOW());

-- 多筆
INSERT INTO tags (name, slug)
VALUES
    ('SQL', 'sql'),
    ('Database', 'database'),
    ('Performance', 'performance');
```

### UPDATE

```sql
UPDATE orders
SET
    status = 'shipped',
    shipped_at = NOW(),
    updated_at = NOW()
WHERE id = 42
    AND status = 'processing';
```

> 永遠帶 `WHERE`，除非確實要更新全表。

### DELETE

```sql
-- 先確認影響範圍
SELECT COUNT(*) FROM sessions WHERE expired_at < NOW() - INTERVAL '30 days';

-- 再刪除
DELETE FROM sessions
WHERE expired_at < NOW() - INTERVAL '30 days';
```

> 大量刪除考慮分批（見 performance.md）。重要資料優先考慮 soft delete。

---

## 註解（Comments）

### 行內註解

```sql
SELECT
    u.email,
    u.created_at,
    -- 只計算已完成的訂單
    COUNT(o.id) FILTER (WHERE o.status = 'completed') AS completed_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.email, u.created_at;
```

> `FILTER (WHERE ...)` 為 PostgreSQL 語法；MySQL / SQL Server 用 `SUM(CASE WHEN ... THEN 1 ELSE 0 END)`。

### 區塊註解

複雜查詢在開頭說明**目的**（why），而非重述 SQL 本身（what）：

```sql
/*
 * 計算每位活躍使用者在過去 30 天內的訂單統計。
 * 用於月報儀表板的「使用者活躍度」區塊。
 */
WITH active_users AS ( ... )
SELECT ...
```

---

## 資料庫差異速查

| 功能 | PostgreSQL | MySQL | SQL Server |
|------|-----------|-------|------------|
| 字串串接 | `\|\|` 或 `CONCAT()` | `CONCAT()` | `+` 或 `CONCAT()` |
| 布林型別 | `BOOLEAN` | `TINYINT(1)` / `BOOLEAN` (alias) | `BIT` |
| 自增主鍵 | `SERIAL` / `GENERATED ALWAYS AS IDENTITY` | `AUTO_INCREMENT` | `IDENTITY(1,1)` |
| UPSERT | `INSERT ... ON CONFLICT ... DO UPDATE` | `INSERT ... ON DUPLICATE KEY UPDATE` | `MERGE` |
| 限制筆數 | `LIMIT n` | `LIMIT n` | `TOP n` / `OFFSET ... FETCH` |
| 日期相減 | `INTERVAL '30 days'` | `INTERVAL 30 DAY` | `DATEADD(DAY, -30, GETDATE())` |
| JSON 查詢 | `->`, `->>`, `jsonb_path_query` | `->`, `->>`, `JSON_EXTRACT` | `JSON_VALUE`, `JSON_QUERY` |
| 條件聚合 | `FILTER (WHERE ...)` | `SUM(CASE ...)` | `SUM(CASE ...)` |
| RETURNING | `RETURNING *` | 不支援（用 `LAST_INSERT_ID()`） | `OUTPUT INSERTED.*` |

> 本 Skill 以**通用 SQL** 為主。遇到語法差異時會加註適用的資料庫。
