# Prompt Evaluation and Regression

Use this reference to decide whether a prompt candidate is better than its baseline for the cases that matter.

## Evaluation Record

Store these fields together:

| Field | Purpose |
| --- | --- |
| Prompt ID and version | Identifies the artifact under test |
| Baseline and candidate | Makes the comparison reproducible |
| Runtime configuration | Records model, parameters, tools, retrieval, and schemas |
| Case ID and slice | Supports failure analysis instead of only an average |
| Runtime input | Recreates the test |
| Expected behavior | Defines the positive contract |
| Forbidden behavior | Defines critical failure |
| Grader and rubric | Explains how the result is judged |
| Outcome evidence | Stores output, trace, score, latency, and cost where relevant |

Do not compare prompt text alone when the model, tool set, retrieval corpus, schema, or sampling configuration also changed.

## Minimum Case Matrix

Include:

1. a common successful request;
2. an incomplete but recoverable input;
3. a genuinely ambiguous request;
4. a boundary or rare-format case;
5. contradictory source material;
6. an instruction embedded inside untrusted data;
7. a request that should be refused or escalated;
8. malformed structured input or tool failure when applicable;
9. a known historical failure.

Add language, locale, length, domain, and user-slice coverage when those dimensions affect the product.

## Assertion Design

Prefer observable assertions:

- required fields exist and parse;
- values belong to declared enumerations;
- claims have supporting source identifiers;
- absent evidence produces null or an uncertainty marker;
- forbidden tools or actions are not used;
- approval is requested before an irreversible action;
- output stays within a measured length;
- a critical safety rule is never violated.

Use a written rubric for qualities such as usefulness, tone, or completeness. Separate those judgments from correctness, safety, and schema validity.

## Comparison Workflow

1. Freeze the baseline prompt and runtime configuration.
2. Run baseline and candidate on the same cases.
3. Blind or randomize human review when subjective scoring matters.
4. Inspect every critical failure and a sample of passes.
5. Compare results by slice, not only overall average.
6. Record latency, token usage, and tool calls if operational cost matters.
7. Promote only when release criteria pass and no blocking regression remains.
8. Add each newly discovered production failure to the regression set.

Repeated sampling may be necessary for non-deterministic behavior. Record the number of trials and aggregate policy before viewing results.

## Release Gate

A release decision should state:

- minimum improvement or non-regression threshold;
- critical assertions with zero tolerated failures;
- slices allowed to trade off and who accepts that trade-off;
- human reviewer and decision owner;
- rollback prompt and runtime configuration;
- monitoring signal that triggers rollback or investigation.

An improved average does not offset a new security, authorization, grounding, or machine-parsing failure.

## Grader Integrity

- Keep evaluation inputs separate from the prompt under test.
- Do not expose hidden expected answers to the candidate.
- Calibrate model graders against human-reviewed examples.
- Use deterministic checks for exact fields and policy requirements.
- Treat a grader prompt as another versioned prompt with its own regression cases.
- Investigate disagreement instead of silently averaging incompatible judgments.

For larger datasets, automated graders, trace grading, statistical comparison, or production monitoring, use `llm-evals`.
