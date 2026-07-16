---
name: mongodb-development
description: MongoDB development workflow covering schema design, collections, indexes, aggregation pipelines, transactions, change streams, Atlas, security, backups, performance, and Node.js application integration. Use when building, reviewing, or debugging MongoDB-backed applications.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/Autoverse-Ai-Agent-Skills"
---

# MongoDB Development

Use this skill when building, reviewing, tuning, or debugging applications backed by MongoDB or MongoDB Atlas.

## Core Scope

- Document schema design, embedding vs referencing, collection boundaries, and data growth
- Indexes, query patterns, aggregation pipelines, Atlas Search, and performance diagnostics
- Transactions, change streams, retryable writes, and consistency tradeoffs
- Atlas configuration, backups, security, network access, credentials, and observability
- Node.js and TypeScript integration with official drivers or ODMs such as Mongoose

## Workflow

1. Identify access patterns before modeling collections.
2. Decide embedding vs referencing based on read/write shape, document growth, and consistency needs.
3. Create indexes that support actual filters, sorts, and joins-like lookups.
4. Use aggregation pipelines for server-side transformations and reporting.
5. Use transactions only when schema design cannot keep related updates in one document boundary.
6. Review Atlas/network/IAM settings before production access.
7. Monitor slow queries, index usage, connection pools, document size, and storage growth.

## Schema Design

- Embed data that is read and written together and stays bounded.
- Reference data when arrays can grow without bound or entities have independent lifecycle.
- Avoid unbounded arrays inside hot documents.
- Store denormalized fields intentionally and define update strategy.
- Keep document validation and application validation aligned.

## Index And Query Checks

- Create compound indexes that match query predicates and sort order.
- Watch for collection scans in explain plans.
- Avoid indexes that add write overhead without serving real queries.
- Use projection to avoid transferring large documents unnecessarily.
- Review aggregation memory and `$lookup` costs on large collections.

## Operational Checks

- Use least-privilege database users.
- Restrict Atlas network access and rotate credentials when exposed.
- Verify backups and point-in-time restore where supported.
- Use change streams for event-driven reactions, not as a substitute for durable business transactions.
- Track retry behavior and duplicate handling in consumers.

## Handoff

- Use `database-design` for broader data modeling decisions.
- Use `javascript-development` or `typescript-development` for app integration.
- Use `nodejs`-adjacent local project patterns when present; do not force an ODM if the repo uses the official driver.
- Use `security-code-review` for access control and secret exposure review.

## References

- MongoDB Schema Design: `https://www.mongodb.com/docs/manual/data-modeling/schema-design-process/`
- MongoDB Indexes: `https://www.mongodb.com/docs/manual/indexes/`
- MongoDB Aggregation Pipeline: `https://www.mongodb.com/docs/manual/core/aggregation-pipeline/`
- MongoDB Change Streams: `https://www.mongodb.com/docs/manual/changestreams/`
