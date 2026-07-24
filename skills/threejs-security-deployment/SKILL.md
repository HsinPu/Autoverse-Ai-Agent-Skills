---
name: threejs-security-deployment
description: "Security and production deployment workflow for Three.js applications. Use for untrusted 3D assets, remote URLs, shader or script injection risk, CORS and CSP, credentials, multiplayer input, privacy, build optimization, CDN caching, compression, HTTPS, source maps, observability, rollout, and rollback."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Security and Deployment

Ship 3D content as untrusted web input with explicit network, resource, privacy, and recovery boundaries.

## Workflow

1. Map asset origins, uploaders, loaders, URLs, parsers, workers, APIs, credentials, analytics, multiplayer messages, build artifacts, and deployment domains.
2. Validate type, size, count, dimensions, compression ratios, extension allowlists, and parse budgets for untrusted assets.
3. Keep remote content as data; never evaluate asset metadata, shader text, or server messages as code.
4. Configure CORS, CSP, HTTPS, credential scope, cache headers, immutable asset fingerprints, compression, and source-map policy.
5. Build and test cold and warm loads, offline and partial failures, browser fallbacks, telemetry redaction, staged rollout, and rollback.

## Rules

- Do not embed long-lived secrets in client bundles or asset URLs.
- Bound geometry, texture, animation, and shader complexity before GPU upload.
- Sanitize DOM labels and overlays derived from asset or network metadata.
- Obtain consent before collecting device or interaction telemetry beyond product necessity.
- Keep deployment fallback behavior usable when advanced graphics are unavailable.

## Evidence

Return the trust-boundary map, validation limits, policy headers, asset delivery plan, privacy controls, build measurements, rollout gates, and recovery procedure.
