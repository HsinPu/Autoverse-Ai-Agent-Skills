---
name: firebase-development
description: Firebase development workflow covering Authentication, Firestore, Realtime Database, Security Rules, Cloud Functions, Storage, Cloud Messaging, Hosting, Emulator Suite, deploys, indexes, and production safety. Use when building, reviewing, or debugging Firebase-backed apps.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Firebase Development

Use this skill when building or reviewing apps that use Firebase Auth, Firestore, Realtime Database, Storage, Cloud Functions, Cloud Messaging, Hosting, or Emulator Suite.

## Core Scope

- Firebase Authentication, providers, sessions, custom claims, and account management
- Firestore and Realtime Database data modeling, indexes, queries, and limits
- Security Rules for Firestore, Storage, and Realtime Database
- Cloud Functions, triggers, callable functions, HTTPS functions, and local emulators
- Storage, Cloud Messaging, Hosting, Remote Config, App Check, deploys, and production safety

## Workflow

1. Identify which Firebase products are in use and which clients access them directly.
2. Model data around query patterns and rule boundaries.
3. Write Security Rules before exposing client SDK access.
4. Test rules and functions in the Emulator Suite with authenticated and unauthenticated cases.
5. Keep Admin SDK usage server-side and treat it as bypassing Security Rules.
6. Deploy rules, indexes, functions, and hosting intentionally, not through dashboard-only drift.
7. Monitor errors, function logs, quota, billing, and abuse signals after release.

## Security Rules

- Treat Security Rules as the real authorization layer for client SDK access.
- Test owner, non-owner, admin, unauthenticated, create, read, update, and delete cases.
- Use custom claims carefully; claims can be stale until token refresh.
- Do not rely on hidden UI controls for authorization.
- Keep Storage rules aligned with Firestore ownership rules when files belong to records.

## Functions And Admin SDK

- Use Cloud Functions for privileged writes, external integrations, webhooks, and trusted server workflows.
- Validate callable and HTTPS function inputs explicitly.
- Make triggers idempotent; retries and duplicate events can happen.
- Avoid recursive trigger loops and unbounded fan-out writes.
- Store secrets in platform secret/config mechanisms, not source code.

## Testing And Deploy

- Use Emulator Suite for Firestore, Auth, Functions, Storage, and rule tests where supported.
- Keep `firebase.json`, rules files, indexes, and functions source in version control.
- Test indexes and query shapes before release.
- Separate dev/staging/prod Firebase projects.
- Confirm billing-sensitive features and quotas before production traffic.

## Handoff

- Use `auth-integration` for app-level login/session UX.
- Use `mobile-app-testing` for device behavior, push notifications, and release testing.
- Use `database-design` for data modeling decisions.
- Use `security-code-review` for rules, custom claims, and privileged function review.

## References

- Firebase Security Rules Emulator: `https://firebase.google.com/docs/firestore/security/test-rules-emulator`
- Firebase Rules Deploy: `https://firebase.google.com/docs/rules/manage-deploy`
- Firebase Functions Local Emulator: `https://firebase.google.com/docs/functions/local-emulator`
