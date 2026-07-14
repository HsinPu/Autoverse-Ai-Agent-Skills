# Source Adaptation Notes

This Skill and the related Agents are original HsinPu definitions. The sources below informed role boundaries and workflow concepts; no upstream prompt or implementation is copied as the canonical content.

| Reference | Pinned revision | License status | Concept used |
|---|---|---|---|
| `DojoCodingLabs/remotion-superpowers` | `9cd04664656b887a5e5fd6715c6e5eb14d384ea7` | MIT | Brief-to-delivery video-director lifecycle and explicit production-plan approval |
| `paperclipai/companies` | `514503bf4f0ca88ebf16d5dc648e085d587f268f` | MIT for `agency-agents/` | Creative vision, design-quality governance, assignment, and handoff boundaries |
| `calesthio/OpenMontage` | `f8d94632ea9bd0057da31904acca1cefecf005dd` | AGPL-3.0 | Stage gates, canonical artifacts, checkpoints, capability discovery, and human approval concepts only |
| `HKUDS/ViMax` | `c4b8a8ad634bc2be53d133039dc5287e936879ec` | MIT | Script, storyboard, reference selection, shot decomposition, and cross-scene consistency concerns |
| `showlab/MovieAgent` | `d84041bed8bc8be460664528d9e9924cdde384ba` | No repository-wide license found at the inspected revision | Public README and paper-level role decomposition only; no code or prompt content reused |
| `HITsz-TMG/AIGC-Claw` (formerly `HITsz-TMG/FilmAgent`) | `1324b36020570c279cd9560794a8f5508bf7bb70` | MIT | Shot-language selection and review plus environment-asset generation, hard-failure checks, scored evaluation, revision, and best-version selection, expanded into tool-neutral cinematography and production-design ownership |
| `NousResearch/hermes-agent` | `226e8de827a669e8ffa7035b27d70c19e44b1208` | MIT | Supplemental cinematographer responsibility, renderer review, optional post-production roles, music analysis and routing, beat dependencies, master variants, capability routing, and task-graph concepts, expanded into separate Autoverse ownership contracts |
| `Donchitos/Claude-Code-Game-Studios` | `984023ddac0d5e27624f2baacde6105e45de375f` | MIT | Supplemental visual-bible and asset-specification concepts plus sound-event, variation, ambience-layer, mix-documentation, and non-responsibility boundaries adapted from games into timecoded linear-video sound design |
| `davila7/claude-code-templates` | `fa79251f9fabea39838c6af01e8ccf8fb6f02100` | MIT | Non-destructive editing, timeline, transition, sync, format, and QC concepts, expanded with artifact ownership, versioned cuts, decision evidence, accessibility, rights, and restartable checkpoints |
| `jacobcwright/open-animate` | `a6c2b336f827014052bece279c68faa63c84483b` | Apache-2.0 | Motion-graphics project, typography, transition, preview, render, and asset-integration concepts, rewritten as a tool-neutral graphic-system, accessibility, data-provenance, variant, and editorial-handoff role |
| `browser-use/video-use` | `92c2b34e44c205cbc2acae7f6ca7c1c219d5dd66` | MIT | Approval-before-execution, edit-decision artifacts, timestamp-correct overlays, alpha compositing, timeline inspection, bounded review loops, and media-probe QC, expanded into original shot-level VFX supervision and final-pixel governance |

## Adaptation Policy

- Keep `source: HsinPu/Autoverse-Ai-Agent-Skills` on every first-party component.
- Pin Agent reference repositories through `scripts/data/agent-reference-sources.json` and record exact paths in canonical Agent frontmatter.
- Treat OpenMontage and MovieAgent as conceptual research only where their licensing or architecture differs from this Apache-2.0 catalog; OpenMontage is not used as a canonical Agent reference because its AGPL-3.0 license is outside the Agent manifest's supported reference licenses.
- Remove framework-specific assumptions such as mandatory Remotion, fixed MCP servers, one provider, one data model, or one agent runtime.
- Do not reuse Open Animate or video-use implementation code in canonical prompts; retain only role-level concepts and independently define decisions, constraints, artifacts, approvals, rights, accessibility, and restart evidence.
- Strengthen upstream concepts with explicit ownership, rights, cost, accessibility, approvals, restartability, and sequential fallback.
