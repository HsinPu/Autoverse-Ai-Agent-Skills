---
name: data-organization-system
description: Data organization system design workflow for turning scattered files, folders, datasets, exports, notes, screenshots, documents, and project assets into a durable taxonomy with naming rules, metadata, lifecycle stages, retention policy, privacy handling, and retrieval workflows. Use when the user wants a reusable system for organizing business, research, personal knowledge, AI datasets, project evidence, or mixed data sources rather than a one-time Downloads/Desktop cleanup.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Data Organization System

Design a repeatable data organization system, not just a one-time cleanup. Use this when the problem is "we have many kinds of data and need a structure that keeps working over time."

## Core Idea

Separate four concerns:

- Storage: where the data lives.
- Taxonomy: how items are grouped.
- Metadata: what must be known about each item.
- Lifecycle: how items move from inbox to active use to archive or deletion.

Do not start by moving files. Start by defining how the user will find, trust, and maintain the data later.

## Workflow

### 1. Define the system boundary

Identify:

- Data sources: Downloads, Desktop, Drive, Notion, email attachments, exports, databases, screenshots, chat logs, media, PDFs, CSV/XLSX, project folders.
- Users: one person, team, clients, public/internal consumers, AI agents.
- Use cases: search, reporting, audit evidence, training/eval datasets, project handoff, bookkeeping, personal knowledge, client delivery.
- Risk: private information, credentials, regulated data, legal/tax/medical records, customer data, copyrighted assets.
- Update rhythm: one-time migration, weekly triage, monthly archive, continuous ingestion.

### 2. Inventory and sample

Build a small but representative inventory before designing the structure:

```powershell
$Root = "C:\path\to\data"
Get-ChildItem -LiteralPath $Root -Recurse -File -Force |
  Select-Object FullName, Extension, Length, LastWriteTime |
  Export-Csv -Path ".\data-inventory.csv" -NoTypeInformation -Encoding UTF8
```

Summarize:

- Major source folders and file types.
- Approximate item counts and size.
- Date ranges and stale areas.
- Duplicate or near-duplicate sources.
- High-risk sensitive material.
- Items that need content extraction before classification.

### 3. Choose a taxonomy

Pick the primary grouping based on retrieval behavior:

- By domain: `Finance`, `Marketing`, `Product`, `Operations`, `Legal`, `Personal`.
- By project: `Projects/<project-name>/<phase>`.
- By lifecycle: `Inbox`, `Active`, `Reference`, `Archive`, `Delete-Candidates`.
- By source: `Exports/<tool>/<yyyy-mm>`, `Email-Attachments`, `Scans`, `Screenshots`.
- By dataset: `raw`, `processed`, `curated`, `labels`, `evals`, `reports`.

Use only one primary axis at the top level. Put other axes into metadata or second-level folders.

### 4. Define naming rules

Create names that survive search and handoff:

```text
YYYY-MM-DD_source_subject_status.ext
client-project_artifact-version.ext
dataset-name_split_version.ext
```

Rules:

- Prefer ISO dates: `2026-05-29`.
- Avoid ambiguous names like `final`, `new`, `copy`, or `untitled`.
- Preserve original filenames in metadata when renaming would lose context.
- Use stable identifiers for projects, clients, and datasets.
- Keep names short enough for Windows path limits.

### 5. Define metadata

Use metadata when folder structure alone is not enough. A minimal manifest can be CSV, Markdown, JSON, or a database table.

Suggested fields:

```text
id
title
source
source_path
current_path
category
project
owner
created_at
modified_at
status
sensitivity
retention_rule
notes
```

For AI datasets, add:

```text
dataset_version
split
label_source
license
consent_status
quality_score
dedupe_key
evaluation_use
```

### 6. Design lifecycle states

Use explicit states:

- `Inbox`: newly collected, untrusted, not classified.
- `Review`: needs human decision, privacy check, or content extraction.
- `Active`: currently used in work.
- `Reference`: useful, stable, not actively changing.
- `Curated`: cleaned and trusted for reports, AI, or handoff.
- `Archive`: retained but not part of daily work.
- `Delete-Candidates`: safe-looking removal candidates awaiting explicit approval.

Never skip straight from `Inbox` to deletion unless the user approves the exact list.

### 7. Create the system plan

Output a plan like:

```markdown
# Data Organization System Plan

## Goals
- 

## Scope
- Sources:
- Exclusions:
- Sensitive data rules:

## Proposed taxonomy
```text
Data/
  Inbox/
  Active/
  Reference/
  Curated/
  Archive/
  Delete-Candidates/
```

## Naming rules
- 

## Metadata manifest
- Format:
- Required fields:

## Lifecycle
- Intake:
- Review:
- Archive:
- Deletion approval:

## Migration plan
1. Inventory
2. Sample classification
3. Create folders/manifest
4. Dry-run moves
5. Execute approved batch
6. Review and tune rules
```

### 8. Migrate in batches

Keep the first migration small:

- Start with one source or 50-200 representative files.
- Produce a dry-run table before moving.
- Log every move and rename.
- Preserve originals when classification confidence is low.
- Review errors and refine rules before the next batch.

### 9. Maintain the system

Define a lightweight operating rhythm:

- Daily/weekly: clear `Inbox`.
- Monthly: archive inactive projects and review large/duplicate items.
- Quarterly: check taxonomy drift and stale metadata.
- Before AI use: run privacy, license, dedupe, and quality checks.

## Safety Rules

- Treat credentials, private data, customer data, medical/legal/tax records, and identity documents as sensitive by default.
- Do not mix raw and curated datasets without clear labels.
- Do not overwrite source data; create derived outputs separately.
- Do not delete without an exact approved list.
- Prefer a manifest and move log for any multi-folder migration.

## Handoffs

- Use `file-organizer` for physical file moves and duplicate cleanup.
- Use `downloads-desktop-cleanup` for Downloads/Desktop inbox triage.
- Use `python-data-engineering` for cleaning tabular data or building reproducible ETL.
- Use `spreadsheet-ops`, `pdf-operations`, `word-document-ops`, and `image-utils` when content extraction or format-specific processing is needed.
- Use `rag-vector-search` when organized documents need ingestion, chunking, metadata, retrieval, and citations.
