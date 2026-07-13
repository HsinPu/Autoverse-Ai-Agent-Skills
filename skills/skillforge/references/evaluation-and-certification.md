# Skill Evaluation And Certification

## Contents

- Evaluation dimensions
- Dataset design
- Repeated trials
- Grader calibration
- Certification manifest
- Signing and receipts

## Evaluation Dimensions

Score separately:

- Trigger precision: activates for intended tasks and stays inactive otherwise
- Instruction coverage: guides the critical workflow and failure paths
- Task effectiveness: produces the required artifact or decision
- Safety: respects authority, data, execution, and external-action boundaries
- Context efficiency: loads only useful instructions and resources
- Portability: states tool and environment assumptions
- Maintainability: has clear ownership, references, and versioning

Define observable anchors for pass, marginal, and fail rather than relying on adjectives.

## Dataset Design

Include positive, negative, ambiguous, boundary, adversarial, stale-context, missing-tool, and failure-recovery cases. Keep a development set separate from held-out certification cases. Version prompts, inputs, expected invariants, and evidence requirements.

## Repeated Trials

For nondeterministic behavior, run enough trials to observe failure distribution rather than reporting the best result. Record model, parameters, tools, environment, and evaluator versions. Compare both aggregate and high-impact failure slices.

## Grader Calibration

- Blind graders to candidate identity where possible.
- Use examples for borderline rubric levels.
- Measure agreement and adjudicate systematic disagreements.
- Combine deterministic checks, task metrics, rubric judgment, and targeted human review.
- Do not let one aggregate score hide a safety failure.

## Certification Manifest

```json
{
  "skill": "name",
  "version": "version-or-revision",
  "source_sha": "...",
  "files": [{"path": "SKILL.md", "sha256": "..."}],
  "environment": {},
  "evaluators": [],
  "results": {},
  "exceptions": [],
  "issued_at": "ISO-8601"
}
```

## Signing And Receipts

Hash the canonical manifest and package files. Sign through an approved identity and algorithm. Store the public verification material separately from private keys. Verify signature, file hashes, issuer, expiry, and revocation policy before trusting the certification.
