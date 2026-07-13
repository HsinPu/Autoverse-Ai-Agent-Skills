# Prometheus, Grafana, Tracing, And SLOs

## Contents

- Metric and label design
- PromQL patterns
- Dashboard layers
- SLO and burn-rate alerts
- Trace sampling
- Failure validation

## Metric And Label Design

- Use base units such as seconds and bytes.
- Name counters with `_total` and expose histograms for latency distributions.
- Bound labels to known dimensions such as method, route template, status class, region, or worker type.
- Never place user IDs, request IDs, raw URLs, error messages, or unbounded tenant names in metric labels.

## PromQL Patterns

```promql
sum(rate(http_requests_total{status=~"5.."}[5m]))
/
sum(rate(http_requests_total[5m]))
```

```promql
histogram_quantile(
  0.95,
  sum by (le, route) (rate(http_request_duration_seconds_bucket[5m]))
)
```

```promql
sum by (service) (rate(process_cpu_seconds_total[5m]))
```

Confirm absent-series and zero-traffic behavior before alerting on ratios.

## Dashboard Layers

1. User outcome: availability, latency, correctness, freshness.
2. Service health: traffic, errors, duration, saturation.
3. Dependencies: database, queue, cache, external API, downstream services.
4. Release and context: deploy markers, configuration, region, version.
5. Diagnostics: resource, worker, instance, or shard drill-down.

Every panel should answer a named operational question and link to the next diagnostic view or runbook.

## SLO And Burn Rate

Define:

- eligible events
- good events or threshold
- objective and rolling window
- exclusions
- data source and owner

Use multi-window, multi-burn-rate alerts so fast severe failures and slow sustained degradation both trigger appropriately. Page only when action is urgent; create tickets for slower budget consumption.

## Trace Sampling

- Use head sampling for predictable cost.
- Use tail sampling to retain errors, high latency, rare routes, or selected tenants.
- Preserve parent sampling decisions across services.
- Record sampling policy and account for it during incident analysis.

## Failure Validation

Test dependency timeout, retry storm, queue backlog, resource saturation, partial region loss, telemetry exporter loss, and recovery. Confirm that the dashboard shows the user symptom, the alert routes correctly, and the runbook leads to a discriminating check.
