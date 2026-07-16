---
name: supabase-development
description: Supabase development guide covering Postgres schema design, Row Level Security, Auth, Storage, Edge Functions, migrations, realtime, environment keys, and local-to-production workflows. Use when building, reviewing, or debugging Supabase-backed applications.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/Autoverse-Ai-Agent-Skills"
---

# Supabase Development

Use this skill when a project uses Supabase for Postgres, Auth, Storage, Realtime, Edge Functions, or managed backend workflows.

## Core Scope

- Postgres schema design, migrations, policies, indexes, and constraints
- Row Level Security (RLS) and policy testing
- Supabase Auth sessions, JWT claims, and provider configuration
- Storage buckets, signed URLs, and object access control
- Edge Functions, service role usage, and server-side clients
- Local development, preview branches, and production promotion

## Workflow

1. Identify which Supabase products are in use: database, auth, storage, realtime, functions, or vector.
2. Model data in Postgres first, then map client access through RLS policies.
3. Separate anon key, authenticated user context, and service role usage.
4. Write migrations for schema changes; do not rely on dashboard-only edits for shared projects.
5. Test policies with authenticated, unauthenticated, owner, non-owner, and admin cases.
6. Verify environment variables and deployment targets before shipping.

## RLS Rules

- Enable RLS on tables exposed to client access.
- Write policies with explicit authenticated checks when needed, such as `auth.uid() IS NOT NULL`.
- Treat the anon key as public; RLS and server checks must carry the security model.
- Keep service role keys server-only and never ship them to browsers or mobile clients.
- Test `select`, `insert`, `update`, and `delete` policies independently.

## Auth And Sessions

- Decide whether Supabase Auth is the identity source or one provider among others.
- Validate user ownership in database policies and server functions.
- Use JWT claims carefully; avoid depending on mutable profile data in stale claims.
- Keep redirects, email templates, and provider callback URLs environment-specific.
- Handle session refresh and expired tokens deliberately in the app.

## Storage And Functions

- Prefer private buckets with signed URLs unless files are truly public.
- Mirror database ownership rules in storage path design.
- In Edge Functions, pass the user `Authorization` header when RLS should apply.
- Use service role only for privileged server workflows with explicit checks.
- Keep webhook and background functions idempotent.

## Handoff

- Use `database-design` for relational modeling and indexing.
- Use `sql-best-practices` for SQL review and query optimization.
- Use `auth-integration` for app-level login/session UX.
- Use `security-code-review` for high-confidence policy or secret exposure review.

## References

- Supabase RLS: `https://supabase.com/docs/guides/database/postgres/row-level-security`
- Supabase Auth: `https://supabase.com/docs/guides/auth`
- Supabase Edge Functions: `https://supabase.com/docs/guides/functions`
