---
name: spreadsheet-ops
description: Spreadsheet workflow for reading, cleaning, editing, and generating .xlsx, .csv, and .tsv files with formulas, formatting, and charts. Use when a spreadsheet is the primary input or output, or when tabular cleanup and calculation matter.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Spreadsheet Ops

Use this skill when a spreadsheet file is the source or the deliverable.

## When To Use

- Open, fix, or build spreadsheets from scratch or from data exports
- Clean messy tables, headers, rows, or columns
- Add formulas, formatting, charts, or filters
- Convert between .xlsx, .csv, and .tsv when tabular structure matters

## Workflow

1. Decide whether the task is cleanup, calculation, conversion, or creation.
2. Preserve formulas and formatting when editing an existing workbook.
3. Use explicit formulas and named assumptions for calculated outputs.
4. Check for broken references, formula errors, and row/column misalignment.
5. Validate the file opens and recalculates correctly.

## Rules

- Prefer formulas over hard-coded derived values.
- Keep sheet names, ranges, and number formats consistent.
- Treat mixed data types and merged cells carefully.

## Quality Gate

- No broken formulas or references.
- Headers, filters, and formats match the intended table.
- Outputs are reproducible and editable.

## Handoff

- For PDF export or scanned attachments, use `pdf-operations`.
- For narrative summaries, use `markdown-writer`.
