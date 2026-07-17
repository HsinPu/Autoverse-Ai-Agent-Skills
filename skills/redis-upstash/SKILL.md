---
name: redis-upstash
description: Redis and Upstash workflow covering caching, rate limiting, sessions, queues, pub/sub, serverless and edge runtime patterns, key design, TTLs, retries, connection management, observability, and production safety. Use when building or debugging Redis or Upstash-backed features.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Redis And Upstash

Use this skill when implementing or reviewing Redis, Upstash Redis, Upstash Rate Limit, QStash, caching, sessions, queues, pub/sub, or edge/serverless data patterns.

## Core Scope

- Redis key design, TTLs, caching, counters, sessions, locks, pub/sub, and queues
- Upstash serverless Redis, HTTP-based clients, rate limiting, QStash, and edge runtime use
- Next.js, Vercel, Cloudflare Workers, AWS Lambda, and other serverless integration
- Rate limiting, traffic protection, idempotency, retries, and background jobs
- Observability, cost controls, multi-region behavior, and production failure modes

## Workflow

1. Identify the use case: cache, session, rate limit, queue, lock, counter, leaderboard, or pub/sub.
2. Design key names, TTLs, cardinality, and invalidation before writing code.
3. Choose Redis protocol or Upstash HTTP clients based on runtime constraints.
4. Make writes idempotent where retries or queues are involved.
5. Add timeout and fallback behavior for cache and rate-limit paths.
6. Monitor hit rate, latency, errors, blocked requests, key growth, and cost.

## Cache Rules

- Cache only data with clear freshness and invalidation rules.
- Include tenant, user, locale, and permission boundaries in keys when needed.
- Use TTLs to prevent unbounded stale data and key growth.
- Avoid caching private data under shared keys.
- Treat cache as optional unless the product explicitly requires it for correctness.

## Rate Limiting

- Choose the identifier deliberately: IP, user, API key, tenant, route, model, or plan.
- Decide fail-open or fail-closed behavior when Redis is unavailable.
- Add separate limits for high-cost actions and unauthenticated traffic.
- Surface retry-after or reset information where useful.
- Log enough to debug false positives without storing sensitive data unnecessarily.

## Serverless And Edge

- Prefer Upstash HTTP clients where TCP connections are unreliable or unavailable.
- Create clients outside handlers when the runtime supports reuse.
- Keep queue consumers idempotent and resilient to duplicate delivery.
- Avoid global locks that become bottlenecks.
- Track billing-sensitive operations in high-traffic paths.

## Handoff

- Use `nextjs-development` for Next.js route handlers, middleware, and edge runtime use.
- Use `cloudflare-development` for Workers-specific runtime and bindings.
- Use `api-contract-design` for idempotent job and rate-limit response contracts.
- Use `observability-engineering` for metrics, alerts, and dashboards.

## References

- Upstash Rate Limit: `https://upstash.com/docs/oss/sdks/ts/ratelimit/overview`
- Upstash Introduction: `https://upstash.com/docs/introduction`
- Redis Rate Limiting: `https://redis.io/docs/latest/develop/use-cases/rate-limiter/`
