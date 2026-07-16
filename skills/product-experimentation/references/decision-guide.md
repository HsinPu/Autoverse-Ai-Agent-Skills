# Product Experimentation Decision Guide

## Contents

1. Experiment brief
2. Metric contract
3. Assignment and sample policy
4. Instrumentation preflight
5. SRM and trustworthiness gate
6. Analysis risks
7. Decision and registry
8. Primary sources

## 1. Experiment Brief

Pre-register the decision surface before launch.

```text
Experiment ID and owner:
Decision and deadline:
Target population and eligibility:
Intervention and comparator:
Behavior mechanism:
Primary hypothesis and direction:
Primary metric and practical threshold:
Guardrails and safety stop conditions:
Assignment unit and analysis unit:
Allocation, MDE, power, alpha, duration, and stopping rule:
Planned segments and multiple-testing policy:
Ship / iterate / stop / retest rules:
```

Use a randomized experiment only when treatment can be assigned ethically, exposure can be observed, interference is manageable, and the result can change a decision. Otherwise choose an observational study, phased rollout, switchback, matched design, qualitative study, or operational verification and state the weaker causal authority.

## 2. Metric Contract

| Metric role | Purpose | Required definition |
|---|---|---|
| Primary | Resolves the main product hypothesis | Formula, eligibility, window, direction, practical threshold |
| Guardrail | Prevents unacceptable harm | Harm threshold, monitoring cadence, emergency owner |
| Diagnostic | Explains the mechanism or failure path | Expected relationship to treatment and primary metric |
| Data quality | Establishes whether analysis is trustworthy | SRM, join rate, telemetry loss, duplicates, missingness |

For every metric specify event version, numerator, denominator, unit, aggregation, attribution window, late-event policy, timezone, outliers, missing values, and source owner. Freeze the contract before exposure or version every post-launch change.

Do not combine many outcomes into an opaque score merely to obtain significance. If several primary outcomes are truly required, declare the family and correction or decision hierarchy.

## 3. Assignment and Sample Policy

Choose an assignment unit that keeps treatment stable for the user experience and limits spillover:

- use user or account assignment for persistent experiences across sessions;
- use tenant or organization assignment when members interact or share configuration;
- use session or request assignment only when carryover and inconsistent experiences are acceptable;
- consider geography, time, or switchback designs for marketplace, logistics, or network interference.

Analyze at a level compatible with assignment or use a variance method that accounts for clustering. Document identity loss, anonymous-to-authenticated transitions, cross-device assignment, bots, staff traffic, and mutually exclusive experiments.

Set sample and duration from baseline rate or variance, minimum meaningful effect, allocation, power, error tolerance, expected exposure, and business cycles. Define a maximum duration and inconclusive outcome. If repeated monitoring will affect success decisions, use a pre-specified sequential method; a fixed-horizon test does not gain a new stopping rule because results look favorable.

## 4. Instrumentation Preflight

Require evidence for:

- deterministic assignment and expected allocation;
- eligibility evaluated before assignment, with stable exclusion rules;
- separate assignment and exposure events with variant, experiment ID, unit ID, and timestamp;
- exactly-once or explicitly deduplicated exposure and outcome semantics;
- schema compatibility, clock handling, late events, joins, retries, and backfills;
- equal telemetry behavior across variants, including consent and blocked storage;
- A/A balance or retrospective baseline checks for critical metrics when feasible;
- dashboards and alerts for SRM, event loss, guardrail harm, and exposure anomalies;
- reproducible query or analysis version and a dry-run decision review.

Measurement code that treatment itself can break needs an independent data-quality signal.

## 5. SRM and Trustworthiness Gate

Sample ratio mismatch means observed allocation is inconsistent with the planned ratio beyond expected random variation. Treat it as a symptom, not a nuisance to dismiss.

Investigate, in order:

