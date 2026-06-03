---
name: ux-writing
description: UX writing and interface microcopy guide for making product text clearer, shorter, warmer, and more action-oriented. Use when writing or revising button labels, empty states, error messages, loading text, onboarding copy, tooltips, form help, notifications, or any UI copy that affects user experience.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# UX Writing

## Workflow

1. Identify the user state: goal, context, blocker, risk, and next action.
2. Decide the message job: guide, confirm, warn, recover, explain, or motivate.
3. Write the shortest copy that preserves clarity and tone.
4. Prefer specific action verbs over vague encouragement.
5. Check the copy in UI context for length, hierarchy, and accessibility.

## Rules

- Make the next action obvious.
- Use plain words before clever words.
- Keep critical errors direct; save playful metaphors for low-risk moments.
- Avoid blaming the user. Explain what happened and how to recover.
- Match product tone consistently across buttons, alerts, empty states, and help text.

## Patterns

- Empty state: `What is missing` + `Why it matters` + `Primary action`.
- Error: `What failed` + `Impact` + `Recovery action`.
- Loading: say what is happening only when the wait is meaningful.
- CTA: start with the user benefit or concrete action, not internal implementation.
- Form help: explain constraints before submission, not after failure.

## Output

- Provide 2-4 copy options when tone is subjective.
- Label options by tone, such as `direct`, `friendly`, or `premium`.
- Include a short rationale only when the choice affects behavior or trust.
