# Trace Review Template

Use this template for one failure mode. Split unrelated failures into separate reviews.

## Run Identity

- Run or trace ID:
- Timestamp and environment:
- Application revision:
- Model and settings:
- Instruction or prompt version:
- Tool and retrieval versions:
- Reviewer:

## Outcome Contract

- User-visible goal:
- Required actions or artifacts:
- Forbidden actions:
- Success signal:
- Expected refusal, approval, escalation, or stop behavior:

## Observed Failure

- Minimal reproduction:
- Expected result:
- Actual result:
- Frequency or nondeterminism:
- User or system impact:

## Execution Timeline

| Sequence | Event ID | Layer | Input or visible state | Decision or output | Evidence note |
|---:|---|---|---|---|---|
| 1 | | | | | |

Include model calls, context assembly, retrieval, tool calls and responses, handoffs, guardrails, retries, and termination.

## Earliest Divergence

- Event ID:
- Expected behavior at that event:
- Observed behavior:
- Available information and authority:
- Primary taxonomy category:
- Contributing categories:

## Hypothesis Matrix

| Hypothesis | Supporting evidence | Disconfirming evidence | Discriminating check | Result | Confidence |
|---|---|---|---|---|---|
| | | | | | |

## Intervention And Verification

- Confirmed root cause:
- Owning layer:
- Smallest proposed change:
- Original-case result after change:
- Regression dataset row or test:
- Adjacent cases checked:
- Remaining risks and evidence gaps:
