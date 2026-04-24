# Coding Standards Reference

## 觸發時機

- 建立新專案規範
- 重新整理既有規則
- 檢查 lint / format / type / test standards
- 需要團隊可遵循的 coding conventions

## 優先順序

1. Existing project rules
2. Language/framework defaults
3. Team conventions
4. Repository-wide standards

## 應包含的規範

| 類別 | 建議內容 |
|---|---|
| Naming | files, folders, components, functions, variables |
| Imports | ordering, grouping, alias rules |
| Formatting | line length, indentation, wrapping, whitespace |
| Types | strictness, explicit returns, null handling |
| Components | size, responsibility, composition pattern |
| State | where state lives, when to lift state |
| Errors | error boundaries, validation, failure paths |
| Tests | unit/integration/e2e expectations |
| Accessibility | semantic HTML, focus, labels, keyboard flow |
| Performance | memoization, splitting, expensive work boundaries |

## React conventions

- Prefer functional components.
- Prefer Hooks over class components.
- Keep presentational and stateful concerns separate when it helps readability.
- Extract custom hooks when stateful logic is reused.
- Avoid overusing `useMemo` / `useCallback` unless there is a clear reason.

## Node / service conventions

- Keep route, validation, service, and data access layers separate.
- Validate input at the boundary.
- Return stable, structured errors.
- Keep shared helpers side-effect free when possible.

## TS / JS conventions

- Use explicit types when they improve clarity.
- Prefer named exports when a module exposes multiple utilities.
- Keep module APIs small.
- Avoid mixing styles inside the same repository unless there is a clear migration plan.

## Anti-patterns

- One-off exceptions repeated everywhere
- Folder structure based on technical layers only when feature boundaries would be clearer
- Components that do routing, fetching, formatting, and state management all at once
- Lint rules that are impossible to follow consistently
- Standards that are too large to review or remember

## Deliverable shape

- A short rule set
- Examples of approved patterns
- Examples of disallowed patterns
- A note on when exceptions are allowed
