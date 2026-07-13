# Live Incident Response And Handoff

## Contents

- Severity
- Roles
- Timeline fields
- Communications
- Recovery gates
- Handoff
- Corrective actions

## Severity

Base severity on current or credible imminent user, data, security, financial, legal, and operational impact. Record why the severity was chosen and change it when evidence changes.

## Roles

- Incident commander: priorities, decisions, authority, and coordination
- Operations lead: diagnostics, mitigation, rollback, and recovery execution
- Communications owner: internal and external updates
- Scribe: timeline, facts, hypotheses, decisions, and actions
- Subject specialist: bounded investigation or system ownership

One person may hold several roles for a small incident, but decision ownership must remain explicit.

## Timeline Fields

```text
UTC timestamp:
Type: fact | hypothesis | decision | action | result
Actor:
Evidence or command:
Affected scope:
Next check:
```

## Communications

Include known impact, start or detection time, current mitigation, remaining uncertainty, customer action if any, and next update time. Do not publish speculative root cause, sensitive indicators, or unverified recovery.

## Recovery Gates

Validate:

- critical user journey
- error and latency baseline
- data integrity and reconciliation
- security and access state
- dependency and queue recovery
- capacity and saturation
- alert and telemetry health
- rollback or contingency readiness

## Handoff

```text
Incident and severity:
Current impact:
Timeline and latest evidence:
Mitigations in effect:
Unresolved hypotheses:
Monitoring and thresholds:
Pending actions and owners:
Decision authority and contacts:
Next update time:
```

## Corrective Actions

Write actions as a change plus a verifiable outcome. Assign an owner and deadline. Classify prevention, detection, response, recovery, or learning. Close only after evidence shows the control works.
