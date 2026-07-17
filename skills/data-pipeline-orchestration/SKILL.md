---
name: data-pipeline-orchestration
description: Design and operate production data pipelines across Airflow, dbt, Spark, batch and event-driven orchestration, data contracts, partitioning, backfills, idempotency, lineage, quality gates, retries, recovery, and observability. Use when building or debugging scheduled ETL or ELT workflows, analytics transformations, distributed data processing, or governed dataset delivery.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Data Pipeline Orchestration

## Workflow

1. Define source and consumer contracts, ownership, keys, event time, freshness, completeness, retention, privacy, and recovery objectives.
2. Choose orchestration and processing tools from data volume, latency, transformation, state, and operator requirements.
3. Build idempotent tasks with explicit inputs, outputs, partitions, checkpoints, retries, timeouts, and atomic publication.
4. Separate orchestration from transformation logic and keep business transformations testable outside the scheduler.
5. Add schema, uniqueness, null, range, referential, freshness, reconciliation, and volume checks at appropriate boundaries.
6. Design late data, duplicate data, partial failure, backfill, rerun, and poison-record behavior.
7. Track lineage, versions, owners, cost, runtime, quality, and downstream impact.
8. Test representative production scale and recovery rather than only small happy-path samples.

## Rules

- Never silently drop, coerce, or duplicate records to make a pipeline green.
- Avoid scheduler-generated dynamic task explosions and unbounded retries.
- Preserve raw data and authoritative source identifiers where governance requires them.
- Make backfills use the same validated logic as normal processing.
- Keep secrets and sensitive records out of task logs and test fixtures.

## References

- Read [references/airflow-dbt-spark-quality.md](references/airflow-dbt-spark-quality.md) for tool selection, Airflow DAG patterns, dbt layers, Spark partitioning, data-quality dimensions, backfill controls, and pipeline observability.

## Handoff

- Use `python-data-engineering` for dataframe and file transformation implementation.
- Use `database-design` for storage models.
- Use `sql-best-practices` for query design.
- Use `observability-engineering` for service-level monitoring.
