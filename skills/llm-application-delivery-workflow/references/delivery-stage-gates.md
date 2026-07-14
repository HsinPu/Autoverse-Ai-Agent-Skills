# LLM Application Delivery Stage Gates

Apply only the gates relevant to the feature, but record why any gate is skipped.

| Gate | Required artifact | Exit evidence |
|---|---|---|
| 1. Outcome | Outcome contract | Target users, task, acceptance criteria, unacceptable outcomes, authority, latency, cost, and data sensitivity are explicit |
| 2. Architecture | Architecture decision record | The smallest viable direct API, retrieval, agent, tool, memory, and persistence design is justified against alternatives |
| 3. Contracts | Interface and data contract | Inputs, outputs, errors, tools, APIs, storage, retention, permissions, and compatibility rules are reviewable |
| 4. Safety | Threat and control record | Abuse paths, prompt injection, sensitive data, excessive agency, side effects, approvals, and residual risk have owners |
| 5. Evaluation | Versioned eval plan and baseline | Representative data, graders, critical cases, release thresholds, latency, and cost have current results |
| 6. Implementation | Verified implementation record | Component checks, contract tests, migration evidence, and independent review apply to one identified revision |
| 7. Operations | Operational readiness record | Traces, logs, metrics, budgets, dashboards, alerts, runbooks, and responsible responders are available |
| 8. Release | Rollout and recovery plan | Target environment, feature controls, smoke checks, staged rollout, rollback or disablement, and decision owners are explicit |
| 9. Learning | Post-release evidence record | Real outcomes, failures, quality drift, latency, cost, feedback, and follow-up actions are compared with the outcome contract |

## Outcome Contract

Record:

- who performs which task and why model assistance is needed;
- what correct, incorrect, refused, escalated, and partial outcomes look like;
- which actions require deterministic application checks or human approval;
- latency, availability, quality, and cost limits;
- sensitive data classes, retention, residency, and access boundaries.

## Gate Decision

For every applicable gate, record:

- status: `pass`, `fail`, `blocked`, or `accepted-risk`;
- artifact path or stable identifier;
- repository revision, model or prompt version, dataset version, and environment;
- evidence summary and command, dashboard, trace, or review source;
- owner and review date;
- residual risk and revalidation trigger.

## Re-entry Rules

- Return to the outcome gate when user needs or acceptance criteria change.
- Return to architecture or contracts when tools, retrieval, persistence, APIs, or model responsibilities change.
- Return to safety and evaluation when a new capability, data source, side effect, or failure class appears.
- Return to implementation and operations after a model, prompt, dependency, schema, or runtime change that can affect behavior.
- Freeze rollout when current evidence no longer represents the release candidate.

## Release Stop Conditions

Stop the release when a critical eval fails, a high-risk action lacks authorization, sensitive data handling is unverified, migration recovery is unclear, required telemetry is absent, rollback cannot be exercised, or no owner can accept the remaining risk.
