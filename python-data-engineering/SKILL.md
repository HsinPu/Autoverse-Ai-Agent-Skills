---
name: python-data-engineering
description: Python data engineering and analytics guide covering dataframe workflows, ETL/ELT pipelines, notebook-to-script promotion, and file formats such as CSV, Parquet, and JSON/NDJSON. Use when the task centers on tabular datasets, cleaning, joins, aggregations, validation, or reproducible data pipelines rather than spreadsheet editing or database schema design.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Python Data Engineering

Use this skill when the primary deliverable is a dataset, dataframe workflow, or file-based data pipeline.

## When To Use

- Load, clean, reshape, join, aggregate, or validate tabular data
- Build reproducible ETL/ELT jobs from files, APIs, or exported extracts
- Choose between pandas, Polars, DuckDB, Jupyter, or PyArrow
- Turn exploratory notebook work into maintainable scripts or modules

## Boundaries

- Use `spreadsheet-ops` when the workbook is the deliverable.
- Use `database-design` or `sql-best-practices` when schema or SQL tuning is the main task.
- Use `python-development` for general Python architecture, packaging, or code style.

## Workflow

1. Inspect the source data and define the expected output.
2. Fix the data contract first: schema, keys, null rules, units, and date handling.
3. Choose the engine based on data size and access pattern.
4. Keep transformations pure and make I/O explicit.
5. Validate row counts, uniqueness, ranges, and aggregates.
6. Export deterministic outputs and document the assumptions.

## Tool Choice

| Need | Prefer | Notes |
|---|---|---|
| Small or medium tabular work | `pandas` | Broad ecosystem, familiar API |
| Large or lazy transforms | `polars` | Fast, columnar, lazy execution |
| SQL over files | `duckdb` | Good for joins, grouping, file scans |
| Serialization and Parquet | `pyarrow` | Preserve schema fidelity |
| Exploration and narrative | `jupyter` | Move stable logic to `.py` |

## Validation Rules

- Assert key uniqueness before and after joins.
- Check row counts before and after each major transform.
- Check null ratios, numeric bounds, and categorical domains.
- Keep sample fixtures small enough to run in tests.

## Handoff

- For workbook-centric outputs, hand off to `spreadsheet-ops`.
- For SQL changes or schema work, hand off to `database-design` or `sql-best-practices`.
- For general Python packaging or style, hand off to `python-development`.

- See [reference/data-workflows.md](reference/data-workflows.md) for deeper guidance.
