---
name: incident-response-postmortems
description: Coordinate production incidents from severity assessment and stabilization through command roles, evidence preservation, communications, recovery validation, on-call handoff, blameless postmortems, and corrective-action closure. Use during active reliability or security incidents, operational handoffs, recovery decisions, and structured post-incident learning.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Incident Response And Postmortems

## Active Incident Workflow

1. Declare severity, affected journeys, start time, scope, and decision authority.
2. Assign incident commander, operations lead, communications owner, and scribe when incident size warrants them.
3. Preserve logs, traces, configuration, deploy markers, and volatile evidence before broad changes.
4. Stabilize through the smallest reversible mitigation with success and abort thresholds.
5. Maintain a timestamped fact, hypothesis, decision, and action log.
6. Validate recovery across user behavior, data integrity, security, capacity, and monitoring.
7. Define monitoring duration and handoff ownership before closing the active response.

## Postmortem Workflow

1. Reconstruct the causal timeline from authoritative evidence.
2. Separate trigger, root cause, propagation, contributing conditions, and detection gaps.
3. Identify why existing prevention, detection, response, and recovery controls behaved as they did.
4. Create corrective actions with owners, deadlines, verification, and closure evidence.
5. Review recurring systemic patterns and update runbooks, tests, alerts, and architecture decisions.

## Rules

- Stabilize before optimizing the diagnosis.
- Keep facts, hypotheses, decisions, and actions visibly separate.
- Avoid blame and vague actions such as "be more careful."
- Do not declare recovery from one green metric or a temporary traffic drop.
- Protect sensitive incident and customer data.

## References

- Read [references/live-response-and-handoff.md](references/live-response-and-handoff.md) for severity guidance, role responsibilities, communication templates, handoff fields, recovery gates, and action-item closure.

## Handoff

- Use `observability-engineering` for missing signals and alert design.
- Use `deployment-operations` for rollback and release recovery.
- Use `security-scanning` or `security-code-review` for security investigation follow-up.
