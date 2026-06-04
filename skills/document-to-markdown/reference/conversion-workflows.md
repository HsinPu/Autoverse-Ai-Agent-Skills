# Document To Markdown Conversion Workflows

Use this reference after `document-to-markdown` is selected and the source format is known.

## Source Format Matrix

| Source | Preferred Path | Notes |
|---|---|---|
| `.docx` | Pandoc or Mammoth | Preserve headings, lists, tables, links, footnotes, and semantic structure. Use `word-document-ops` if comments or tracked changes matter. |
| `.doc` | Convert/export to `.docx` first, then convert | Legacy `.doc` often needs Word/LibreOffice support. Note conversion uncertainty. |
| `.pdf` text | MarkItDown, PyMuPDF/PyMuPDF4LLM, Marker, or PDF text extraction | Check page count and repeated headers/footers. Use `pdf-operations` for layout-heavy extraction. |
| complex PDF | Marker, PyMuPDF4LLM, or another layout-aware PDF pipeline | Prefer this path for dense tables, formulas, multi-column pages, image extraction, or academic/technical documents. |
| scanned PDF | OCR first through Marker, PyMuPDF4LLM, Tesseract, or another OCR path, then Markdown cleanup | Treat confidence as uncertain and note OCR risk. |
| `.pptx` | MarkItDown, Pandoc, or Marker | Preserve slide titles, speaker notes, bullets, and image references where possible. |
| `.html` | Pandoc, MarkItDown, or HTML parser | Remove navigation, scripts, cookie banners, and duplicate boilerplate. |
| Google Docs | Export to `.docx`, `.html`, or plain text first | Use `workspace-google-ops` if Drive access or export is needed. |
| `.rtf` | Pandoc or text extraction | Verify heading/list recovery manually. |
| plain text | Manual Markdown structuring | Infer headings and lists carefully; do not invent content. |

## Conversion Strategy

1. Preserve the original file.
2. Convert to a draft `.md` file.
3. Compare source structure to draft structure.
4. Repair Markdown syntax and document hierarchy.
5. Normalize assets and relative links.
6. Run any available Markdown validation or preview check.
7. Report limitations and unresolved uncertainties.

## Tool Selection Notes

- MarkItDown is a good default when broad format support and quick LLM-friendly Markdown matter more than pixel-level fidelity.
- Pandoc is usually the strongest first choice for DOCX, HTML, PPTX, references, footnotes, tables, and code-block-aware document conversion.
- Marker is a heavier but useful option for complex documents, especially PDFs or image-heavy inputs where tables, equations, images, headers, footers, OCR, or structured JSON/HTML output are important.
- PyMuPDF4LLM is a focused PDF path when Markdown extraction, layout analysis, page chunking, headers/footers, image extraction, or OCR behavior needs explicit control.
- Mammoth is useful for DOCX when semantic Word styles matter and visual styling can be ignored.

## Markdown Cleanup Checklist

- One H1 unless the destination style requires otherwise.
- Heading levels progress logically; do not jump from H1 to H4.
- Blank lines surround headings, lists, tables, and fenced code blocks.
- Lists use consistent bullets and nesting.
- Ordered lists use stable Markdown numbering.
- Tables have headers and separator rows; complex tables may become subsections or lists.
- Links use `[label](url)` and avoid raw tracking URLs when a cleaner URL is known.
- Images use `![alt](relative/path)` with useful alt text.
- Code blocks use triple backticks and a language label when possible.
- Remove page numbers, repeated headers/footers, legal boilerplate repeated on every page, and broken line wrapping.
- Fix OCR artifacts, soft hyphenation, duplicated spaces, mojibake, and stray control characters when visible.

## Quality Tradeoffs

- Markdown cannot preserve exact page layout, margins, columns, floating shapes, or Word/PDF pagination.
- Complex tables may be more readable as lists or separate sections.
- Footnotes, comments, tracked changes, and speaker notes need explicit handling.
- Image extraction may require a separate asset folder and relative references.
- OCR output must be treated as best effort unless checked against the original scan.

## Output Note Template

```markdown
Converted from: [source path]
Output: [markdown path]

Preserved:
- Headings
- Lists
- Tables
- Links

Known limitations:
- [Layout/comments/OCR/images/etc.]

Follow-up checks:
- [Preview command or manual check]
```
