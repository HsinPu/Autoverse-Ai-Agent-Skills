---
name: folder-structure-cleanup
description: Folder structure cleanup workflow for auditing, simplifying, merging, renaming, archiving, and documenting messy directory trees. Use when the user asks to organize folders rather than individual files, reduce nested folders, clean empty folders, separate active and archived project folders, standardize folder names, or design a safer folder hierarchy with a dry-run move plan.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/Autoverse-Ai-Agent-Skills"
---

# Folder Structure Cleanup

Clean up directory trees as structures. Focus on folder purpose, nesting depth, duplicate categories, naming consistency, and safe moves. Do not start by moving files one by one unless the folder plan requires it.

## When To Use

Use this skill when the user wants to organize folders as a hierarchy rather than triage loose files.

- Flatten over-nested directories, merge duplicate folder categories, rename folders, archive old folders, or remove empty folders.
- Preserve project folders and protected boundaries while planning safe moves.
- Produce a dry-run folder move plan before changing a live directory tree.

## Workflow

### 1. Identify the folder problem

Determine whether the user needs:

- Flattening: too many unnecessary nested levels.
- Grouping: many unrelated folders at one level.
- Merging: duplicate categories such as `Docs`, `Documents`, `文件`, and `PDF`.
- Archiving: old projects mixed with active work.
- Naming cleanup: inconsistent dates, casing, language, numbering, or vague names.
- Empty-folder cleanup: folders created by apps, failed exports, or previous cleanup attempts.
- Project separation: code/design/client folders that need boundaries preserved.

If the issue is a long-term taxonomy or metadata system, use `data-organization-system`. If it is mostly Downloads/Desktop inbox cleanup, use `downloads-desktop-cleanup`.

### 2. Run a read-only structure audit

Use PowerShell to inspect the directory tree without changing it:

```powershell
$Root = "C:\path\to\root"

# Top-level folders with counts and size
Get-ChildItem -LiteralPath $Root -Directory -Force | ForEach-Object {
  $files = Get-ChildItem -LiteralPath $_.FullName -Recurse -File -Force -ErrorAction SilentlyContinue
  [pscustomobject]@{
    Folder = $_.FullName
    Files = @($files).Count
    SizeMB = [math]::Round((($files | Measure-Object Length -Sum).Sum) / 1MB, 2)
    LastWriteTime = $_.LastWriteTime
  }
} | Sort-Object SizeMB -Descending

# Empty folders
Get-ChildItem -LiteralPath $Root -Directory -Recurse -Force |
  Where-Object { -not (Get-ChildItem -LiteralPath $_.FullName -Force -ErrorAction SilentlyContinue) } |
  Select-Object FullName, LastWriteTime

# Deep folders, useful for spotting over-nesting
Get-ChildItem -LiteralPath $Root -Directory -Recurse -Force |
  Select-Object FullName, @{N='Depth';E={$_.FullName.Substring($Root.Length).Split('\').Count}} |
  Sort-Object Depth -Descending |
  Select-Object -First 30
```

Summarize top-level folders, deepest paths, empty folders, old folders, and likely duplicate categories.

### 3. Protect folder boundaries

Before proposing moves, mark protected folders:

- Active repositories or projects: `.git`, `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `.sln`, `.xcodeproj`, `.uproject`.
- App-generated folders: `.vscode`, `.idea`, `node_modules`, `.venv`, `dist`, `build`, `Library`, cache folders.
- Cloud sync roots and shared team folders.
- Financial, legal, medical, identity, credential, password, wallet, or certificate folders.
- Folders modified today unless the user asked for aggressive cleanup.

Protected folders can be renamed or moved only with explicit user approval and a clear reason.

### 4. Choose a folder hierarchy pattern

Pick one dominant pattern:

- By lifecycle: `Inbox`, `Active`, `Reference`, `Archive`, `Delete-Candidates`.
- By domain: `Finance`, `Projects`, `Media`, `Documents`, `Personal`, `Operations`.
- By project: `Projects/<client-or-project>/<phase>`.
- By time: `Archive/YYYY/YYYY-MM` for exports, receipts, screenshots, and completed work.
- By source: `Exports/<tool>`, `Scans`, `Email-Attachments`, `Downloads-Archive`.

Keep the top level small. If more than 7-10 top-level folders are needed, group them into domains or lifecycle states.

### 5. Define merge and flatten rules

Use conservative rules:

- Merge only when folder purpose is clearly identical.
- Prefer moving contents into a canonical folder over deleting old folder shells.
- Preserve project root folders; do not scatter their internal files.
- Collapse "folder with only one child folder" when the parent adds no meaning.
- Keep date archives consistent: `YYYY` or `YYYY-MM`, not mixed.
- Standardize folder language only when the user prefers one language.
- Avoid changing folder names that external apps or projects may reference.

### 6. Produce a dry-run folder move plan

Before executing, output:

| Action | Source | Destination | Reason | Risk |
|---|---|---|---|---|
| Create | full path | full path | canonical category | low |
| Move folder | full path | full path | archive completed project | medium |
| Merge contents | full path | full path | duplicate category | medium |
| Review | full path | none | possible active project | high |
| Delete candidate | full path | none | empty folder | needs approval |

Include skipped/protected folders and questions for ambiguous moves.

### 7. Execute safely after approval

Rules:

- Create destination folders first.
- Move folders, not individual files, when preserving context matters.
- Use `Move-Item -LiteralPath` and avoid overwriting.
- If destination exists, merge only with approval or create a suffixed folder.
- Keep a CSV move log with action, source, destination, reason, timestamp.
- Delete empty folders only after a second explicit approval for the exact list.
- Stop on permission errors, path-length errors, cloud-sync conflicts, or surprising file counts.

Example:

```powershell
$Log = Join-Path $Root "folder-cleanup-log.csv"
New-Item -ItemType Directory -LiteralPath "C:\Users\win10\Documents\Archive\2026" -Force

Move-Item -LiteralPath "C:\Users\win10\Documents\Old Client Work" `
  -Destination "C:\Users\win10\Documents\Archive\2026\Old Client Work"

[pscustomobject]@{
  Action = "Move folder"
  Source = "C:\Users\win10\Documents\Old Client Work"
  Destination = "C:\Users\win10\Documents\Archive\2026\Old Client Work"
  Reason = "Completed project archive"
  Timestamp = (Get-Date).ToString("s")
} | Export-Csv -Path $Log -Append -NoTypeInformation -Encoding UTF8
```

## Output

End with:

- Before/after folder structure summary.
- Created, moved, merged, skipped, and review-needed counts.
- Protected folders left untouched.
- Empty folders proposed or removed, only if approved.
- Move log path.
- A small maintenance rule, such as keeping new folders in `Inbox` until reviewed weekly.

## Safety Baseline

Default to audit plus dry-run. Moving folders requires approval. Merging folders requires clear destination rules. Deleting folders requires a second exact-list approval.
