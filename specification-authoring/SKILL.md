---
name: specification-authoring
description: "Author, restructure, and review Markdown technical specification documents (Spec / 技術規格說明書 / 規格書) for systems or modules with mandatory YAML front matter, eight fixed top-level chapters (including required vs optional-in-body sections), mirrored functional (Ch.3) and technical (Ch.4) submodule numbering, shared naming/business rules placement, API details under Ch.4, Mermaid-first diagrams, and synchronized version/changelog updates. Use when writing or editing Spec docs, filling specification templates, auditing completeness against an org spec standard, reviewing 功能規格/技術詳細設計 sections, producing Chinese-first technical specs with English technical terms where appropriate, or generating a Spec by scanning or reverse-engineering an existing codebase (map routes, data layer, and integrations into the standard chapter layout), including Java/Spring/Maven/Gradle or Python/FastAPI/Django/Flask/Celery codebases with stack-specific inventory guidance."
---

# Technical specification authoring

Apply organizational rules for **技術規格說明書 (Spec)**. Use the **Core workflow** first; open bundled references **only when** you need field tables, chapter matrices, subsection templates, the delivery checklist, or **code → Spec** mapping steps.

If the user asks to **produce a Spec from code** (scan / reverse-engineer / 從程式碼產出規格), run **[code-to-spec-workflow.md](references/code-to-spec-workflow.md)** to gather and map facts. For **Java/JVM** or **Python** services, also open the matching **[code-to-spec-java.md](references/code-to-spec-java.md)** or **[code-to-spec-python.md](references/code-to-spec-python.md)** checklist. Then apply the steps below for document shape and versioning.

## Core workflow

1. **Confirm document type** is `Spec` (technical specification). Other doc types may use different rules.
2. **Set or verify YAML front matter** at the top: `title`, `version`, `createdDate`, `lastUpdated`, `status`, `author`, `order` (optional). See [front-matter-and-structure.md](references/front-matter-and-structure.md).
3. **Include all eight chapter headings** in order. Do not omit a chapter title. For chapters marked “章節必要，內容可省略”, keep the heading and briefly state N/A with reason if there is nothing to document.
4. **Align Ch.3 and Ch.4**: submodule numbers and feature order must match. Ch.3 answers *what*; Ch.4 answers *how* for the same modules.
5. **Per feature block in Ch.3**: include required subsections **3.x.1–3.x.4** before any **3.x.5+** extensions. Place system-wide naming and business rules in **3.x.3** and **3.x.4**; put per-feature HTTP APIs in **4.x.3** only.
6. **Per feature block in Ch.4**: include **4.x.1–4.x.3** (database, processing logic, API) before **4.x.4+** extensions. Name each **4.x** block to mirror the corresponding **3.x** feature (e.g. 「[功能名稱] 技術實作」).
7. **Ch.8**: include mandatory **8.1 術語表**, **8.2 參考文件**, **8.3 變更記錄**. Append extra appendices after **8.3** if needed.
8. **On every substantive edit**: update `lastUpdated` and `version` in front matter and add a row to **8.3 變更記錄**.

## Diagrams and prose

- Prefer **Mermaid** for architecture, flow, sequence, and ER diagrams; add short explanatory text. Image file naming and paths follow project rules—see [diagrams-and-conventions.md](references/diagrams-and-conventions.md).
- Writing defaults: Chinese primary text; technical terms may include English in parentheses. Max heading depth: four levels (`#` … `####`). Prefer tables for comparable lists. Use fenced code blocks with language tags for code, config, and JSON.

## Reference map (progressive disclosure)

| Reference | Read when |
| :--- | :--- |
| [front-matter-and-structure.md](references/front-matter-and-structure.md) | Defining front matter, main chapter table, Ch.3/Ch.4 subsection templates, and Ch.8 requirements |
| [section-content-guidelines.md](references/section-content-guidelines.md) | Filling **4.1–4.8** narrative expectations (overview, architecture, functional, technical design, UI/workflow, env/ops, testing, appendix) |
| [diagrams-and-conventions.md](references/diagrams-and-conventions.md) | Choosing diagram types, Mermaid diagram kinds, image paths, and general writing/checklist rules |
| [code-to-spec-workflow.md](references/code-to-spec-workflow.md) | **Scanning or reverse-engineering code** to draft a Spec: scope, inventory, chapter mapping, uncertainty handling |
| [code-to-spec-java.md](references/code-to-spec-java.md) | **Java/JVM** codebases: Spring/MVC/WebFlux, JPA/MyBatis, security filters, messaging, Maven/Gradle signals, test slices |
| [code-to-spec-python.md](references/code-to-spec-python.md) | **Python** codebases: FastAPI/Django/Flask, SQLAlchemy/Django ORM, Celery/async, settings/env, pytest layout |

## Related project files

If the repository contains `specification_standard.md`, `specification_standard_template.md`, `naming_standard.md`, or `DirStructure_Standard.md`, treat them as the **project source of truth** when paths or examples differ from bundled references.
