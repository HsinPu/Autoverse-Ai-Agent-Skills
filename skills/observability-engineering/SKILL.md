---
name: observability-engineering
description: Engineer production observability with service objectives, OpenTelemetry, metrics, logs, traces, Prometheus, Grafana, dashboards, burn-rate alerts, cardinality budgets, and failure validation. Use when instrumenting services, defining SLIs or SLOs, creating operational dashboards and alerts, diagnosing visibility gaps, or controlling telemetry reliability and cost.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Observability Engineering

## Workflow

1. Define critical user journeys, owners, dependencies, failure modes, and decisions telemetry must support.
2. Select service-level indicators for availability, latency, correctness, freshness, throughput, and saturation.
3. Set objectives and error budgets from user expectations and operational capability.
4. Instrument stable metrics, structured events, trace propagation, and exemplars with bounded cardinality.
5. Build task-oriented dashboards and multi-window burn-rate alerts with runbook ownership.
6. Validate signals during normal traffic, dependency failure, overload, partial degradation, deploy, and recovery.
7. Review sampling, retention, volume, label growth, privacy, and telemetry cost.

## Signal Rules

- Alert on actionable user impact or rapidly consumed error budget, not raw event volume alone.
- Keep identifiers out of metric labels; put high-cardinality context in traces or structured logs.
- Propagate trace and correlation context across HTTP, messaging, jobs, and retries.
- Record telemetry schema and unit conventions as public operational contracts.
- Include missing-data and telemetry-pipeline failure behavior.

## References

- Read [references/prometheus-grafana-slo.md](references/prometheus-grafana-slo.md) for PromQL patterns, dashboard layout, OpenTelemetry sampling, SLO calculations, burn-rate alerts, and failure drills.

## Handoff

- Use `logging-patterns` for log event design.
- Use `agent-introspection-debugging` when agent traces require causal reconstruction rather than general telemetry design.
- Use `llm-application-delivery-workflow` when telemetry must satisfy an LLM release or rollback gate.
- Use `deployment-operations` for release verification.
- Use `incident-response-postmortems` for incident coordination and learning.
- Use `dashboard-design` for product or executive dashboard information design.
