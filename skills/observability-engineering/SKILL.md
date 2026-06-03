---
name: observability-engineering
description: Production observability workflow for metrics, logs, traces, dashboards, alerts, SLI/SLO design, OpenTelemetry, Prometheus, Grafana, and incident-ready monitoring. Use when designing or improving system visibility, diagnosing reliability gaps, or setting up operational dashboards and alerts.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Observability Engineering

Use this skill when a system needs production-grade visibility.

## Workflow

1. Identify the service, user journeys, failure modes, dependencies, and operational owners.
2. Define signals: metrics, logs, traces, events, health checks, and business indicators.
3. Choose SLIs, SLOs, alert thresholds, dashboards, and runbooks tied to real user impact.
4. Instrument with consistent names, low-cardinality labels, trace context, and structured logs.
5. Validate alerts and dashboards during deploys, incidents, and controlled failure tests.

## Rules

- Alert on user-impacting symptoms before low-level causes.
- Keep dashboards action-oriented; avoid vanity panels that do not support decisions.
- Control metric cardinality and log volume before costs become operational noise.
- Correlate logs, metrics, and traces with stable request, user, tenant, or job identifiers.
- Treat observability as part of release readiness, not as a post-incident add-on.

## Handoff

- For application log message design, use `logging-patterns`.
- For deploy verification, use `deployment-operations`.
- For incident timeline and follow-up, use `incident-response-postmortems`.
