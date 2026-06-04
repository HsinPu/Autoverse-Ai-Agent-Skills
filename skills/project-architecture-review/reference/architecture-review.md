# Project Architecture Review Reference

Use this reference when a project needs architecture diagnosis, not just code cleanup.

## Architecture Smells

- Business rules live in controllers, route handlers, UI components, scripts, ORM models, or SDK wrappers.
- Module imports point in every direction, especially from domain/application code into framework or infrastructure code.
- One folder such as `utils`, `services`, `common`, or `helpers` owns unrelated responsibilities.
- Configuration, policy values, feature flags, endpoint names, or role names are scattered as hardcoded values.
- Tests can only exercise behavior through full-stack or end-to-end paths.
- Adding a feature requires editing many unrelated folders or touching several global registries.
- Generated code, build artifacts, local outputs, and source files are mixed in the same boundary.
- Deployment, migrations, background jobs, or scheduled tasks are invisible from the main project structure.

## Architecture Options

| Option | Good Fit | Avoid When |
|---|---|---|
| Keep current shape with guardrails | Small project, low churn, mostly local pain | Boundaries are already causing repeated regressions |
| Layered architecture | CRUD or service apps with clear UI/application/data layers | Features cut across layers so often that ownership becomes vague |
| Feature-based modules | Product surfaces with independent feature ownership | Shared domain rules need stronger central modeling |
| Modular monolith | Growing backend with several bounded contexts but one deployable | Teams need independent release schedules now |
| Clean/Hexagonal architecture | Domain rules, external systems, and testability matter | The app is mostly simple glue or short-lived automation |
| Plugin/adapter architecture | External providers, tools, commands, or integrations vary often | Variability is speculative and adds indirection |
| Microservices | Independent ownership, scaling, release, and data boundaries are proven | The main problem is code organization inside one repo |

## Audit Questions

### Project Shape

- What are the entry points: web, CLI, jobs, workers, tests, scripts, or package exports?
- Which folders are source, generated output, vendored content, assets, or local artifacts?
- Does the repo layout match the way users, teams, or domains talk about the product?

### Boundaries

- Which module owns core policy and business rules?
- Can domain/application code run without HTTP, UI, ORM, SDK, or filesystem dependencies?
- Are dependencies pointing inward toward stable rules, or outward toward frameworks?
- Are shared helpers truly shared concepts, or just unrelated convenience functions?

### Data Flow

- How does data enter, get validated, move through policy, persist, and leave the system?
- Where are transactions, retries, idempotency, caching, and error mapping handled?
- Are DTOs, persistence models, domain models, and API responses separate when they need to be?

### Configuration

- Are environment variables parsed in one visible place?
- Are magic values replaced with named constants, typed config, or domain policies?
- Are secrets and environment-specific settings isolated from reusable logic?

### Tests

- Can core rules be tested without booting the full framework?
- Are adapters tested where protocol, serialization, persistence, or integration behavior matters?
- Is there a cheap regression test for each migration slice?

## Recommendation Criteria

Prefer the target architecture that:

1. Removes the user's current pain with the least new ceremony.
2. Matches the actual change pattern of the project.
3. Makes boundaries visible in folders, imports, and tests.
4. Can be migrated one slice at a time.
5. Has clear verification commands after each slice.

## Migration Planning

Use small slices:

1. Pick one painful but bounded behavior path.
2. Add characterization tests or a high-value smoke check.
3. Extract one boundary: command object, use case, port, adapter, module, or typed config.
4. Keep old entry points delegating to the new boundary.
5. Run targeted checks and then broader validation.
6. Repeat only after the slice is stable.

Avoid big-bang rewrites unless the current system is disposable.

## Output Template

```markdown
## Architecture Review

### Current State
- [Repo shape, entry points, major modules]

### Key Risks
- [Risk with file/module evidence]

### Options
| Option | Pros | Cons | Migration Cost |
|---|---|---|---|

### Recommendation
[Preferred target direction and why it fits this project]

### Migration Plan
1. [Small slice]
2. [Small slice]
3. [Small slice]

### Verification
- [Targeted tests/checks]
- [Full validation command]

### Handoffs
- [Stack-specific skills to use next]
```
