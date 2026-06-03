---
name: animation-best-practices
description: UI animation and motion guidance for hover states, button feedback, transitions, loading motion, and interaction polish in web interfaces. Use when a frontend task needs motion that improves clarity, responsiveness, or visual feel, or when fixing awkward, jittery, or excessive animation behavior.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Animation Best Practices

Use this skill to make motion feel deliberate.

## Workflow

1. Decide what the motion should communicate: feedback, hierarchy, attention, or state change.
2. Keep durations, easing, and distance consistent across related components.
3. Use motion on hover, press, load, and transition states only when it adds clarity.
4. Respect `prefers-reduced-motion` and provide a low-motion fallback.
5. Verify the animation feels smooth on desktop and mobile.

## Rules

- Keep button feedback short and obvious.
- Prefer subtle transitions over decorative motion.
- Avoid animation that competes with content or layout.
- Align motion with the existing design system.

## Handoff

- For larger UI builds, use `frontend-design`.
- For Tailwind implementation, use `tailwind-patterns`.
- For layout polish, use `responsive-design`.
