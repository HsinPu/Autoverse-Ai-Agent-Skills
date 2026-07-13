# Binary, Memory, And Protocol Analysis

## Contents

- Evidence and isolation
- Static binary analysis
- Controlled dynamic analysis
- Memory forensics
- Protocol inference
- Reporting

## Evidence And Isolation

Hash originals, work from copies, record tool versions, and use an isolated environment with no production credentials or unnecessary network access. Preserve timestamps and acquisition notes. Treat decompression and file parsing as potentially unsafe.

## Static Binary Analysis

1. Identify format, architecture, endianness, compiler clues, sections, imports, exports, symbols, resources, signatures, and packers.
2. Locate entry points and high-value strings, constants, file paths, domains, commands, and error messages.
3. Build call and control-flow maps around target behavior.
4. Recover function boundaries, parameters, return values, structures, virtual dispatch, and global state.
5. Rename and annotate from evidence, keeping confidence visible.

## Controlled Dynamic Analysis

Use breakpoints, traces, system-call monitoring, snapshots, and deterministic input in an isolated lab only when authorized. Block external effects or redirect them to controlled substitutes. Record how execution differs from production conditions.

## Memory Forensics

Verify acquisition integrity and operating-system profile. Inspect processes, modules, handles, sockets, injected regions, command history, credentials indicators, and timeline artifacts. Do not expose recovered secrets; handle them through incident procedures.

## Protocol Inference

Capture authorized traffic and identify framing, length, version, message type, sequence, state, encoding, compression, checksums, and error behavior. Vary one input dimension at a time. Produce a state machine and independent parser tests rather than only packet annotations.

## Reporting

For each finding record artifact offset or address, method, evidence, inference, confidence, security or compatibility impact, and a safe reproduction or conformance case. Keep harmful operational details restricted to authorized audiences.
