---
name: incident-response-postmortems
description: Incident response and postmortem workflow for triaging live issues, reconstructing timelines, capturing root cause, and tracking corrective actions. Use when a production incident or major failure needs structured follow-up and learning.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Incident Response & Postmortems

Use this skill when a live failure needs structured handling and follow-up.

## Workflow

1. Triage severity, blast radius, and immediate user impact.
2. Stabilize first: mitigate, rollback, or disable the failing path.
3. Reconstruct the timeline from logs, alerts, deploys, and user reports.
4. Identify root cause, contributing factors, and missed signals.
5. Capture corrective actions with owners and deadlines.

## Rules

- Focus on facts, not blame.
- Separate symptoms, cause, and remediation.
- Preserve evidence before changing too much.
- Track follow-ups until they are closed.

## Handoff

- For deployment-side verification, use `deployment-operations`.
- For exact command output and repo state, use `terminal-ops`.
- For log formatting and signal quality, use `logging-patterns`.
