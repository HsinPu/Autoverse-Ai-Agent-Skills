---
name: threat-modeling
description: Build actionable threat models from assets, actors, architecture, data flows, trust boundaries, STRIDE analysis, abuse cases, attack trees, existing controls, security requirements, mitigation mapping, and residual-risk ownership. Use before sensitive design or release decisions, after major architecture changes, or when security findings need to be translated into prioritized requirements and tests.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/Autoverse-Ai-Agent-Skills"
---

# Threat Modeling

## Workflow

1. Define system scope, environments, assets, unacceptable outcomes, users, administrators, dependencies, and attackers.
2. Draw data flows, entry points, identities, privilege transitions, storage, external systems, and trust boundaries.
3. Apply STRIDE and domain-specific abuse cases to each relevant element and flow.
4. Build attack paths or trees for high-impact outcomes and identify prerequisites and choke points.
5. Evaluate prevention, detection, response, recovery, and bypass conditions of current controls.
6. Convert prioritized threats into testable security requirements with owners and verification.
7. Map mitigations, residual risk, acceptance authority, and review triggers.

## Rules

- Keep architecture facts, assumptions, threats, controls, and accepted risks separate.
- Avoid generic threat lists without an asset, path, prerequisite, and consequence.
- Include insider, compromised dependency, automation, recovery, and operational misuse where credible.
- Prefer mitigations at the strongest practical trust boundary.
- Do not claim compliance or complete security from one model.

## Output Contract

Record threat ID, asset, actor, entry point, prerequisites, path, impact, likelihood rationale, existing controls, gaps, mitigation, verification, owner, residual risk, and decision authority.

## References

- Read [references/stride-attack-trees-and-requirements.md](references/stride-attack-trees-and-requirements.md) for STRIDE prompts, attack-tree construction, severity reasoning, requirement templates, mitigation mapping, and review checklists.

## Handoff

- Use `security-code-review` to inspect implementation.
- Use `security-scanning` to automate applicable controls.
- Use `auth-integration` for identity and authorization design.
- Use `incident-response-postmortems` for response and recovery planning.
