---
name: logo-design
description: Logo design workflow for turning brand context into simple, recognizable logo concepts and SVG-ready visual directions. Use when creating or refining logos, brand marks, wordmarks, icon marks, monograms, brand symbols, or visual identity concepts for products, companies, apps, and communities.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Logo Design

Use this skill when the task is to design, refine, or specify a brand logo, wordmark, symbol, or mark system.

## When To Use

- Create a new logo direction from brand context.
- Compare or refine logo concepts for memorability, legibility, and fit.
- Produce implementation-ready SVG or usage specifications for a simple mark.

## Workflow

1. Collect brand name, audience, category, personality, competitors, usage surfaces, and required colors.
2. Extract 3-6 brand keywords that should drive the mark.
3. Generate distinct directions: symbolic, typographic, geometric, abstract, or mascot when appropriate.
4. Prefer simple silhouettes that work at favicon size and in one color.
5. If producing SVG, keep shapes minimal, named, and editable.

## Checks

- Test legibility at small sizes.
- Confirm the logo works in light, dark, monochrome, and transparent contexts.
- Avoid generic icons unless they are transformed into a distinctive mark.
- Avoid fragile gradients or fine details for primary marks.
- Make the rationale connect to brand strategy, not decoration.

## Output

- Present 2-3 directions with concept, shape language, color, and typography notes.
- When asked for implementation, provide clean inline SVG or implementation-ready specs.
- Include usage cautions for spacing, contrast, minimum size, and background treatment.

## Handoff

- Use `frontend-design` when the logo is part of a full website or product UI build.
- Use `color-font-skill` when the main question is palette or typography rather than mark shape.
- Use `lobe-icons-usage` when the user needs existing AI/provider/product icons rather than a new logo.
- Use `ai-image-prompt-design` when the output should be an image-generation prompt for logo exploration.
