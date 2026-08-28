---
name: dashboard-design
description: Visible dashboard UI changes require frontend-design plus this dashboard specialist. Use for planning, building, modifying, or reviewing KPI hierarchy, comparisons, freshness, visual encoding, drill-down, anomaly context, states, and responsive layout.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Dashboard Design

For visible dashboard implementation or modification, read frontend-design before planning. Use this Skill for dashboard decision structure and visual encoding; use it alone for direction or review that does not change production UI.

## Workflow

1. Define audience, decisions, review cadence, time horizon, and actions the dashboard must enable.
2. Select a small metric hierarchy with owners, definitions, units, freshness, targets, and comparison baselines.
3. Separate outcome, driver, guardrail, diagnostic, and operational health metrics.
4. Choose visual encodings based on comparison, trend, composition, distribution, relationship, or exact lookup.
5. Design overview, filters, drill-down, annotations, empty, stale, loading, partial, and error states.
6. Validate scan order, accessibility, responsive behavior, misleading scales, and representative data extremes.

## Rules

- Do not display a metric without a decision, owner, definition, and data-freshness expectation.
- Prefer comparison and context over isolated large numbers.
- Avoid dual axes, truncated scales, decorative charts, and unexplained composite scores.
- Distinguish targets from forecasts and leading indicators from lagging outcomes.
- Show uncertainty, missing data, delayed ingestion, and material definition changes.

## References

- Read [references/kpi-and-storytelling.md](references/kpi-and-storytelling.md) for metric selection, dashboard layers, chart choice, annotation, drill-down, and data-storytelling patterns.

## Handoff

- Use `frontend-design` for implementation.
- Use `responsive-design` for layout adaptation.
- Use `observability-engineering` for production SLI and SLO dashboards.
- Use `spreadsheet-ops` when the deliverable is a workbook.
