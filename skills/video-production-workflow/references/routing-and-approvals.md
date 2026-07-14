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
| Environment-, wardrobe-, prop-, or brand-world-heavy production | Add production designer |
| Camera-, lighting-, capture-, or renderer-critical production | Add cinematographer |
| Multi-source, revision-heavy, long-form, or delivery-critical edit | Add video editor |
| Dialogue-, music-, ambience-, effects-, or mix-critical production | Add sound designer |
| Music-led, multi-cue, custom-composed, generated, or rights-sensitive production | Add music supervisor; keep sound integration with sound designer |
| Tracking-, keying-, cleanup-, simulation-, CG-, or composite-heavy shots | Add VFX supervisor |
| Title-, typography-, diagram-, chart-, UI-, or brand-animation-heavy production | Add motion-graphics designer |
| Color-managed, look-critical, HDR or multi-display finishing | Add colorist after conform and picture lock |
| Multiple destinations, technical variants, or formal master-QC requirements | Add delivery mastering specialist after picture, sound, color, caption, and effects lock |
| Brand campaign or cross-medium creative system | Add creative director above the video-specific team |

Select roles from current runtime descriptions. Missing optional roles must not block sequential execution.

## Role Boundaries

- **Creative director** owns cross-medium creative principles and visual-quality direction.
- **Video director** owns the video's creative interpretation, team routing, revision arbitration, and final creative recommendation.
- **Video producer** owns feasibility, schedule, budget, providers, rights, assets, approvals, and restartable state.
- **Screenwriter** owns the script's narrative structure, scenes, visible action, dialogue, and voiceover.
- **Storyboard artist** owns narrative shot decomposition, composition, blocking, screen direction, transitions, and provisional camera or movement intent.
- **Production designer** owns the baseline producible visual world, environment, set, prop, wardrobe, material, signage, and asset-design specifications.
- **Cinematographer** turns the approved shot intent into executable camera, lens, movement, focus, lighting, exposure, capture or render specifications and visual-technical review.
- **Continuity supervisor** owns the continuity baseline and audits planned and generated material against it.
- **VFX supervisor** owns the shot-effects breakdown, plates and camera-data requirements, compositing dependencies, version review, provenance, and final-pixel evidence; camera execution and visual-world design remain upstream.
- **Motion-graphics designer** owns visible informational and brand graphics, animated typography, reusable motion components, graphics variants, and render contracts; edit structure and integrated VFX remain separate.
- **Music supervisor** owns the music brief, spotting, sourcing or commission route, candidate and version decisions, beat structure, and clearance evidence; the sound designer owns integration and mix.
- **Sound designer** owns the sonic plan, cue sheet, sound assets, stem strategy, picture-aware mix requirements, and sound QC evidence.
- **Video editor** owns source-to-timeline decisions, edit structure, selects, cut versions, audiovisual assembly, revision evidence, and picture lock; approved specialist outputs are placed rather than silently redesigned.
- **Colorist** owns post-conform color management, look execution, shot matching, target trims, and color-finishing evidence; capture intent, design palette, and edit timing remain upstream.
- **Delivery mastering specialist** owns locked-source technical masters, variants, transforms, manifests, checksums, and conformance evidence; this role never recuts, regrades, remixes, rewrites, uploads, or publishes.

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
| Production lock | Storyboard, shot list, applicable production-design, camera-lighting, sound, music, VFX, and motion-graphics plans, continuity bible, production plan, cost range | User or production owner |
| Consequential generation | Provider, model, inputs, data handling, rights, estimated cost, sample or batch | User or budget and rights owner |
| Substitution | Failure evidence, alternatives, cost, quality, privacy, rights, schedule impact | Owner of the affected constraint |
| Picture lock | Approved edit-plan version, cut review, downstream VFX, graphics, sound, music, color, caption, and delivery handoffs | User or accountable creative owner |
| Music commitment | Approved cues and versions, rights evidence, cost, territories, media, term, restrictions, unresolved legal review | User or budget and rights owner |
| Finishing lock | Approved picture, VFX, graphics, music, sound, color, caption, rights, and specialist review evidence | User or accountable creative owner |
| Technical delivery | Review report, delivery manifest, source lineage, checksums, variant QC, accepted exceptions, chosen masters | User or release owner |

Stop the turn at a required human gate unless the current project state records explicit authorization covering that exact gate.

## Sequential Fallback

When delegation is unavailable:

1. Keep one current stage and one canonical artifact owner identity: `sequential-runner`.
2. Load only the Skills needed for that stage.
3. Complete and validate the artifact before advancing.
4. Record the same gates, evidence, versions, costs, and rights used in multi-agent mode.
5. Ask for specialist review only when the risk or acceptance criteria require expertise not available in the current runtime.

Sequential execution changes who performs the work, not the workflow contract or approval standard.
