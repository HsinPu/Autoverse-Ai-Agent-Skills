# Repository Scan And Guardrails

## Contents

- Inventory
- Contributor journey
- Agent instructions
- CI baseline
- Hook bypass protection
- Readiness evidence

## Inventory

Inspect languages, package managers, lockfiles, build tools, entry points, generated code, tests, deploy manifests, secrets patterns, ownership, release metadata, and existing instructions. Do not generate a second toolchain when one is already authoritative.

## Contributor Journey

Verify from a representative clean environment:

1. clone or checkout
2. install supported runtime and dependencies
3. configure non-secret environment
4. run the application or primary command
5. run format, lint, type, test, build, and package checks
6. create a scoped change
7. submit through the documented review and release path

## Agent Instructions

AGENTS.md should state repository scope, preferred search and build commands, file ownership, generated paths, verification, external-action boundaries, and nested overrides. Keep it repository-specific and test the named commands.

## CI Baseline

- pin runtime and action versions deliberately
- use least-privilege workflow tokens
- isolate untrusted pull-request execution from secrets
- cache immutable dependency inputs safely
- run the same core checks available locally
- retain useful test, coverage, scan, and package artifacts
- make skipped or empty test discovery fail visibly when appropriate

## Hook Bypass Protection

If the repository requires pre-commit checks, document the policy and enforce it through CI. A local hook may reject bypass flags such as `--no-verify`, but it must not be the only control. Provide an attributable break-glass process for emergencies.

## Readiness Evidence

Record commands executed, supported environments, package contents, link checks, security scans, known gaps, and ownership. A repository is not ready merely because governance files exist.
