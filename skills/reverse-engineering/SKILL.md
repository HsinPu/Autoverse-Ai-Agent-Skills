---
name: reverse-engineering
description: Perform authorized static and controlled dynamic analysis of binaries, firmware, memory images, and network protocols through artifact provenance, hashing, format identification, disassembly, decompilation, control-flow and data-flow analysis, memory forensics, protocol inference, and behavioral specification. Use for compatibility, migration, incident investigation, malware triage, documentation, or clean-room interoperability without bypassing access controls or weaponizing findings.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Reverse Engineering

## Workflow

1. Confirm authorization, purpose, artifacts, versions, platforms, analysis environment, prohibited actions, and clean-room requirements.
2. Preserve originals and record hashes, provenance, acquisition, timestamps, packaging, and chain-of-custody limitations.
3. Identify formats, architecture, loaders, sections, imports, symbols, strings, metadata, compression, and protection.
4. Map entry points, control flow, data structures, state, external calls, file and network behavior, and error paths.
5. Form hypotheses and test them through safe static inspection or isolated controlled execution when authorized.
6. Reconstruct interfaces, formats, protocols, state machines, invariants, and compatibility behavior.
7. Produce independent specifications, indicators, conformance cases, confidence, and safe next steps.

## Rules

- Do not bypass access controls, extract credentials, evade detection, or improve harmful capability.
- Keep original artifacts immutable and isolated.
- Distinguish observed facts, reachable behavior, inference, and unknowns.
- Prevent unknown code from reaching production networks, secrets, or host filesystems.
- Respect copyright, licenses, privacy, export controls, and clean-room separation.

## References

- Read [references/binary-memory-and-protocol-analysis.md](references/binary-memory-and-protocol-analysis.md) for static analysis, decompiler recovery, memory forensics, protocol inference, evidence handling, isolation, and reporting patterns.

## Handoff

- Use `security-code-review` for recovered source or implementation review.
- Use `incident-response-postmortems` for incident evidence and timeline.
- Use `specification-authoring` for behavioral contracts.
- Use `testing-strategy` for conformance tests.
