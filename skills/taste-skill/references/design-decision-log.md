# Design Decision Log

Use this record when visual direction will be revisited across sessions, compared by several people, or handed to another implementer. Keep small one-off choices in task context.

## Storage Rules

- Follow the repository's existing decision-record location and naming convention.
- Create a new artifact only when someone will maintain or consume it later.
- Keep the record project-local. Do not infer or store a cross-project user taste profile.
- Store links or stable artifact identifiers instead of duplicating large images.
- Never include private customer data, secrets, internal analytics, or unapproved third-party assets.

## Decision Header

```markdown
# Design decision: <surface or route>

- Decision ID:
- Status: exploring | selected | approved | rejected | superseded
- Scope: direction only | implementation authorized | pilot authorized | rollout authorized
- Owner:
- Recorded at:
- Active version:
- Product/audience evidence:
- Constraints:
- Reopen when:
```

## Candidate Comparison

| Candidate ID | Artifact and viewport | Intent and signature | Product fit | Accessibility/performance | Build cost | Decision | Reason | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

Compare candidates against the same product evidence. A rejected candidate is not a permanent aesthetic ban; record the contextual reason it lost. When judgment is close, state the uncertainty and prefer the option that meets the task with less operational or implementation risk.

## Approval Evidence

Record who or what authority selected the candidate, the exact version, the approval scope, accepted deviations, and unresolved questions. General encouragement does not expand design approval into implementation or rollout authority.

## Change History

| Version | Status change | New evidence | Decision impact | Recorded by |
| --- | --- | --- | --- | --- |

Append decisions; do not rewrite a rejected or superseded record to make the outcome look inevitable.
