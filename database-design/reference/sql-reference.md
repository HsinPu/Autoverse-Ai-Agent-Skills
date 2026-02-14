# Database Design — 完整 SQL 參考

## 目錄（Table of Contents）

- [Schema 設計](#schema-設計)
- [索引](#索引)
- [Migration 範本](#migration-範本)
- [查詢優化](#查詢優化)
- [約束](#約束)

---

## Schema 設計

### 正規化範例

```sql
-- 1NF: 原子值、無重複群組
-- 2NF: 複合主鍵無部分相依
-- 3NF: 無遞移相依

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE addresses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  street VARCHAR(255),
  city VARCHAR(100),
  country VARCHAR(100),
  is_primary BOOLEAN DEFAULT false
);
```

### 反正規化（效能）

```sql
CREATE TABLE order_summaries (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  customer_name VARCHAR(255),
  total_amount DECIMAL(10,2),
  item_count INTEGER,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 索引

### 常見模式

```sql
-- B-tree：等值與範圍
CREATE INDEX idx_users_email ON users(email);

-- 複合索引（順序重要）
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at DESC);

-- 部分索引
CREATE INDEX idx_active_users ON users(email) WHERE deleted_at IS NULL;

-- GIN（陣列/JSONB）
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);

-- Covering index
CREATE INDEX idx_orders_covering ON orders(user_id) INCLUDE (total, status);
```

### 分析

```sql
-- 索引使用情況
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- 可能缺索引的表（seq_scan 多於 idx_scan）
SELECT relname, seq_scan, seq_tup_read, idx_scan, idx_tup_fetch
FROM pg_stat_user_tables
WHERE seq_scan > idx_scan
ORDER BY seq_tup_read DESC;
```

---

## Migration 範本

### 安全遷移

```sql
BEGIN;

ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'active';

CREATE INDEX CONCURRENTLY idx_users_status ON users(status);

-- 分批回填
UPDATE users SET status = 'active' WHERE status IS NULL AND id BETWEEN 1 AND 10000;

COMMIT;
```

### 零停機步驟

1. 新增可為 NULL 的新欄位  
2. 部署同時寫新舊欄位的程式  
3. 回填舊資料  
4. 部署只讀新欄位的程式  
5. 移除舊欄位  

---

## 查詢優化

### EXPLAIN

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM orders WHERE user_id = 123 AND status = 'pending';

-- 關注：Seq Scan vs Index Scan、實際列數 vs 估計、Buffers shared hit vs read
```

### 寫法建議

```sql
-- 大集合用 EXISTS
SELECT * FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);

-- Keyset 分頁（取代 OFFSET）
SELECT * FROM posts
WHERE created_at < '2024-01-01'
ORDER BY created_at DESC
LIMIT 20;

-- CTE
WITH active_users AS (
  SELECT id FROM users WHERE last_login > NOW() - INTERVAL '30 days'
)
SELECT * FROM orders WHERE user_id IN (SELECT id FROM active_users);
```

---

## 約束

```sql
ALTER TABLE users ADD PRIMARY KEY (id);

ALTER TABLE orders ADD CONSTRAINT fk_orders_user
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE products ADD CONSTRAINT chk_price_positive CHECK (price >= 0);

ALTER TABLE users ADD CONSTRAINT uniq_users_email UNIQUE (email);

-- 排除重疊區間（PostgreSQL）
ALTER TABLE reservations ADD CONSTRAINT excl_no_overlap
  EXCLUDE USING gist (room_id WITH =, tsrange(start_time, end_time) WITH &&);
```
