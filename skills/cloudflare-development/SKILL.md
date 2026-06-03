---
name: cloudflare-development
description: Cloudflare development workflow covering Workers, Pages, Wrangler, bindings, environment variables, D1, KV, R2, Durable Objects, Queues, Hyperdrive, local development, deployment, observability, and edge runtime constraints. Use when building or debugging apps on Cloudflare's developer platform.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Cloudflare Development

Use this skill when building, deploying, or debugging apps on Cloudflare Workers, Pages, and the Cloudflare developer platform.

## Core Scope

- Workers, Pages, Pages Functions, Wrangler, routes, and custom domains
- Bindings, secrets, environment variables, compatibility dates, and runtime flags
- D1, KV, R2, Durable Objects, Queues, Hyperdrive, Vectorize, and cache APIs
- Local development, preview environments, deployment, logs, analytics, and rollback
- Edge runtime constraints, request limits, background work, and platform-specific tradeoffs

## Workflow

1. Identify whether the app is a Worker, Pages app, full-stack framework, or hybrid deployment.
2. Inspect `wrangler.toml` or equivalent platform configuration.
3. Map every binding to a real capability: D1, KV, R2, Queue, Durable Object, secret, or service binding.
4. Choose storage deliberately based on consistency, query pattern, object size, and latency needs.
5. Test locally with the same bindings and compatibility date where possible.
6. Deploy to preview first, inspect logs/analytics, then promote to production.
7. Document limits, pricing-sensitive resources, and operational runbooks.

## Storage Choices

- Use D1 for relational SQLite-style data with SQL query needs.
- Use KV for globally distributed, eventually consistent key-value reads.
- Use R2 for object storage, user uploads, media, and large files.
- Use Durable Objects for coordination, per-entity state, WebSockets, and strongly ordered workflows.
- Use Queues for async work, batching, and decoupling producer/consumer workloads.
- Use Hyperdrive when connecting Workers to existing Postgres or MySQL databases.

## Runtime Checks

- Validate APIs against the Workers runtime, not only Node.js.
- Avoid Node-only packages unless compatibility support is confirmed.
- Keep secrets in bindings; do not bundle them into client code.
- Be explicit about cache behavior and invalidation.
- Design retries and queue consumers for at-least-once delivery.

## Handoff

- Use `typescript-development` for Worker TypeScript structure.
- Use `database-design` for D1 schema and migration planning.
- Use `rag-vector-search` if using Vectorize or AI retrieval workflows.
- Use `deployment-operations` for rollout, rollback, smoke checks, and incident response.

## References

- Cloudflare Workers Storage Options: `https://developers.cloudflare.com/workers/platform/storage-options/`
- Cloudflare Bindings: `https://developers.cloudflare.com/workers/configuration/bindings/`
- Cloudflare Developer Platform: `https://www.cloudflare.com/developer-platform/products/`
