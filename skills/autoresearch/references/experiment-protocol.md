# Experiment Protocol

Complete the protocol before allowing an autonomous iteration loop.

## Experiment Contract

- Objective:
- Primary metric and direction:
- Measurement command or procedure:
- Minimum meaningful improvement:
- Guardrail metrics and thresholds:
- Correctness checks:
- Allowed files and systems:
- Forbidden actions:
- Iteration, time, compute, and cost budget:
- Stop and escalation conditions:

## Baseline Control

Record enough state to reproduce the baseline:

- repository revision and dirty state;
- dependency and tool versions;
- datasets, fixtures, seeds, and prompt versions;
- environment variables that affect behavior, with secrets redacted;
- operating system, runtime, and relevant hardware;
- warm-up behavior, sample count, and aggregation method;
- raw measurements, variance, and known instability.

Do not begin when the metric cannot distinguish a real improvement from normal variation.

## Iteration Record

| Field | Required value |
|---|---|
| Experiment ID | Stable sequential identifier |
| Parent baseline | Commit or checkpoint being compared |
| Hypothesis | One falsifiable explanation |
| Predicted result | Expected metric and guardrail effect |
| Change | Narrow diff or configuration change |
| Measurements | Raw values plus aggregation |
| Correctness | Exact checks and outcomes |
| Verdict | Keep, revert, inconclusive, or blocked |
| Observation | What the result teaches without overgeneralizing |

## Decision Rules

- **Keep** only when the primary improvement clears the threshold, repeats under the fixed protocol, and every guardrail passes.
- **Revert** when the metric worsens, a guardrail fails, correctness regresses, or the hypothesis is rejected.
- **Inconclusive** when noise, environment drift, or measurement failure prevents comparison. Fix the protocol before retrying.
- **Block** when the next useful test needs new authority, production traffic, additional cost, or a changed experiment contract.

## Final Report

Report the original baseline, final retained baseline, cumulative improvement, retained changes, rejected hypotheses, unresolved measurement risks, consumed budget, and next recommended experiment. Preserve the complete iteration ledger so another reviewer can reproduce the decision trail.
