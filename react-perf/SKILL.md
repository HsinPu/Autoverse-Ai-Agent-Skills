---
name: react-perf
description: React performance guide for diagnosing re-render thrash, expensive computations, bundle growth, data waterfalls, and slow UI updates. Use when a React app feels sluggish, a component is too expensive, or performance work needs a focused review.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# React Performance

Use this skill to find and reduce React performance problems.

## Workflow

1. Identify the slow interaction, render path, or expensive view.
2. Check render frequency, memoization opportunities, data fetching shape, and update fan-out.
3. Remove unnecessary work before adding more caching or abstraction.
4. Prefer local fixes that reduce re-renders or split heavy views.
5. Verify the improvement with the smallest meaningful proof.

## Rules

- Fix the measured bottleneck, not hypothetical slowdowns.
- Avoid `useMemo` and `useCallback` unless they solve a real cost.
- Watch for waterfalls, repeated derived work, and oversized bundles.
- Keep the UI responsive while heavy work is deferred.

## Handoff

- For React async state patterns, use `react-ui-patterns`.
- For browser-level validation, use `webapp-testing`.
