# Diagrams and writing conventions

Table of contents: [Diagram types](#diagram-types) · [Writing rules](#writing-rules)

## Diagram types

| Kind | Use for | Tool |
| :--- | :--- | :--- |
| System architecture | Components, data flow | Mermaid `flowchart` or ASCII |
| Flowchart | Logic and branches | Mermaid `flowchart` |
| Sequence | Inter-system timing | Mermaid `sequenceDiagram` |
| ER | Data model | Mermaid `erDiagram` |

- Prefer **Mermaid**; use image files only when Mermaid is insufficient.
- Always add short narrative explaining what the diagram shows.

Image assets: follow the repository **命名規範** file (e.g. `naming_standard.md`) when present, and place under `/docs/public/[ProjectId]/images/` or the path your project **specification_standard** defines.

## Writing rules

1. **Language**: Chinese primary; technical terms may include English in parentheses (e.g. 資料庫 (Database)).
2. **Headings**: At most four levels (`#` … `####`).
3. **Tables**: Use tables for comparable structured data.
4. **Code blocks**: Fence with language tags (`yaml`, `json`, etc.) for code, config, and samples.
5. **Versioning**: On each content change, update front matter `lastUpdated`, `version`, and add a row to **8.3 變更記錄**.
6. **Image paths in docs**: Omit a `public/` prefix; reference from site root. Use your project’s published path pattern (example placeholder: `/[project-or-site-prefix]/images/xxx.svg`).

## Checklist before delivery

- [ ] Front matter complete and consistent with **8.3**
- [ ] All eight main chapters present; optional-body chapters either filled or explained
- [ ] Ch.3 / Ch.4 numbering and feature order aligned
- [ ] **3.x.3 / 3.x.4** = system-wide rules; per-feature APIs in **4.x.3**
- [ ] **8.1–8.3** present
- [ ] Diagrams explained; Mermaid preferred
