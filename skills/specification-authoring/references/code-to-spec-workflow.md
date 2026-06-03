# Drafting a Spec from an existing codebase

Read this when the task is **reverse-engineering** or **scanning code** to produce a **技術規格說明書**, not when you are only editing prose in an already-structured Spec.

## Relationship to the Spec standard

This file describes **how to gather and map information**. After mapping, apply the **Core workflow** in `SKILL.md` (front matter, eight chapters, Ch.3/Ch.4 alignment, Ch.8). Use other bundled references for section detail and checklists.

## Workflow

1. **Fix scope** — Agree the boundary (whole repo vs package vs service). Identify runtime entry points (e.g. `main`, HTTP router, scheduled jobs, message consumers).

2. **Build an inventory** (adjust to stack):
   - **External surface**: HTTP routes / GraphQL / RPC; auth middleware; public DTOs or OpenAPI if present.
   - **Domain logic**: services/use-cases; main business branches and validations visible in code.
   - **Data**: ORM entities, migrations, SQL/Mapper XML, repositories; note DB product if obvious.
   - **Integrations**: outbound HTTP clients, message queues, file storage, third-party SDKs.
   - **Ops signals**: Docker/K8s manifests, env var names in config, logging/metrics hooks (for Ch.6).
   - **Tests**: test folders and kinds (unit/integration/e2e) for Ch.7.
   - **Language-specific checklists** — When the repo is clearly **Java/JVM** or **Python**, use the matching inventory sheet listed in the parent skill **Reference map** (`code-to-spec-java`, `code-to-spec-python`) so you do not miss stack-typical entry points (e.g. Spring controllers, MyBatis XML, FastAPI routers, Django `urls`, Celery tasks).

3. **Map inventory to chapters**
   - **Ch.1–2**: Purpose, context, architecture diagram (from modules and dependencies), tech stack, integration points.
   - **Ch.3**: One **3.x** per cohesive capability (user journey or bounded API/feature area). Derive **3.x.1–3.x.2** from behavior and entry points. Put **shared** naming and business rules once (or in one module) per org rules—avoid pasting duplicates in every **3.x** without a pointer.
   - **Ch.4**: Matching **4.x** for each **3.x**—DB, processing flow, API contracts from code (paths, methods, payloads, errors).
   - **Ch.5–7**: UI/workflow from front-end routes/components if any; env/ops from config and deploy artifacts; testing from what exists plus stated gaps.

4. **Handle uncertainty** — Do not invent behavior. Mark gaps with **待確認** / **TODO** and optional owner, or omit detail and note “not found in repository”. Prefer citing file paths for traceability when helpful.

5. **Diagrams** — Add Mermaid where they clarify architecture, sequence, or ER; follow the **diagrams-and-conventions** entry in the parent skill Reference map.

6. **Versioning** — Set initial `version` / `lastUpdated` / **8.3 變更記錄** (e.g. first draft generated from codebase on date X). If the user later edits the Spec only, still bump version and append **8.3** per standard.

## What not to dump

- Do not paste large unrelated source listings into the Spec; summarize and point to paths or modules.
- Do not treat generated code or vendored third-party trees as “system design” unless the task scope includes them.
