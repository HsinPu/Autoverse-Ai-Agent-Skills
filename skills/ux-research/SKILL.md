---
name: ux-research
description: Plan and synthesize ethical user interviews, contextual inquiry, usability studies, diary studies, surveys, and existing-evidence reviews with traceable findings. Use when a product or design decision needs real user evidence, participant recruitment and consent safeguards, a neutral research protocol, evidence-backed severity and confidence, or recommendations that must remain linked to observations.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/Autoverse-Ai-Agent-Skills"
---

# UX Research

Use this skill to reduce a stated product or design uncertainty with ethical, decision-relevant user evidence.

## Evidence Boundary

- Treat existing records, planned sessions, completed sessions, observations, interpretations, hypotheses, and recommendations as different states.
- Never invent participants, sessions, quotes, behaviors, demographics, counts, or consensus.
- Never label personas, stakeholder opinions, model simulations, or synthetic users as research findings.
- If no primary research has occurred, produce a research plan or hypothesis register rather than findings.

## Workflow

1. **Frame the decision.** Name the decision owner, decision deadline, affected users, current evidence, assumptions, research questions, and what evidence could change the decision.
2. **Select the method.** Review existing evidence first, then choose the smallest method that can answer the question. Explain why interviews, contextual inquiry, usability testing, diary study, survey, or another method fits; do not use a survey to explain behavior or a few interviews to estimate prevalence.
3. **Plan participants and safeguards.** Define behavior-based inclusion and exclusion criteria, a neutral screener, relevant variation, access needs, recruitment channels, compensation, consent, withdrawal, recording, data minimization, access, retention, and deletion.
4. **Prepare the protocol.** Write a neutral interview guide or realistic task scenarios, probes, moderator boundaries, note-taking roles, observation rules, and a pilot check. Avoid leading language, solution selling, and tasks that reveal the intended path.
5. **Build the evidence repository.** Give each session and evidence item a stable ID. Record the source, context, task, observable behavior or exact authorized statement, timestamp, and researcher notes while keeping interpretation separate.
6. **Synthesize with counterevidence.** Cluster related evidence, search for disconfirming cases, identify affected segments, and write findings that cite evidence IDs. Rate usability severity and evidence confidence separately; sample frequency alone does not establish importance or population prevalence.
7. **Trace recommendations.** Link each recommendation to findings, evidence, the decision it informs, expected trade-offs, unresolved questions, and the next validation method.

## Quality Gates

- Stop before recruitment if the decision, population, consent owner, or sensitive-data handling is unresolved.
- Stop before recording if informed consent or storage and retention controls are missing.
- Mark a proposed conclusion as a hypothesis when evidence is absent, indirect, contradictory, or outside the recruited population.
- Preserve negative and contradictory evidence; do not remove inconvenient sessions from synthesis.
- Report limitations and confidence without claiming statistical representativeness from qualitative samples.

## Deliverable

Return:

1. decision, assumptions, research questions, and evidence threshold;
2. method rationale, participant criteria, screener, safeguards, and protocol;
3. evidence repository structure and analysis plan;
4. findings, each with evidence IDs, counterevidence, affected segment, severity, and confidence;
5. recommendations with traceability, limitations, owner to confirm, and next validation decision.

Use [references/decision-guide.md](references/decision-guide.md) for method selection, consent and protocol checks, evidence schemas, synthesis rubrics, and traceability templates.

## Handoff

- Use `accessibility-testing` when findings require technical accessibility verification.
- Use `product-experimentation` when a causal product decision can be evaluated through a controlled experiment.
- Use `design-consultation` or `frontend-design` only after research implications are explicit; those skills do not replace user evidence.
