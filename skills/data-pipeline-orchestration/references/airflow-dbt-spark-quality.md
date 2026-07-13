# Airflow, dbt, Spark, And Data Quality

## Contents

- Tool selection
- Airflow
- dbt
- Spark
- Data quality
- Backfills and observability

## Tool Selection

- Airflow: dependency scheduling, sensors, retries, and operational orchestration.
- dbt: versioned SQL transformations, tests, documentation, and lineage.
- Spark: distributed processing when one-machine engines cannot meet scale or latency.
- Great Expectations or equivalent: reusable data-quality expectations and validation reports.

Do not add a distributed or scheduled platform when a simple idempotent job meets the need.

## Airflow

- Keep DAG parsing free of network and database side effects.
- Pass references or partition identifiers, not large payloads, through orchestration metadata.
- Make tasks idempotent and partition-aware.
- Bound retries, pools, concurrency, sensors, and task timeouts.
- Use data intervals and event time deliberately.
- Test DAG structure and task logic separately.

## dbt

- Separate source, staging, intermediate, and mart responsibilities.
- Define grain and keys in model documentation.
- Use incremental models only with a correct unique key and late-arrival strategy.
- Test uniqueness, not-null, relationships, accepted values, freshness, and business invariants.
- Review compiled SQL and warehouse plans for expensive models.

## Spark

- Control partition count and file size.
- Filter and project early.
- Broadcast only genuinely small relations.
- Avoid unnecessary shuffles, driver collection, and Python UDFs.
- Validate skew, spill, serialization, executor memory, and retry effects on side outputs.

## Data Quality

Measure validity, completeness, uniqueness, consistency, timeliness, referential integrity, and reconciliation. Tie thresholds to consumer contracts and classify warn, quarantine, and fail behavior. Preserve failed records for diagnosis when policy permits.

## Backfills And Observability

Use bounded partitions, checkpoints, rate limits, cost limits, and reconciliation. Monitor freshness, completeness, quality, duration, retries, queue delay, resource use, and downstream publication. Distinguish no data, late data, failed data, and stale telemetry.
