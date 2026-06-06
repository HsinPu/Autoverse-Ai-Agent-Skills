---
name: downloads-desktop-cleanup
description: Focused Windows Downloads and Desktop cleanup workflow for inventorying messy user folders, categorizing files, finding duplicate or large files, separating installers, screenshots, archives, exports, receipts, project candidates, and producing a dry-run move/delete plan. Use when the user asks to organize Downloads, clean the Desktop, recover disk space from personal files, or build a safer weekly file triage routine.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Downloads Desktop Cleanup

Clean `Downloads` and `Desktop` as inboxes, not as permanent storage. The goal is to preserve useful files, move obvious material to stable homes, surface uncertain items for review, and avoid risky deletion.

## When To Use

Use this skill when the user's Desktop or Downloads folder is messy and needs inbox-style triage.

- Inventory loose files, screenshots, installers, archives, exports, receipts, and duplicate downloads.
- Separate obvious move candidates from sensitive or uncertain review items.
- Build a safe dry-run cleanup plan before moving or deleting anything.

## Workflow

### 1. Start with read-only inventory

Default targets:

```powershell
$Targets = @(
  [Environment]::GetFolderPath("Desktop"),
  (Join-Path $env:USERPROFILE "Downloads")
)
```

Collect a compact inventory before planning:

```powershell
foreach ($Target in $Targets) {
  Write-Host "`n== $Target =="
  Get-ChildItem -LiteralPath $Target -Force | Measure-Object
  Get-ChildItem -LiteralPath $Target -File -Force |
    Group-Object Extension |
    Sort-Object Count -Descending |
    Select-Object Name, Count
  Get-ChildItem -LiteralPath $Target -File -Force |
    Sort-Object Length -Descending |
    Select-Object -First 20 FullName, @{N='SizeMB';E={[math]::Round($_.Length / 1MB, 2)}}, LastWriteTime
}
```

Also check obvious subfolder piles only when the top-level inventory suggests they matter; do not recurse through active project folders by default. If the main problem is nested folders, duplicate folder names, or folder-tree design, hand off to `folder-structure-cleanup`.

### 2. Classify into cleanup buckets

Use these buckets as a starting point:

- Keep on Desktop: shortcuts, active notes, files the user explicitly wants visible.
- Desktop inbox: loose files that need user review.
- Documents: PDF, DOCX, TXT, Markdown, presentations, spreadsheets.
- Images: screenshots, downloads, design exports, scanned images.
- Videos and audio: recordings, screen captures, clips, voice notes.
- Archives: ZIP, RAR, 7Z, TAR, backup bundles.
- Installers: EXE, MSI, DMG, PKG, driver packages, app installers.
- Receipts and invoices: files with invoice, receipt, order, bill, tax, payment, or merchant-like names.
- Project candidates: code exports, design bundles, project folders, source files that may belong under a project workspace.
- Review needed: unknown extensions, private/sensitive filenames, encrypted files, partially downloaded files, and anything with ambiguous value.
- Delete candidates: exact duplicate downloads, failed partial downloads, obsolete installers, empty files, and temporary exports.

Never treat private or sensitive files as automatic move/delete candidates. Put them in review.

### 3. Reject risky items from automation

Skip or ask before touching:

- Active code repositories, design projects, writing drafts, and folders with `.git`, `node_modules`, `.venv`, `package.json`, `pyproject.toml`, or app-specific project files.
- Cloud sync roots or shared folders when moves may confuse sync state.
- Password managers, key files, certificates, wallet backups, `.env`, SSH keys, API keys, and recovery codes.
- Legal, medical, tax, identity, banking, and private-photo material.
- Hidden/system files and application data.
- Files modified today unless the user asks for aggressive cleanup.

### 4. Detect duplicates and space hogs

Use filename grouping first:

```powershell
foreach ($Target in $Targets) {
  Get-ChildItem -LiteralPath $Target -File -Force |
    Group-Object Name |
    Where-Object { $_.Count -gt 1 } |
    Select-Object Name, Count
}
```

Use hashes only for a bounded set such as duplicate names, same sizes, or top-level files:

```powershell
Get-ChildItem -LiteralPath $Target -File -Force |
  Get-FileHash -Algorithm SHA256 |
  Group-Object Hash |
  Where-Object { $_.Count -gt 1 }
```

For disk hygiene, flag:

- Installers older than 30-90 days.
- Archives that have already been extracted.
- Large videos or screen recordings.
- Duplicate browser downloads with `(1)`, `(2)`, `copy`, or `複本` in the name.
- Failed downloads such as `.crdownload`, `.part`, `.tmp`, or zero-byte files.

### 5. Propose a destination structure

Keep the structure simple and Windows-friendly. Suggested destinations:

```text
Desktop\_Inbox
Desktop\_Shortcuts
Documents\Downloads-Archive\YYYY-MM
Documents\Files\Documents
Documents\Files\Images
Documents\Files\Videos
Documents\Files\Installers
Documents\Files\Archives
Documents\Files\Receipts-Invoices
Documents\Projects\_Candidates
```

Adjust names to the user's existing folders. Do not create a new taxonomy if the user already has a clear one.

### 6. Produce a dry-run table

Before moving anything, output a table with:

| Action | Source | Destination | Reason | Risk |
|---|---|---|---|---|
| Move | full path | full path | screenshot older than 30 days | low |
| Review | full path | none | possible private document | high |
| Delete candidate | full path | none | exact duplicate hash | needs approval |

Then ask for approval. Delete candidates must stay candidates until the user approves the exact list.

### 7. Execute safely after approval

Rules:

- Create folders before moves.
- Move files, do not delete, unless deletion was explicitly approved.
- Avoid overwrites; append `-YYYYMMDD` or `-copy2` when needed.
- Keep a CSV move log with `Action,Source,Destination,Reason,Timestamp`.
- Stop on unexpected permission errors or surprising file counts.

Example move-log pattern:

```powershell
$Log = Join-Path $env:USERPROFILE "Desktop\cleanup-move-log.csv"
[pscustomobject]@{
  Action = "Move"
  Source = "C:\source\file.pdf"
  Destination = "C:\Users\win10\Documents\Files\Documents\file.pdf"
  Reason = "PDF document from Downloads"
  Timestamp = (Get-Date).ToString("s")
} | Export-Csv -Path $Log -Append -NoTypeInformation -Encoding UTF8
```

## Output

End with:

- Inventory summary for Desktop and Downloads.
- Approved actions performed.
- Items skipped or left for review.
- Space recovered only if deletion happened.
- Move log path.
- A small maintenance rule, such as "Downloads is an inbox; review anything older than 14 days weekly."

## Safety Baseline

Default behavior is analysis plus dry-run. Moving requires approval. Deleting requires a second explicit approval for the exact delete list.

## Handoffs

- Use `folder-structure-cleanup` when the cleanup is mostly folder hierarchy, folder merges, empty folders, or archive structure.
- Use `file-organizer` when the cleanup is general file sorting across multiple folders.
- Use `data-organization-system` when the user needs a long-term taxonomy, metadata, lifecycle, and retention policy.
