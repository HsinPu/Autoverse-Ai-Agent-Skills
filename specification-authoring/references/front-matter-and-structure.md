# Front matter and document structure

Table of contents: [Front matter](#front-matter) · [Main chapters](#main-chapters-eight) · [Ch.3 submodule template](#chapter-3-functional-specification-submodules) · [Ch.4 submodule template](#chapter-4-detailed-technical-design-submodules) · [Chapter 8](#chapter-8-appendix--revision)

## Front matter

Every Spec Markdown file starts with:

```yaml
---
title: "文件名稱"
version: "V0.1"
createdDate: "YYYY-MM-DD"
lastUpdated: "YYYY-MM-DD"
status: "草稿"
author: "作者帳號"
order: 1
---
```

| Field | Required | Format / values | Notes |
| :--- | :---: | :--- | :--- |
| `title` | ✓ | string | Full document title |
| `version` | ✓ | `V{major}.{minor}` | e.g. `V1.0` |
| `createdDate` | ✓ | `YYYY-MM-DD` | First creation date |
| `lastUpdated` | ✓ | `YYYY-MM-DD` | Last modification date |
| `status` | ✓ | `草稿` / `已發行` / `已廢止` | Lifecycle |
| `author` | ✓ | string | Primary author id or name |
| `order` | ✗ | positive integer | Sidebar order; smaller first |

## Main chapters (eight)

All eight **top-level** chapter headings must appear. Do not skip a chapter title.

| # | Title | Content requirement |
| :--- | :--- | :--- |
| 1 | 概覽 (Overview) | **Required** |
| 2 | 系統架構 (System Architecture) | **Required** |
| 3 | 功能規格 (Functional Specification) | **Required** |
| 4 | 技術詳細設計 (Detailed Technical Design) | **Required** |
| 5 | 介面與工作流程 (UI/UX & Workflow) | Section required; body may be minimal with reason |
| 6 | 環境與運維 (Environment & Maintenance) | Section required; body may be minimal with reason |
| 7 | 測試與驗證 (Testing & Validation) | Section required; body may be minimal with reason |
| 8 | 附錄與變更記錄 (Appendix & Revision) | **Required** |

**Layering**

- **System-level** (no per-feature split): chapters 1, 2, 5, 6, 7, 8.
- **Feature-level**: chapter 3 and chapter 4 subsections, one block per feature module; **3.x** and **4.x** numbering and order must stay aligned.

## Chapter 3: Functional specification submodules

For each feature **3.x**, use this order. **3.x.1–3.x.4** are mandatory; **3.x.5+** optional.

| Submodule | Title | Purpose |
| :--- | :--- | :--- |
| 3.x.1 | 功能描述 (Feature Description) | Purpose and expected outcome |
| 3.x.2 | 功能用法 (Usage) | Entry points and steps |
| 3.x.3 | 介面/元件命名規範 (Naming Convention) | **System-wide** shared naming rules |
| 3.x.4 | 業務規則與限制 (Business Rules & Constraints) | **System-wide** rules and constraints |
| 3.x.5+ | (extend as needed) | Optional extra subsections |

> Per-feature API details belong under **4.x.3 API 規格**, not in 3.x.3 / 3.x.4.

## Chapter 4: Detailed technical design submodules

For each feature **4.x**, use this order. **4.x.1–4.x.3** are mandatory; **4.x.4+** optional.

| Submodule | Title | Purpose |
| :--- | :--- | :--- |
| 4.x.1 | 資料庫設計 (Database Design) | Tables, indexes, DB access logic, SQL |
| 4.x.2 | 程式處理邏輯 (Processing Logic) | Flow and exception handling |
| 4.x.3 | API 規格 (API Specification) | HTTP request/response contracts |
| 4.x.4+ | (extend as needed) | Optional extra subsections |

Name each **4.x** to match the corresponding **3.x** feature (e.g. 「[功能名稱] 技術實作」).

## Chapter 8: Appendix & revision

Mandatory subsections:

- **8.1 術語表** — Terms **introduced by this system** (not generic industry jargon only).
- **8.2 參考文件** — External references and links.
- **8.3 變更記錄** — Version history; keep in sync with front matter `version` / `lastUpdated` on every change.

You may add **8.4+** appendices (FAQ, client setup, etc.) after **8.3**.
