# STRIDE, Attack Trees, And Security Requirements

## Contents

- STRIDE prompts
- Attack trees
- Risk reasoning
- Requirement and mitigation templates
- Review checklist

## STRIDE Prompts

| Category | Ask |
|---|---|
| Spoofing | How could an actor or workload assume another identity? |
| Tampering | What data, code, configuration, or message could be changed? |
| Repudiation | Which consequential action lacks attributable evidence? |
| Information disclosure | What sensitive data could cross an unintended boundary? |
| Denial of service | Which bounded resource or dependency can be exhausted? |
| Elevation of privilege | How could a lower-privilege actor gain a stronger capability? |

Apply only relevant categories to each data flow, process, store, actor, and external system.

## Attack Trees

Write the unacceptable outcome as the root. Decompose into attacker alternatives using OR branches and required combined steps using AND branches. Annotate prerequisites, privileges, access, detectability, cost, current controls, and evidence. Stop decomposing when a leaf maps to a testable control or known assumption.

## Risk Reasoning

Consider impact, likelihood, exposure, attacker capability, required access, control strength, detectability, velocity, and recovery. Avoid fake precision; explain the evidence behind priority.

## Security Requirement Template

```text
Requirement ID:
Threats addressed:
Asset and trust boundary:
Required behavior:
Failure behavior:
Verification method:
Owner:
Exceptions and expiry:
Residual risk and acceptance authority:
```

Write requirements as observable behavior, not “use encryption” or “be secure.”

## Mitigation Mapping

Map each high-priority threat to prevention, detection, response, and recovery. Identify shared controls and single points of failure. Prefer eliminating exposure or reducing privilege before adding monitoring alone.

## Review Checklist

- Are assets and unacceptable outcomes explicit?
- Does the diagram reflect current architecture?
- Are identities and privilege transitions visible?
- Are third parties, automation, and recovery paths included?
- Does every prioritized threat have an owner and verification?
- Is residual risk accepted by the correct authority?
