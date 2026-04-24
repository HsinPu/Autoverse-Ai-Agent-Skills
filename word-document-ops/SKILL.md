---
name: word-document-ops
description: Word document workflow for creating, editing, and converting .docx files with formatting, tracked changes, comments, and tables. Use when a Word doc or .docx file is the primary input or output, or when a report, memo, letter, or template needs docx formatting.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Word Document Ops

Use this skill when a .docx file is the source or the deliverable.

## When To Use

- Create or edit Word docs, templates, letters, memos, or reports
- Preserve headings, tables, images, headers, footers, or page numbers
- Work with tracked changes, comments, or find-and-replace in Word files
- Convert between .doc, .docx, PDF, or extracted text when the document format matters

## Workflow

1. Decide whether the task is create, edit, or convert.
2. Preserve existing styles, margins, and section breaks.
3. Keep tracked changes and comments intact unless the user asked to remove them.
4. Validate the output opens cleanly and formatting still matches the intent.
5. If the target output is PDF, hand off to `pdf-operations`.

## Rules

- Prefer the document's existing style system.
- Keep text editable whenever possible.
- Treat redlines and comments as part of the content unless instructed otherwise.

## Quality Gate

- Headings, tables, and images render correctly.
- Page count and layout match the intent.
- The file opens in Word or compatible tooling.

## Handoff

- For PDF output, use `pdf-operations`.
- For plain-text or markdown cleanup, use `markdown-writer`.
