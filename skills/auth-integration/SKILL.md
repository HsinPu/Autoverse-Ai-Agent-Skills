---
name: auth-integration
description: Authentication integration guide covering sessions, OAuth/OIDC providers, credentials, magic links, passkeys, authorization boundaries, cookies, CSRF, callbacks, adapters, and framework integration. Use when adding, reviewing, or debugging app authentication flows.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/Autoverse-Ai-Agent-Skills"
---

# Auth Integration

Use this skill when implementing login, logout, session management, OAuth/OIDC providers, credentials, magic links, passkeys, or authorization boundaries in an application.

## Core Scope

- Auth.js / NextAuth, Better Auth, Clerk, Auth0, Supabase Auth, Firebase Auth, and custom auth
- OAuth/OIDC provider setup, callback URLs, scopes, claims, and account linking
- Session storage, cookies, CSRF, refresh, expiration, and logout behavior
- Role, permission, tenant, and resource ownership checks
- Database adapters, user profiles, and auth event handling

## Workflow

1. Identify the identity provider, framework, runtime, and session strategy.
2. Define public, authenticated, owner-only, admin, and service-to-service surfaces.
3. Keep authentication separate from authorization; login does not prove access to every resource.
4. Implement server-side authorization checks for every protected action and data read.
5. Test callback, session refresh, logout, expired session, forbidden access, and account linking flows.
6. Review cookies, secrets, redirects, and logs before production.

## Provider Choices

- Use hosted providers when speed, compliance, or enterprise SSO matters.
- Use Auth.js / NextAuth-style libraries when the app needs framework-native control.
- Use Supabase/Firebase Auth when tightly coupled with those backend platforms.
- Avoid custom password auth unless the project can own storage, reset, rate limits, and abuse controls.
- Prefer passkeys or OAuth when they reduce password-handling risk.

## Security Checks

- Keep client IDs public and client secrets server-only.
- Use secure, HTTP-only cookies for server-managed sessions.
- Validate callback URLs and redirect destinations to prevent open redirects.
- Do not trust role or user IDs sent from the client.
- Rate-limit credential login, magic link requests, and sensitive auth actions.
- Avoid logging tokens, cookies, authorization headers, magic links, or reset links.

## Authorization Model

- Define roles and permissions in domain language.
- Check tenant and resource ownership close to data access.
- Keep admin bypasses explicit and test them.
- Use database policies where supported, but still design app-level authorization clearly.
- Add negative tests for non-owner and unauthenticated access.

## Handoff

- Use `nextjs-development` for Next.js route, middleware, and server boundary details.
- Use `supabase-development` for Supabase Auth and RLS integration.
- Use `spring-security` for Spring applications.
- Use `security-code-review` for auth-sensitive review.

## References

- Auth.js: `https://authjs.dev/getting-started`
- Better Auth: `https://www.better-auth.com/docs`
- OWASP Authentication Cheat Sheet: `https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html`
