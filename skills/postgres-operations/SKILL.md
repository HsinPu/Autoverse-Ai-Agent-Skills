---
name: postgres-operations
description: PostgreSQL operations workflow covering roles, permissions, schema migrations, indexes, EXPLAIN, VACUUM, ANALYZE, locks, backups, restores, replication, connection pooling, pgvector, monitoring, and production troubleshooting. Use when operating, tuning, or debugging PostgreSQL databases.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Postgres Operations

Use this skill when operating, tuning, debugging, or reviewing PostgreSQL databases in development, staging, or production.

## Core Scope

- Roles, grants, schemas, extensions, permissions, and least privilege
- Migrations, indexes, constraints, locks, VACUUM, ANALYZE, and statistics
- Query planning with `EXPLAIN`, `EXPLAIN ANALYZE`, buffers, and index usage
- Backups, restores, PITR, replication, connection pooling, and failover readiness
- Monitoring, slow query analysis, bloat, deadlocks, connection saturation, and pgvector basics

## Workflow

1. Identify database version, hosting provider, workload type, and environment.
2. Inspect schema, indexes, extensions, permissions, and recent migrations.
3. Use `EXPLAIN` before changing indexes or query shape.
4. Plan migrations with lock impact and rollback in mind.
5. Verify backups and restore path before risky operations.
6. Monitor slow queries, locks, connections, disk, replication lag, and autovacuum health.
7. Document operational decisions and post-change observations.

## Query And Index Checks

- Use indexes for real query patterns, not every column.
- Prefer composite indexes that match filters, joins, and ordering.
- Use partial and covering indexes when they reduce large scans.
- Check index usage with query plans and workload stats.
- Remove duplicate or unused indexes only after observing real traffic.

## Migration Safety

- Avoid long exclusive locks on large tables.
- Use `CREATE INDEX CONCURRENTLY` when appropriate.
- Split schema changes, backfills, and constraint validation into separate steps for large tables.
- Batch backfills and monitor replication lag.
- Test migrations on realistic data volume before production.

## Backup And Recovery

- Know whether recovery depends on SQL dumps, physical backups, WAL archiving, or provider snapshots.
- Test restores, not just backup creation.
- Record RPO/RTO expectations for each environment.
- Keep credentials, extensions, roles, and database parameters in the restore plan.

## Handoff

- Use `database-design` for schema modeling and data integrity design.
- Use `database-migration-workflow` for staged production changes, compatibility windows, backfills, and recovery gates.
- Use `sql-best-practices` for query writing and SQL review.
- Use `prisma-drizzle` when Prisma or Drizzle controls migrations.
- Use `rag-vector-search` when using pgvector or retrieval indexes.

## References

- PostgreSQL Indexes: `https://www.postgresql.org/docs/current/indexes.html`
- PostgreSQL EXPLAIN: `https://www.postgresql.org/docs/current/sql-explain.html`
- PostgreSQL Backup and Restore: `https://www.postgresql.org/docs/current/backup.html`
- PostgreSQL Locking: `https://www.postgresql.org/docs/current/explicit-locking.html`
