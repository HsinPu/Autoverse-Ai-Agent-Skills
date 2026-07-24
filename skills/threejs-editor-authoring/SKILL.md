---
name: threejs-editor-authoring
description: "Three.js runtime editor and authoring-tool architecture. Use for scene editors, object outliners, inspectors, gizmos, TransformControls, selection, undo and redo, serialization, autosave, import and export, GLTFExporter, presets, plugins, or editor-to-runtime publishing."
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Three.js Editor and Authoring

Build an editor around versioned domain commands and publishable assets instead of serializing incidental runtime state.

## Workflow

1. Define authoring entities, editable properties, stable IDs, permissions, document version, runtime target, collaboration needs, and publication boundary.
2. Read [authoring-export.md](../threejs-development/references/authoring-export.md) and separate editor document state, transient selection or gizmo state, and rendered scene state.
3. Express mutations as validated commands with reversible patches, transaction grouping, and deterministic undo or redo.
4. Build outliner, inspector, selection, snapping, transform, duplication, hierarchy, asset, and viewport tools against the shared document model.
5. Define import, migration, autosave, recovery, export, optimization, validation, and publish steps with explicit loss reporting.
6. Test command replay, deep hierarchy edits, stale documents, corrupt imports, crash recovery, round trips, large scenes, and runtime-only output.

## Rules

- Do not persist renderer internals, event handlers, GPU handles, or arbitrary executable data.
- Keep preview helpers, editor metadata, and production scene content distinguishable.
- Bound history and autosave storage; make destructive operations recoverable.
- Treat import and plugin boundaries as untrusted.
- Verify exporter support and record properties that cannot round-trip.

## Evidence

Return the document schema, command and history model, editor/runtime boundary, migration policy, import/export loss matrix, recovery behavior, and round-trip tests.

## Handoff

- Use `threejs-csg-modeling` when Boolean operands, operation stacks, topology repair, cut-face materials, or Boolean export become a distinct authoring subsystem.
- Keep canonical operands and commands in the editor document; keep evaluated render geometry derived.
