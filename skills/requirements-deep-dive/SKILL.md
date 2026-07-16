---
name: requirements-deep-dive
description: Run a deliberate one-decision-at-a-time requirements interview that challenges assumptions, exposes contradictions, recommends concrete defaults, records decisions, and can ground questions in repository evidence. Use when the user explicitly asks for a deep interview, wants requirements challenged before implementation, or an approved discovery workflow pauses for consequential choices that available code and documents cannot answer.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/Autoverse-Ai-Agent-Skills"
  reference-source: "mattpocock/skills"
  reference-license: "MIT"
  reference-revision: "e9fcdf95b402d360f90f1db8d776d5dd450f9234"
---

# Requirements Deep Dive

Resolve consequential choices through a focused interview without asking the user for facts the agent can discover independently.

## Entry Contract

Before interviewing, confirm:

- the outcome being shaped;
- whether the user wants a broad challenge or only named areas;
- the artifact to update or return;
- whether repository, document, or web evidence may be inspected;
- the condition that ends the interview and permits the next phase.

Do not invoke this Skill merely because one small implementation detail is missing. Use `ask-questions-if-underspecified` for the minimum blocking question.

## Modes

### Decision Interview

Use when choices depend mainly on user goals, business rules, risk tolerance, scope, or preferences.

### Repository-Grounded Interview

Use when an existing repository or document set can answer factual questions and reveal hidden constraints.

1. Read local instructions, status, specifications, architecture notes, configuration, owner code paths, tests, and relevant history.
2. Separate confirmed repository facts from interpretations and stale documentation.
3. Ask only the questions whose answers still require an authorized decision.
4. Attach concise evidence paths or observations to the question when they change the tradeoff.

## Interview Loop

1. Maintain a decision queue ordered by impact and dependency.
2. Take one decision at a time.
3. State why it matters, the recommended default, realistic alternatives, and the consequence of deferring it.
4. Ask one answerable question and wait for the response.
5. Challenge vague answers with an example, counterexample, edge case, or conflict with earlier decisions.
6. Record the decision, owner, rationale, confidence, affected requirements, and any follow-up evidence needed.
7. Reorder or remove later questions when the answer resolves them.
8. Stop when exit criteria are met or a blocker requires a different owner, authority, or source.

## Question Quality

A useful question:

- represents a real choice rather than a discoverable fact;
- changes scope, behavior, architecture, risk, acceptance, or priority;
- offers a recommended default instead of outsourcing all reasoning;
- presents distinct alternatives, not cosmetic wording variants;
- can be answered without unpacking several unrelated decisions at once.

Avoid long questionnaires, repeated confirmation, and speculative questions whose answers will not affect the result.

## Decision Record

Capture:

```text
Decision:
Status: proposed | accepted | deferred | blocked
Recommended default:
Alternatives considered:
Rationale and evidence:
Consequences:
Owner:
Affected requirements or model terms:
Follow-up:
```

## Exit Criteria

End the interview when the choices inside the agreed interview boundary are clear enough for the agreed next artifact. For a broad interview, this may include goal, scope, non-goals, users, critical behavior, constraints, authority boundaries, risk posture, acceptance evidence, and unresolved owners. For a narrow interview, do not expand into unrelated requirement areas merely to fill a checklist. Do not begin implementation solely because the conversation has become long.

## Output

Return one consolidated decision record containing accepted, deferred, and blocked decisions; repository evidence used; contradictions resolved or still open; the remaining decision owner; and the exact next artifact or stop condition. Do not make the user reconstruct the result from individual question-and-answer turns.

## Handoff

- Use `domain-modeling` when decisions define terminology, invariants, ownership, or lifecycle.
- Use `solution-discovery` when materially different solution directions still need comparison.
- Use `spec-flow` when decisions are approved and ready for acceptance criteria and work-item decomposition.
- Use `session-handoff` when the interview pauses before the decision queue is resolved.
