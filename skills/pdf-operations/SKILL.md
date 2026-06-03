---
name: pdf-operations
description: PDF workflow for reading, extracting, merging, splitting, rotating, generating, and OCRing PDF documents. Use when a .pdf file is the primary input or output, or when scanned pages need layout-preserving extraction.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# PDF Operations

Use this skill when a .pdf file is the source or the deliverable.

## When To Use

- Read or extract text, tables, or images from a PDF
- Merge, split, rotate, watermark, or encrypt PDFs
- Create a PDF from structured content
- OCR a scanned PDF so the text becomes searchable

## Workflow

1. Decide whether the task is read, modify, or create.
2. Preserve layout if the output must match the original page structure.
3. Use OCR for scanned or image-only pages.
4. Validate the result by checking page count, text extraction, and visible layout.
5. If the target format is editable text, hand off to `markdown-writer`.

## Rules

- Prefer layout-preserving extraction when tables or forms matter.
- Keep page order stable when merging or splitting.
- Keep source files untouched unless the user asked to modify them.
- Treat passwords and decrypted outputs as sensitive.

## Quality Gate

- The output opens correctly.
- Page count matches the intent.
- Extracted text is usable.
- Any OCR or conversion step is noted.

## Handoff

- For text cleanup or notes, use `markdown-writer`.
- For file organization around PDFs, use `file-organizer`.
