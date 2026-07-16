---
name: product-experimentation
description: Design, instrument, analyze, and register trustworthy product experiments with predeclared hypotheses, primary and guardrail metrics, randomization units, sample and stopping policies, SRM checks, and ship-or-stop decisions. Use for A/B tests, holdouts, feature experiments, experiment telemetry QA, or interpreting experiment results without peeking, p-hacking, or unsupported causal claims.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/Autoverse-Ai-Agent-Skills"
---

# Product Experimentation

Use this skill to turn a product uncertainty into a trustworthy controlled experiment and an explicit decision.

## Decision Boundary

- Assign the product owner responsibility for the hypothesis, decision rule, risk tolerance, and `ship`, `iterate`, `stop`, or `retest` call.
- Assign the measurement owner responsibility for metric definitions, assignment and exposure telemetry, instrumentation QA, SRM checks, and reproducible analysis evidence.
- Do not let instrumentation ownership imply authority to choose the product outcome.

## Workflow

1. **Frame the decision and hypothesis.** State the target population, intervention, comparator, expected behavior mechanism, primary outcome, decision deadline, non-goals, and what each plausible result would cause the team to do.
2. **Predeclare metrics.** Choose a primary metric tied to the decision, guardrails that must not degrade, and diagnostic and data-quality metrics. Define numerator, denominator, eligibility, window, attribution, direction, practical threshold, and missing-data behavior before launch.
3. **Choose assignment and analysis units.** Select user, account, tenant, session, device, geography, or another unit based on intervention persistence and interference risk. Document identity stability, cross-device behavior, spillover, clustering, and whether analysis matches assignment.
4. **Set the sample and stopping policy.** Predeclare minimum detectable effect, error rates, power, allocation, exposure target, minimum duration, full business cycles, exclusion rules, and maximum duration. Use a valid sequential design or correction for repeated looks; never stop merely because an ordinary p-value first crosses a threshold.
5. **Verify implementation.** Test deterministic assignment, mutual exclusion, exposure logging, event schemas, deduplication, timestamps, eligibility, joins, bot and employee rules, consent behavior, telemetry loss, and treatment-control parity. Run A/A or staged validation when risk warrants it.
6. **Launch and monitor safely.** Ramp by a stated policy. Monitor data-quality and safety guardrails for predeclared emergency-stop conditions without converting operational monitoring into opportunistic success testing.
7. **Gate analysis on trustworthiness.** Check sample ratio mismatch, assignment and exposure balance, missingness, telemetry changes, contamination, and analysis-unit assumptions before interpreting outcomes. An unresolved SRM blocks the product conclusion.
8. **Analyze and challenge.** Report effect sizes and uncertainty for primary and guardrail metrics. Apply the declared multiple-testing policy, label unplanned segments exploratory, inspect time trends and novelty, and distinguish statistical evidence from practical value.
9. **Decide and register.** Make the predeclared `ship`, `iterate`, `stop`, or `retest` decision; document deviations, residual risks, rollout and rollback checks, and the durable experiment record.

## Integrity Rules

- Do not change the primary metric, population, exclusions, direction, hypothesis, or stopping rule after seeing results without labeling a new exploratory analysis or follow-up experiment.
- Do not search segments, metrics, windows, or variants until one becomes significant and then present it as confirmatory.
- Do not treat “not significant” as proof of equivalence or “significant” as proof of meaningful value.
- Do not average away guardrail harm or ship from a favorable metric when SRM, telemetry loss, or assignment contamination is unresolved.
- Separate novelty, primacy, seasonality, network effects, carryover, and external events from the intended treatment mechanism.

## Deliverable

Return:

1. experiment brief, decision rule, ownership, hypothesis, population, and risks;
2. metric contract, assignment design, sample and stopping policy;
3. instrumentation and preflight evidence, including SRM status;
4. effect estimates, uncertainty, guardrails, segments, time behavior, and limitations;
5. decision, rollout or next-test plan, and experiment-registry entry.

Use [references/decision-guide.md](references/decision-guide.md) for design choices, preflight checks, SRM diagnosis, analysis risks, decision rules, and registry fields.

## Handoff

- Use `ux-research` when the uncertainty is about needs, behavior, comprehension, or why a workflow fails.
- Use `marketing-measurement-specialist` or the repository's analytics owner to implement and verify telemetry; return evidence to the product decision owner.
- Use `llm-evals` instead when the unit under test is model or agent quality and randomized user impact is not the decision surface.
