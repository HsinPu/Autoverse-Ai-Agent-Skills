---
name: api-contract-testing
description: API contract testing workflow for proving provider and consumer compatibility through schema checks, executable examples, consumer-driven expectations, breaking-change analysis, and release gates. Use when an HTTP, event, webhook, or SDK-facing API must be verified against an explicit contract or protected from incompatible changes; use api-contract-design for design decisions and openapi-spec-generation for authoring specifications.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "github/awesome-copilot"
  reference-license: "MIT"
  reference-revision: "2c2461a7fa383f664bb75546f03a2c6087f3819d"
---

# API Contract Testing

Prove that an API implementation and its known consumers still agree on observable behavior.

## Workflow

1. Identify the canonical contract, candidate revision, provider, known consumers, supported versions, and compatibility policy.
2. Build a coverage matrix for requests, responses, errors, headers, authentication, pagination, idempotency, webhooks, or events that are public behavior.
3. Select the narrowest useful contract-test patterns and define which side owns each expectation.
4. Create deterministic fixtures that include valid, boundary, malformed, unauthorized, and compatibility-sensitive cases.
5. Verify provider behavior against the candidate contract, including negative cases and documented error semantics.
6. Verify consumer expectations against a provider stub, recorded contract, or candidate provider without coupling tests to provider internals.
7. Compare the released and candidate contracts. Classify changes as compatible, conditionally compatible, or breaking for each supported consumer.
8. Publish a contract-test report and block release on unresolved breaking changes or missing evidence required by policy.

## Release Evidence

Record:

- contract source, released revision, and candidate revision;
- provider build and consumer versions tested;
- covered operations and deliberately excluded surfaces;
- provider-conformance and consumer-expectation results;
- compatibility-diff findings and affected consumers;
- approved exceptions, owners, expiry, and migration plan;
- final gate decision and commands needed to reproduce it.

## Boundaries

- Do not redesign an API or silently alter its source-of-truth contract to make a test pass.
- Do not label a generic integration test as a contract test without an explicit external expectation.
- Do not treat schema validation alone as proof of status codes, error semantics, authentication, or consumer compatibility.
- Do not replay sensitive production payloads without sanitization and authorization.
- Do not call live consumer or provider systems when a deterministic local or isolated environment can prove the contract.

## References

- Read [contract-test-patterns.md](references/contract-test-patterns.md) when selecting provider, consumer-driven, compatibility-diff, webhook, event, or generated-SDK test patterns.

## Handoff

- Use `api-contract-design` when requests, responses, errors, pagination, idempotency, or versioning rules remain undecided.
- Use `openapi-spec-generation` when the OpenAPI document must be created, updated, or repaired for static syntax, schema composition, example conformance, or internal consistency; return here only after that document becomes the authoritative executable contract.
- Use `testing-strategy` to place contract tests within the broader unit, integration, and end-to-end test mix.
- Use `test-driven-development` when a failing contract expectation should lead an implementation change.
- Use the relevant backend or client-development skill for provider and SDK implementation details.
- Use `github-actions-ci` to automate contract verification and compatibility gates.
- Use `pipeline-review` for an independent decision over breaking-change evidence and approved exceptions.
- Use `verification-before-completion` before claiming the provider, consumer, or release candidate is compatible.
