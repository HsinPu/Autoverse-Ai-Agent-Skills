---
name: autoresearch
description: Bounded autonomous experimentation workflow for improving a measurable repository outcome through baseline-controlled hypothesis, change, measurement, and keep-or-revert cycles. Use when code, configuration, prompts, or performance can be optimized with repeatable local experiments, a scalar metric, and explicit constraints; do not use for open-ended web research, feature discovery, or irreversible production trials.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
reference-source: github/awesome-copilot
reference-license: MIT
---

# Autoresearch

Run a bounded sequence of measurable experiments and preserve only improvements that survive the defined checks.

## Preconditions

- Define one primary metric, its direction, measurement command, and minimum meaningful improvement.
- Define guardrail metrics, correctness checks, allowed files, time or iteration budget, and prohibited actions.
- Confirm that the experiment is reproducible in an isolated branch or worktree and does not require unauthorized external mutation.
- Stop before editing when no trustworthy baseline or automated measurement exists.

## Experiment Loop

1. Run the measurement several times when variance is plausible. Record the baseline distribution and environment facts.
2. State one falsifiable hypothesis and predict its effect on the primary and guardrail metrics.
3. Make the smallest change that tests that hypothesis. Avoid unrelated cleanup and do not combine independent variables.
4. Run the fixed measurement protocol and required correctness checks.
5. Compare the result with the baseline using the predeclared decision rule.
6. Keep and checkpoint the change only when the improvement is meaningful, repeatable, and within every guardrail. Otherwise revert only that experiment.
7. Record the hypothesis, diff identity, measurements, verdict, and observation before selecting the next experiment.
8. Stop at the budget, on convergence, after repeated invalid measurements, or when the next experiment requires broader authority.
9. Produce a final report that separates retained improvements, rejected hypotheses, measurement limits, and recommended follow-up work.

Read [references/experiment-protocol.md](references/experiment-protocol.md) before starting a multi-iteration run.

## Guardrails

- Preserve correctness and safety checks; never optimize the metric by weakening the measurement or test.
- Pin relevant dependencies, inputs, seeds, datasets, runtime settings, and hardware facts where possible.
- Treat noisy or conflicting measurements as inconclusive rather than improvements.
- Do not run load, cost, messaging, deployment, or production experiments without explicit authorization and limits.
- Do not generalize one successful experiment into a durable rule without representative validation.

## Handoff

- Use `git-advanced` to create an isolated worktree or recover an experiment branch.
- Use `terminal-ops` to run and preserve exact measurement evidence.
- Use `testing-strategy` to choose correctness checks and control confounding behavior.
- Use `llm-evals` when the primary outcome measures prompts, models, retrieval, or agent behavior.
- Use `incremental-implementation` to integrate retained experiments into a maintainable production change.
- Use `self-improvement` only after a lesson is supported well enough to reuse beyond this run.
