---
name: sql-best-practices
description: SQL writing and review guide covering naming, formatting, JOINs, subqueries, performance analysis, pagination, batch operations, and security practices. Use when writing, reviewing, or optimizing SQL queries, and pair it with database-design when schema or migration design is also involved.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# SQL 最佳實務（SQL Best Practices）

**撰寫或審查 SQL 時請讀取本 skill。**

撰寫、重構或審查 SQL 查詢時，依需要查閱下方參考資料，以符合撰寫風格、效能要求與安全規範。以**通用 SQL** 為主，語法差異處加註適用的資料庫（PostgreSQL / MySQL / SQL Server）。Schema 設計、索引建立與 migration 模式請見 `database-design` Skill。

## 進階與參考（Bundled resources）

- **撰寫風格**：需查閱命名慣例、格式排版、JOIN 寫法、子查詢與 CTE、條件式、DML 語法或資料庫差異時，見 [reference/code-style.md](reference/code-style.md)。
- **效能優化**：需查閱 EXPLAIN 判讀、常見效能陷阱、N+1、分頁策略、大量資料操作、索引使用提示或鎖與並行時，見 [reference/performance.md](reference/performance.md)。
- **安全性**：需查閱 SQL injection 防範、參數化查詢（各語言範例）、ORM 安全、權限控制、敏感資料處理或稽核監控時，見 [reference/security.md](reference/security.md)。
