# Session Handoff Record

Use this template only when the handoff must be stored as a durable Markdown artifact.

```markdown
# Handoff: <task>

- Updated: <timestamp with timezone>
- Workspace: <absolute or repository-relative identity>
- Branch and revision: <branch> @ <commit>
- Working tree: <clean or concise dirty summary>
- Next owner or tool: <if known>

## Goal And Non-Goals

<requested outcome and explicit exclusions>

## Current State

<what is true now, with links to authoritative artifacts>

## Decisions

- <decision, owner, rationale, status>

## Changes And Evidence

- <change or artifact> — <verification and result>

## Gaps And Blockers

- <failed, skipped, unavailable, stale, or unresolved item>

## Next Safe Action

<one exact action, prerequisites, and done condition>

## Suggested Route

- Skills or roles: <names and reason>
- Commands or checks: <exact non-secret commands>
```

Before saving, replace every placeholder, remove copied sensitive data, and link to large artifacts instead of embedding them.
