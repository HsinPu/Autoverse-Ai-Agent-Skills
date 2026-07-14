Project: <project-id>
Artifact: review-report
Version: 0.1
Status: draft
Owner:
Inputs:
Decisions applied:
Assumptions:
Approval owner:
Last updated:
Supersedes:

# Review Report

## Review Target

- Render or artifact version:
- Source revision:
- Delivery specification:
- Reviewers and specialties:

## Findings

| ID | Severity | Timecode or artifact | Finding | Required fix | Owner | Evidence | Status |
|---|---|---|---|---|---|---|---|

Severity values:

- `blocker`: rights, safety, missing evidence, corruption, or another defect that makes review or delivery invalid.
- `high`: a material failure against approved narrative, continuity, accessibility, creative, or technical acceptance criteria.
- `medium`: a contained defect that requires correction or an explicit accepted exception before closure.
- `low`: polish or advisory feedback that still requires a recorded disposition.

The gate cannot be approved while a `blocker` or `high` finding remains unresolved. Every `medium` or `low` finding must be fixed, rejected with rationale, or recorded as an accepted exception by the decision owner.

## Gate Checks

- [ ] Narrative and pacing match the approved treatment and script.
- [ ] Visual and temporal continuity pass.
- [ ] Rights, consent, privacy, and attribution evidence are complete.
- [ ] Captions, readable text, audio balance, and accessibility pass.
- [ ] Duration, resolution, codec, frame rate, audio, and platform limits pass.
- [ ] No unresolved `blocker` or `high` findings remain; every `medium` and `low` finding has a recorded disposition.

## Gate Result

- Result: `blocked` | `revision-required` | `approved`
- Decision owner:
- Decision and evidence:
- Approved deliverables:
- Publication or distribution authorized: no
