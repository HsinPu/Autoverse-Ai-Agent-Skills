# Source Adaptation Notes

This Skill and the related Agents are original HsinPu definitions. The sources below informed role boundaries and workflow concepts; no upstream prompt or implementation is copied as the canonical content.

| Reference | Pinned revision | License status | Concept used |
|---|---|---|---|
| `DojoCodingLabs/remotion-superpowers` | `9cd04664656b887a5e5fd6715c6e5eb14d384ea7` | MIT | Brief-to-delivery video-director lifecycle and explicit production-plan approval |
| `paperclipai/companies` | `514503bf4f0ca88ebf16d5dc648e085d587f268f` | MIT for `agency-agents/` | Creative vision, design-quality governance, assignment, and handoff boundaries |
| `calesthio/OpenMontage` | `f8d94632ea9bd0057da31904acca1cefecf005dd` | AGPL-3.0 | Stage gates, canonical artifacts, checkpoints, capability discovery, and human approval concepts only |
| `HKUDS/ViMax` | `c4b8a8ad634bc2be53d133039dc5287e936879ec` | MIT | Script, storyboard, reference selection, shot decomposition, and cross-scene consistency concerns |
| `showlab/MovieAgent` | `d84041bed8bc8be460664528d9e9924cdde384ba` | No repository-wide license found at the inspected revision | Public README and paper-level role decomposition only; no code or prompt content reused |

## Adaptation Policy

- Keep `source: HsinPu/Autoverse-Ai-Agent-Skills` on every first-party component.
- Pin Agent reference repositories through `scripts/data/agent-reference-sources.json` and record exact paths in canonical Agent frontmatter.
- Treat OpenMontage and MovieAgent as conceptual research only where their licensing or architecture differs from this Apache-2.0 catalog.
- Remove framework-specific assumptions such as mandatory Remotion, fixed MCP servers, one provider, one data model, or one agent runtime.
- Strengthen upstream concepts with explicit ownership, rights, cost, accessibility, approvals, restartability, and sequential fallback.
