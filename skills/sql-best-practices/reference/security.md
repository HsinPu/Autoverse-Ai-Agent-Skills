# SQL 安全性（SQL Security）

## 目錄（Table of Contents）

- [SQL Injection 防範](#sql-injection-防範)
- [參數化查詢](#參數化查詢parameterized-queries)
- [ORM 安全注意事項](#orm-安全注意事項)
- [權限控制](#權限控制)
- [敏感資料處理](#敏感資料處理)
- [稽核與監控](#稽核與監控)

---

## SQL Injection 防範

### 原理

攻擊者透過使用者輸入注入惡意 SQL，改變查詢邏輯：

```sql
-- 原始查詢（字串串接，危險）
"SELECT * FROM users WHERE email = '" + userInput + "'"

-- 攻擊者輸入: ' OR '1'='1
-- 結果: SELECT * FROM users WHERE email = '' OR '1'='1'
-- → 回傳全部使用者
```

### 防範原則

1. **永遠使用參數化查詢**（Parameterized Queries / Prepared Statements）
2. **永遠不要**用字串串接（concatenation）或字串插值（interpolation）組裝 SQL
3. 驗證與清理輸入只是**額外防線**，不能取代參數化查詢
4. 動態 SQL（如動態欄位名、表名）需用**白名單驗證**

---

## 參數化查詢（Parameterized Queries）

### 各語言範例

**Java（JDBC）**

```java
// Good: PreparedStatement
String sql = "SELECT * FROM users WHERE email = ? AND status = ?";
PreparedStatement ps = conn.prepareStatement(sql);
ps.setString(1, email);
ps.setString(2, status);
ResultSet rs = ps.executeQuery();

// Bad: 字串串接
String sql = "SELECT * FROM users WHERE email = '" + email + "'";  // 危險！
```

**Python（DB-API）**

```python
# Good: 參數化
cursor.execute(
    "SELECT * FROM users WHERE email = %s AND status = %s",
    (email, status)
)

# Bad: f-string / format
cursor.execute(f"SELECT * FROM users WHERE email = '{email}'")  # 危險！
```

**Node.js（pg / mysql2）**

```javascript
// Good: 參數化
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1 AND status = $2',
  [email, status]
);

// Bad
const result = await pool.query(
  `SELECT * FROM users WHERE email = '${email}'`  // 危險！
);
```

**C#（ADO.NET）**

```csharp
// Good: SqlParameter
using var cmd = new SqlCommand(
    "SELECT * FROM users WHERE email = @email AND status = @status", conn);
cmd.Parameters.AddWithValue("@email", email);
cmd.Parameters.AddWithValue("@status", status);
```

### 動態識別符（表名、欄位名）

參數化查詢**無法**用於表名或欄位名——必須用**白名單**：

```python
# Good: 白名單驗證
ALLOWED_COLUMNS = {'name', 'email', 'created_at', 'status'}
ALLOWED_DIRECTIONS = {'ASC', 'DESC'}

def build_order_clause(sort_by: str, direction: str) -> str:
    if sort_by not in ALLOWED_COLUMNS:
        raise ValueError(f"Invalid column: {sort_by}")
    if direction.upper() not in ALLOWED_DIRECTIONS:
        raise ValueError(f"Invalid direction: {direction}")
    return f"ORDER BY {sort_by} {direction.upper()}"

# Bad: 直接插入使用者提供的欄位名
f"ORDER BY {user_input}"  # 危險！
```

### LIKE 參數的跳脫

```python
# LIKE 的萬用字元 (%, _) 需跳脫，否則使用者可控制搜尋模式
search_term = user_input.replace('%', r'\%').replace('_', r'\_')
cursor.execute(
    "SELECT * FROM products WHERE name LIKE %s ESCAPE '\\'",
    (f'%{search_term}%',)
)
```

---

## ORM 安全注意事項

### 安全的 ORM 用法

ORM 的查詢建構器預設使用參數化，通常是安全的：

```python
# Django — 安全
User.objects.filter(email=email, status=status)

# SQLAlchemy — 安全
session.query(User).filter(User.email == email)

# JPA — 安全
em.createQuery("SELECT u FROM User u WHERE u.email = :email")
  .setParameter("email", email)
```

### 危險的 ORM 用法

ORM 中仍有**原始 SQL 入口**，使用時同樣需要參數化：

```python
# Django — 危險
User.objects.raw(f"SELECT * FROM users WHERE email = '{email}'")  # 危險！

# Django — 安全
User.objects.raw("SELECT * FROM users WHERE email = %s", [email])

# SQLAlchemy — 危險
session.execute(text(f"SELECT * FROM users WHERE email = '{email}'"))  # 危險！

# SQLAlchemy — 安全
session.execute(text("SELECT * FROM users WHERE email = :email"), {"email": email})
```

### 注意 `extra()` / `RawSQL` / `Func` 等進階方法

```python
# Django extra() — 需手動確保安全
User.objects.extra(where=["email = %s"], params=[email])  # 安全
User.objects.extra(where=[f"email = '{email}'"])           # 危險！
```

---

## 權限控制

### 最小權限原則（Principle of Least Privilege）

```sql
-- 應用程式帳號：只給必要的 DML 權限
CREATE USER app_user WITH PASSWORD '...';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
-- 不給 DROP, CREATE, ALTER, TRUNCATE

-- 唯讀帳號（報表、分析）
CREATE USER report_user WITH PASSWORD '...';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO report_user;

-- 撤銷不必要的權限
REVOKE ALL ON SCHEMA public FROM PUBLIC;
```

### 職責分離

| 角色 | 權限 | 用途 |
|------|------|------|
| `app_user` | SELECT, INSERT, UPDATE, DELETE | 應用程式 CRUD |
| `migration_user` | ALL（含 DDL） | CI/CD migration 專用 |
| `report_user` | SELECT | 報表與分析查詢 |
| `admin` | SUPERUSER | 維護與緊急處理（避免日常使用） |

### Row-Level Security（PostgreSQL）

```sql
-- 每個使用者只能看到自己的資料
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_orders ON orders
    USING (user_id = current_setting('app.current_user_id')::INTEGER);

-- 應用程式設定 session 變數
SET app.current_user_id = '42';
SELECT * FROM orders;  -- 只回傳 user_id = 42 的訂單
```

---

## 敏感資料處理

### 密碼

- **永遠不要**以明文儲存密碼。
- 使用 **bcrypt**、**scrypt** 或 **Argon2** 雜湊：

```sql
-- 資料庫只存雜湊值
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL  -- bcrypt output
);
-- 驗證在應用程式層進行，不在 SQL 中比較明文
```

### 個資與合規

```sql
-- 遮罩查詢（ad-hoc 報表時避免揭露完整個資）
SELECT
    id,
    CONCAT(LEFT(email, 3), '***@***') AS masked_email,
    CONCAT(LEFT(phone, 3), '****', RIGHT(phone, 2)) AS masked_phone
FROM users;

-- 資料保留政策：定期清理過期個資
DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '2 years';
```

### 連線安全

- 使用 **SSL/TLS** 連線（`sslmode=require` 或 `verify-full`）。
- 密碼與連線字串放在**環境變數**或**密鑰管理服務**（Vault, AWS Secrets Manager），不寫在程式碼。
- 定期**輪換**資料庫密碼。

---

## 稽核與監控

### 查詢日誌

```sql
-- PostgreSQL: 記錄慢查詢
-- postgresql.conf
-- log_min_duration_statement = 1000   -- 記錄超過 1 秒的查詢

-- MySQL: 慢查詢日誌
-- SET GLOBAL slow_query_log = 'ON';
-- SET GLOBAL long_query_time = 1;
```

### 異常偵測指標

| 指標 | 可能問題 |
|------|---------|
| 單一帳號短時間大量 SELECT | 資料外洩嘗試 |
| 非預期的 DDL（DROP, ALTER） | 未授權的結構變更 |
| 非上班時段的管理員連線 | 帳號被盜用 |
| 大量失敗的登入嘗試 | 暴力破解攻擊 |
| 查詢中出現 `UNION SELECT`, `OR 1=1` | SQL injection 嘗試 |

### 稽核表（Audit Table）範例

```sql
CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(10) NOT NULL,       -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    performed_by VARCHAR(100) NOT NULL,
    performed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 搭配 trigger 自動記錄（PostgreSQL）
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (table_name, record_id, action, old_values, new_values, performed_by)
    VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        CASE WHEN TG_OP != 'INSERT' THEN row_to_json(OLD)::JSONB END,
        CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW)::JSONB END,
        current_setting('app.current_user', TRUE)
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_audit
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION audit_trigger();
```
