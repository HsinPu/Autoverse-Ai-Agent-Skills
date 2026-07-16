# UX Research Decision Guide

## Contents

1. Decision framing
2. Method selection
3. Recruitment, consent, and privacy
4. Interview and usability protocols
5. Evidence repository
6. Synthesis, severity, and confidence
7. Recommendation traceability
8. Primary guidance

## 1. Decision Framing

Start with a decision, not a preferred method.

```text
Decision:
Decision owner:
Decision deadline:
Affected users and excluded populations:
Known evidence:
Assumptions to test:
Research questions:
Evidence that would change the decision:
Evidence that this study cannot provide:
```

Turn unsupported claims into questions. Define what the team will do differently for plausible outcomes before collecting data.

## 2. Method Selection

| Need | Suitable starting method | Does not establish |
|---|---|---|
| Goals, language, expectations, or remembered experiences | Semi-structured interview | Observed task performance or prevalence |
| Behavior in its real environment | Contextual inquiry or field observation | Controlled causal effect |
| Where and why a workflow breaks | Moderated or unmoderated usability study | Market demand |
| Behavior or experience over time | Diary study with follow-up interview | Population prevalence without a valid sample |
| Estimate a distribution or compare groups | Survey with a defensible sampling and analysis plan | The reason behind an answer by itself |
| Decide whether a product change caused a metric movement | Randomized experiment | Rich explanation of lived experience |
| Reuse prior knowledge | Existing-evidence review | Fresh evidence outside the source scope |

Prefer multiple small rounds when the design will change between rounds. State whether sampling is purposive, convenience-based, quota-based, or probabilistic and limit claims accordingly.

## 3. Recruitment, Consent, and Privacy

Recruit actual or likely users whose experience can answer the question. Express criteria as relevant behaviors, contexts, tools, or access needs; use demographics only when they are substantively relevant.

Check before recruitment:

- inclusion, exclusion, desired variation, access needs, and conflicts of interest;
- neutral screening questions that do not expose the preferred answer;
- recruitment channel, compensation, scheduling burden, and safeguarding risks;
- participant information covering purpose, activities, observers, recording, data use, retention, withdrawal, and contact route;
- minimum necessary personal data, access control, secure storage, redaction, deletion, and third-party processing;
- explicit consent for each recording or reuse purpose, with a viable no-recording path when possible.

Do not store screening details beside research evidence unless linkage is necessary and authorized. Replace direct identifiers with participant IDs and keep the lookup separately protected.

## 4. Interview and Usability Protocols

An interview guide should move from context to concrete recent examples, behavior, workarounds, consequences, and reflection. Ask one neutral question at a time. Probe with prompts such as “What happened next?” or “What made that difficult?” instead of suggesting an answer.

A usability protocol should define:

- starting state, realistic scenario, task success, critical errors, assistance rules, and stop conditions;
- prototype limitations and any unavailable or simulated functions;
- moderator script, think-aloud request, neutral probes, observer behavior, and debrief;
- device, browser, assistive technology, environment, and accessibility needs;
- a pilot session that checks timing, task ambiguity, data capture, and failure recovery.

Do not teach the interface before testing it. Record assistance because successful completion after a hint is not unassisted success.

## 5. Evidence Repository

Use stable, non-identifying IDs and preserve provenance.

```text
study_id | round_id | session_id | evidence_id
research_question | participant_segment | method | task_or_topic
evidence_type | observed_behavior_or_authorized_statement
context | outcome | assistance | source_location | captured_at
researcher_interpretation | confidence_note | consent_scope
```

Keep the raw evidence field descriptive. Put explanations in `researcher_interpretation`. Link recordings or transcripts by protected source location rather than copying sensitive content into broad-access repositories.

## 6. Synthesis, Severity, and Confidence

Write each finding as:

```text
Finding ID and statement:
Research question:
Supporting evidence IDs:
Contradictory evidence IDs:
Affected segment and context:
Interpretation:
Usability severity:
Evidence confidence:
Limitations:
```

Rate severity by impact, not by how memorable a quote is:

- **Critical:** prevents a critical task, creates material harm, or has no safe recovery.
- **Major:** causes failure, abandonment, repeated serious error, or substantial assistance.
- **Moderate:** causes delay, confusion, avoidable error, or a recoverable detour.
- **Minor:** creates friction or inconsistency without threatening task completion.

Rate confidence independently:

- **High:** direct, relevant evidence from multiple suitable sources with no material unresolved contradiction.
- **Medium:** direct but limited evidence, narrow coverage, or a plausible contradiction that needs another round.
- **Low:** indirect, sparse, ambiguous, out-of-scope, or primarily assumption-driven evidence.

Counts describe only the studied sample unless the sampling and analysis support population estimates. Themes are analytical constructs, not votes; retain outliers that reveal harm, accessibility barriers, or a distinct context.

## 7. Recommendation Traceability

Maintain this chain:

```text
decision -> research question -> method/round -> evidence IDs
         -> finding ID -> recommendation ID -> validation check
```

For every recommendation state the user problem, implicated finding, intended outcome, trade-off, owner to confirm, and how the next study or product signal will test it. A recommendation without a finding is an idea; a finding without evidence IDs is an unsupported claim.

## 8. Primary Guidance

This guide is an original operational synthesis informed by:

- [GOV.UK: Plan user research for your service](https://www.gov.uk/service-manual/user-research/plan-user-research-for-your-service)
- [GOV.UK: Plan a round of user research](https://www.gov.uk/service-manual/user-research/plan-round-of-user-research)
- [GOV.UK: Find user research participants](https://www.gov.uk/service-manual/user-research/find-user-research-participants)
- [GOV.UK: Getting informed consent for user research](https://www.gov.uk/service-manual/user-research/getting-users-consent-for-research)
- [GOV.UK: Taking notes and recording sessions](https://www.gov.uk/service-manual/user-research/taking-notes-and-recording-user-research-sessions)
- [GOV.UK: Using moderated usability testing](https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing)
