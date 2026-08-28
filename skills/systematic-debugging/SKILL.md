---
name: systematic-debugging
description: Evidence-first debugging workflow for reproducing failures, tracing root causes, testing competing hypotheses, and defining the smallest justified fix before editing. Use when a test, build, runtime behavior, integration, or intermittent failure has an unknown or disputed cause; do not use for straightforward implementation with an already-known owner and cause.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
  reference-source: "obra/superpowers"
  reference-license: "MIT"
  reference-revision: "d884ae04edebef577e82ff7c4e143debd0bbec99"
---

# Systematic Debugging

Establish the causal failure before changing production behavior.

## Workflow

1. Capture the exact symptom, expected behavior, environment, revision, inputs, timing, and available logs.
2. Reproduce the failure with the smallest reliable command, test, request, or interaction. Record any condition that prevents reproduction.
3. Trace the failing path across inputs, state changes, boundaries, side effects, and outputs. Compare it with the nearest working path.
4. List a small set of ranked, falsifiable hypotheses. Tie each hypothesis to observed evidence.
5. Run one discriminating experiment at a time. Change only the variable needed to confirm or reject that hypothesis.
6. Confirm the root cause by showing the complete causal chain and predicting behavior under a changed condition.
7. Define the smallest fix, the regression test, and the risks that still require verification.

## Evidence Standard

- Preserve the original failure before testing a fix.
- Distinguish symptoms, contributing conditions, and the root cause.
- Prefer direct observations over intuition, similar past incidents, or plausible stories.
- Record rejected hypotheses so the investigation does not repeat them without new evidence.
- State the verification gap when the failure cannot be reproduced or required evidence is unavailable.

## Boundaries

- Do not make several speculative fixes at once.
- Do not weaken or delete a failing test merely to make the signal disappear.
- Do not call a correlation the root cause without a mechanism that explains the failure.
- Do not expand into incident command, external remediation, or production mutation without authorization.

## Handoff

- Use `terminal-ops` to run commands and preserve exact repository evidence.
- Use `agent-introspection-debugging` when the failing system is an agent run and model, tool, handoff, guardrail, retrieval, or context traces must be reconstructed.
- Use `python-observability-debugging` for Python tracebacks, runtime diagnostics, profiling, memory, and performance techniques; after confirming the cause, use `python-development` for the implementation fix.
- Use `typescript-development` for TypeScript compiler, inference, narrowing, module-resolution, declaration, or typed public-API failures; retain this evidence-first workflow until the cause is proven, then add the relevant framework or testing skill only when that surface is involved.
- Use the relevant stack-specific debugging skill for other framework or runtime techniques.
- Use `code-change-workflow` after the owner path and justified fix are known.
- Use `test-driven-development` to add the regression test and implement the fix in a red-green cycle.
- Use `verification-before-completion` after remediation to prove the original failure and adjacent checks now pass.
- Use `incident-response-postmortems` when an active production incident requires coordination, recovery, or communications.
