# KPI And Dashboard Storytelling

## Contents

- Metric contract
- Dashboard layers
- Chart selection
- Context and annotation
- Drill-down
- Review checklist

## Metric Contract

For every displayed metric record:

```text
Name and business meaning:
Owner:
Formula and grain:
Unit and time zone:
Source and freshness:
Target or baseline:
Segmentation:
Known exclusions:
Action when abnormal:
```

## Dashboard Layers

- Outcome: whether users or the business achieved the intended result
- Driver: controllable input that influences the outcome
- Guardrail: quality, safety, cost, or fairness constraint
- Diagnostic: evidence explaining a change
- Operational: pipeline freshness and data reliability

Do not place every layer at equal visual priority.

## Chart Selection

| Question | Prefer |
|---|---|
| Change over time | line or area chart |
| Compare categories | sorted bars |
| Exact lookup | table |
| Distribution | histogram, box, or percentile bands |
| Composition | stacked bars when parts are few and comparable |
| Relationship | scatter plot with useful segmentation |
| Progress to target | value plus target and trend |

Avoid pie charts with many segments, gauges without meaningful ranges, and maps when geography is not the decision dimension.

## Context And Annotation

Show comparison period, target, confidence or sample size, deploys, campaigns, definition changes, outages, and data gaps. Use annotations for material events rather than narrating every fluctuation.

## Drill-Down

Preserve filters and time range when moving from overview to segment or record detail. Offer the next diagnostic dimension based on the likely decision, not an exhaustive list of filters.

## Review Checklist

- Can the audience identify the primary decision within seconds?
- Are metrics owned, fresh, and consistently defined?
- Are scales, units, time zones, and comparisons visible?
- Do extreme, missing, stale, and partial data states remain truthful?
- Can keyboard and assistive-technology users reach filters and details?
- Does the layout remain usable on the supported viewport?
