---
name: file-organizer
description: File organization guide for restructuring folders, finding duplicates, recommending cleaner hierarchies, and automating cleanup workflows. Use when organizing Downloads, Desktop, Documents, folder trees, project archives, media folders, or improving ongoing file management and disk hygiene habits.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# File Organizer

Organize local files with an evidence-first, plan-before-moving workflow. Default to Windows and PowerShell, but adapt the same sequence to any OS when the user gives another environment.

## Core Workflow

### 1. Scope the cleanup

Clarify or infer:

- Target paths: Downloads, Desktop, Documents, project folders, media folders, folder trees, or a specific path.
- Goal: easier retrieval, duplicate cleanup, disk space recovery, archive preparation, or a new long-term structure.
- Risk boundaries: active projects, synced cloud folders, legal/tax/medical files, credentials, private photos, or anything the user says not to touch.
- Strength: report only, dry-run plan, conservative moves, or approved cleanup.

If the task is specifically "Downloads and Desktop are messy", route to `downloads-desktop-cleanup` when available. If the task is about reorganizing folder trees, merging folders, flattening nesting, or cleaning empty folders, route to `folder-structure-cleanup`.

### 2. Inventory before changing anything

Use a read-only pass first:

```powershell
$Target = "C:\path\to\folder"
Get-ChildItem -LiteralPath $Target -Force | Measure-Object
Get-ChildItem -LiteralPath $Target -Recurse -File -Force |
  Group-Object Extension |
  Sort-Object Count -Descending |
  Select-Object Name, Count

Get-ChildItem -LiteralPath $Target -Recurse -File -Force |
  Sort-Object Length -Descending |
  Select-Object -First 25 FullName, @{N='SizeMB';E={[math]::Round($_.Length / 1MB, 2)}}, LastWriteTime

Get-ChildItem -LiteralPath $Target -Recurse -File -Force |
  Sort-Object LastWriteTime |
  Select-Object -First 25 FullName, LastWriteTime
```

Summarize file count, folder count, total size, largest files, old files, extension clusters, and obvious "inbox" piles.

### 3. Classify by content and future retrieval

Prefer structures that match how the user will look for files later:

- Type: documents, spreadsheets, images, videos, audio, archives, installers, code, exports.
- Purpose: work, personal, finance, receipts/invoices, reference, project assets, temporary.
- Status: inbox, active, review, archive, delete candidates.
- Date: year/month for receipts, exports, photos, and finished archive material.

Do not over-sort small folders. If a folder has fewer than roughly 20 files, a simple `Archive` or `Inbox` may be better than many categories.

### 4. Find duplicates safely

Start with cheap signals, then use hashes only where useful:

```powershell
# Same filename candidates
Get-ChildItem -LiteralPath $Target -Recurse -File -Force |
  Group-Object Name |
  Where-Object { $_.Count -gt 1 } |
  Select-Object Name, Count

# Same content candidates; slower on huge folders
Get-ChildItem -LiteralPath $Target -Recurse -File -Force |
  Get-FileHash -Algorithm SHA256 |
  Group-Object Hash |
  Where-Object { $_.Count -gt 1 }
```

For every duplicate group, list full path, size, modified time, and suggested keeper. Never delete from duplicate detection alone; ask for confirmation on the exact delete list.

### 5. Propose a dry-run plan

Before moving anything, present a plan like:

```markdown
# Cleanup Plan

## Inventory
- Target:
- Files / folders / total size:
- Main clusters:

## Proposed structure
- Inbox:
- Documents:
- Media:
- Installers:
- Archives:
- Review needed:

## Planned changes
- Create folders:
- Move files:
- Rename files:
- Duplicate candidates:
- Delete candidates:

## Safety notes
- Skipped paths:
- Sensitive/private files:
- Decisions needed:
```

Ask for approval before executing the move/rename/delete phase.

### 6. Execute with an audit trail

When approved:

- Create destination folders first.
- Use `-LiteralPath` for paths with spaces or special characters.
- Do not overwrite on name conflicts; suffix with date or ask the user.
- Record a move log with source, destination, action, and reason.
- Stop and report if permission errors, path length issues, or unexpected file counts appear.

Example:

```powershell
New-Item -ItemType Directory -LiteralPath "C:\Users\win10\Documents\Files\Documents" -Force
Move-Item -LiteralPath "C:\source\file.pdf" -Destination "C:\Users\win10\Documents\Files\Documents\file.pdf"
```

### 7. Report results and maintenance

Finish with:

- Counts moved, renamed, archived, skipped, and deleted.
- Space recovered, if deletion was approved.
- New folder structure.
- Move log location or summary.
- A small recurring habit, such as weekly Downloads triage or monthly archive review.

## Safety Rules

- Never delete without an explicit, exact delete list approved by the user.
- Never reorganize active repositories, project folders, cloud-sync roots, password stores, credential files, tax/legal/medical folders, or hidden/system folders unless the user specifically requests it.
- Treat privacy-sensitive files as "review needed"; do not include them in automated cleanup candidates.
- Prefer move-to-archive over deletion when uncertain.
- Keep the first cleanup conservative; expand only after the user accepts the pattern.

## Handoffs

- Use `downloads-desktop-cleanup` for a focused Downloads/Desktop workflow.
- Use `folder-structure-cleanup` for folder-tree audits, folder merges, flattening, empty folder cleanup, and active/archive folder separation.
- Use `pdf-operations`, `word-document-ops`, `spreadsheet-ops`, or `image-utils` when file contents need extraction, conversion, OCR, resizing, or deterministic processing.
- Use `terminal-ops` when the task is mostly command execution, verification, or git state.
