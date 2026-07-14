# Video Production Routing and Approvals

## Contents

- Team sizing
- Role boundaries
- Delegation contract
- Approval matrix
- Sequential fallback

## Team Sizing

| Production shape | Recommended team |
|---|---|
| Simple clip, existing script, or deterministic template | Video director using relevant Skills |
| Typical short or explainer | Video director, screenwriter when needed, storyboard artist |
| Long-form, multi-scene, recurring characters, or paid generation | Video director, video producer, screenwriter, storyboard artist, continuity supervisor |
| Brand campaign or cross-medium creative system | Add creative director above the video-specific team |

Select roles from current runtime descriptions. Missing optional roles must not block sequential execution.

## Role Boundaries

- **Creative director** owns cross-medium creative principles and visual-quality direction.
- **Video director** owns the video's creative interpretation, team routing, revision arbitration, and final creative recommendation.
- **Video producer** owns feasibility, schedule, budget, providers, rights, assets, approvals, and restartable state.
- **Screenwriter** owns the script's narrative structure, scenes, visible action, dialogue, and voiceover.
- **Storyboard artist** owns shot visualization, composition, camera, movement, transitions, and production-ready shot planning.
- **Continuity supervisor** owns the continuity baseline and audits planned and generated material against it.

Do not merge two roles merely to reduce message count when their decisions could conflict. Do not create a separate role when a scoped Skill and one artifact owner are enough.

## Delegation Contract

Provide each delegated role:

```text
Objective:
Approved inputs and versions:
Owned artifact:
Read-only dependencies:
Decisions the role may make:
Decisions requiring approval:
Acceptance criteria:
Required evidence:
Stop conditions:
```

The video director validates the artifact contract. The video producer validates operational readiness, rights, cost, and checkpoint state. Neither validation replaces the accountable approval owner.

## Approval Matrix

| Gate | Required artifact or evidence | Default decision owner |
|---|---|---|
| Direction | `brief.md`, `creative-treatment.md`, alternatives and tradeoffs | User or accountable creative owner |
| Narrative | Approved `script.md`, runtime estimate, unresolved claims or rights | User or content owner |
| Production lock | Storyboard, shot list, continuity bible, production plan, cost range | User or production owner |
| Consequential generation | Provider, model, inputs, data handling, rights, estimated cost, sample or batch | User or budget and rights owner |
| Substitution | Failure evidence, alternatives, cost, quality, privacy, rights, schedule impact | Owner of the affected constraint |
| Final delivery | Review report, technical checks, rights state, chosen render | User or release owner |

Stop the turn at a required human gate unless the current project state records explicit authorization covering that exact gate.

## Sequential Fallback

When delegation is unavailable:

1. Keep one current stage and one canonical artifact owner identity: `sequential-runner`.
2. Load only the Skills needed for that stage.
3. Complete and validate the artifact before advancing.
4. Record the same gates, evidence, versions, costs, and rights used in multi-agent mode.
5. Ask for specialist review only when the risk or acceptance criteria require expertise not available in the current runtime.

Sequential execution changes who performs the work, not the workflow contract or approval standard.
