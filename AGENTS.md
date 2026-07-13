# Repository Agent Guidance

## Custom Agent Routing

- When a task benefits from delegation, select the best matching available custom Agent from its name and description. The user does not need to name the Agent explicitly.
- Delegate bounded, independent work such as codebase exploration, research, review, testing, or log analysis when doing so improves speed or keeps noisy intermediate output out of the main task.
- Keep simple or tightly coupled work in the main task. Do not spawn an Agent only because one is available.
- Prefer read-only Agents for exploration, research, and review. For implementation, give each Agent a distinct ownership boundary and never assign overlapping writes to the same files.
- Wait for required Agent results, verify important claims, and return one consolidated answer. If no suitable custom Agent is available, continue in the main task.

## Catalog Editing

- Treat `agents/<role>.md` as the canonical Agent source. Do not edit generated files under `adapters/` directly.
- Keep Agent role names unique and flat. Skills belong under `skills/<name>/SKILL.md`.
- After changing canonical Agent definitions, run `npm run generate:agents` before validation.

## Verification

- Run `npm run validate` after changing Agents, Skills, adapters, catalogs, installers, or README catalog metadata.
- Inspect `git diff --check` and the final Git status before handing off changes.