1. planned allocation, ramp history, eligibility filters, and overlapping experiments;
2. assignment persistence, hashing, variant lookup, and identity changes;
3. exposure logging, client or network loss, bot filtering, joins, and delayed events;
4. treatment-dependent crashes, consent, rendering, or telemetry changes;
5. analysis filters applied after assignment or differently by variant.

Record the test, expected and observed counts, time and segment localization, root cause, repair, rerun need, and owner. Do not interpret product effects while SRM or material asymmetric missingness remains unexplained.

## 6. Analysis Risks

- **Repeated looks:** follow the fixed horizon or declared sequential boundary; emergency guardrail monitoring is not a license to claim early success.
- **Multiple testing:** control the declared family or use a hierarchy; label post-hoc discoveries exploratory and replicate them.
- **Segments:** pre-specify decision-relevant segments and interactions. A significant result in one segment and not another does not by itself prove the segments differ.
- **Novelty and primacy:** inspect treatment effects over time and run long enough to cover expected learning or fatigue when the decision depends on persistence.
- **Practical significance:** report absolute and relative effects, confidence intervals, baseline, and the minimum worthwhile effect.
- **Non-significance:** distinguish underpowered, inconclusive, harmful, and evidence-of-equivalence outcomes.
- **Telemetry loss:** compare missingness and signal integrity by variant; asymmetric loss can bias the result.
- **Interference and carryover:** state whether one unit can affect another or retain treatment effects after reassignment.
- **External validity:** limit the decision to the tested population, context, duration, and implementation unless further evidence supports generalization.

## 7. Decision and Registry

Use a written rule:

- **Ship:** trustworthiness gates pass, the primary outcome meets the practical decision threshold with adequate uncertainty, and no guardrail crosses its limit.
- **Iterate:** mechanism evidence suggests a bounded improvement, but the current variant does not meet the ship rule.
- **Stop:** credible harm, guardrail breach, no viable value at the defined threshold, or implementation risk outweighs expected benefit.
- **Retest:** instrumentation failure, unresolved SRM, major protocol deviation, or a materially new confirmatory hypothesis requires a clean run.

Do not force every experiment into a win. An inconclusive result is a valid registry outcome.

Store:

```text
experiment_id | title | owner | status | dates | population
hypothesis_version | metric_contract_version | variants | allocation
assignment_unit | analysis_unit | sample_policy | stopping_policy
instrumentation_version | SRM_result | protocol_deviations
primary_effect | uncertainty | guardrail_results | segment_status
decision | rationale | rollout_or_followup | analysis_artifact | approver
```

## 8. Primary Sources

This guide is an original operational synthesis informed by Microsoft Experimentation Platform research and practitioner guidance:

- [Patterns of Trustworthy Experimentation: Pre-Experiment Stage](https://www.microsoft.com/en-us/research/group/experimentation-platform-exp/articles/patterns-of-trustworthy-experimentation-pre-experiment-stage)
- [Patterns of Trustworthy Experimentation: During-Experiment Stage](https://www.microsoft.com/en-us/research/group/experimentation-platform-exp/articles/patterns-of-trustworthy-experimentation-during-experiment-stage/)
- [Patterns of Trustworthy Experimentation: Post-Experiment Stage](https://www.microsoft.com/en-us/research/articles/patterns-of-trustworthy-experimentation-post-experiment-stage/)
- [Diagnosing Sample Ratio Mismatch in Online Controlled Experiments](https://www.microsoft.com/en-us/research/publication/diagnosing-sample-ratio-mismatch-in-online-controlled-experiments-a-taxonomy-and-rules-of-thumb-for-practitioners/)
- [Trustworthy Experimentation Under Telemetry Loss](https://www.microsoft.com/en-us/research/publication/trustworthy-experimentation-under-telemetry-loss/)
- [A Dirty Dozen: Metric Interpretation Pitfalls](https://www.microsoft.com/en-us/research/publication/a-dirty-dozen-twelve-common-metric-interpretation-pitfalls-in-online-controlled-experiments/)
- [Three Key Checklists and Remedies for Trustworthy Analysis](https://www.microsoft.com/en-us/research/?p=670776)
