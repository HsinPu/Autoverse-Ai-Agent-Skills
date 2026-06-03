---
name: sql-best-practices
description: SQL writing and review guide covering naming, formatting, JOINs, subqueries, performance analysis, pagination, batch operations, and security practices. Use when writing, reviewing, or optimizing SQL queries, and pair it with database-design when schema or migration design is also involved.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# SQL Best Practices

Use this skill when the task is about writing, reviewing, debugging, or optimizing SQL queries.

## Workflow

1. Identify the database dialect, query purpose, expected cardinality, and caller contract.
2. Check table relationships, filters, join keys, ordering, pagination, and null semantics.
3. Prefer readable SQL before clever SQL; make expensive operations obvious.
4. Review execution plans, indexes, batching, and lock behavior when performance matters.
5. Verify with representative data, query plans, tests, or a dry-run migration where available.

## Reference Routing

- Naming, formatting, joins, CTEs, and query style: read [reference/code-style.md](reference/code-style.md).
- `EXPLAIN`, indexes, pagination, N+1 patterns, and batch operations: read [reference/performance.md](reference/performance.md).
- SQL injection, parameter binding, ORM escape hatches, and permissions: read [reference/security.md](reference/security.md).

## Rules

- Use bound parameters for external input.
- Be explicit about join type, ordering, and pagination stability.
- Avoid schema or migration advice unless the task includes it; use `database-design` for that layer.
- Do not optimize blindly without knowing the query goal and data shape.

## Handoff

- For schema modeling, indexing strategy, migrations, or data integrity, use `database-design`.
- For ORM-specific implementation, use `prisma-drizzle`, `jpa-hibernate-development`, or `mybatis-development`.
- For PostgreSQL operational work, use `postgres-operations`.
