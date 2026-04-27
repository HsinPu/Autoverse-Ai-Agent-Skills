---
name: frontend-stack-inference
description: Frontend stack inference workflow for identifying JavaScript frameworks, jQuery, Bootstrap, CSS frameworks, build tools, meta-frameworks, and legacy patterns from repository files, HTML, DOM attributes, global variables, script URLs, package metadata, and bundle signals. Use when auditing an unknown frontend, planning migration, documenting tech stack, or deciding which frontend skill to load next.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Frontend Stack Inference

Use this skill before changing an unfamiliar frontend. It helps decide whether to load `jquery-development`, `legacy-frontend-modernization`, `react-ui-patterns`, `vue-development`, `vite`, `tailwind-development`, or another focused skill.

## Evidence Sources

- Package files: `package.json`, lockfiles, `bower.json`, `yarn.lock`, `pnpm-lock.yaml`.
- HTML/templates: script URLs, data attributes, meta tags, server-rendered partials.
- Source imports: `import`, `require`, globals, plugin calls.
- DOM signals: framework root markers, generated attributes, CSS class naming patterns.
- Build config: Vite, Webpack, Rollup, Parcel, Gulp, Grunt, Laravel Mix, Rails/Sprockets.
- Runtime globals when inspecting a page: `window.jQuery`, `window.$`, `window.React`, `window.Vue`, `window.angular`.

## Detection Signals

- **jQuery**: `jquery` package, `window.jQuery`, `window.$`, `$(`, `$.ajax`, `$.fn.pluginName`, `$(document).ready`.
- **Bootstrap**: `bootstrap` package, `bootstrap.js`, `data-bs-*`, `btn`, `modal`, `navbar`, `container`, `row`, `col-*`.
- **React**: `react` package, JSX/TSX, `createRoot`, `data-reactroot`, Next.js/Gatsby/Remix markers.
- **Vue**: `vue` package, `.vue` SFCs, `createApp`, `data-v-*`, Nuxt markers.
- **Angular**: `@angular/*`, `ng-version`, `ng-*`, `_ngcontent-*`.
- **Alpine**: `x-data`, `x-init`, `window.Alpine`.
- **Tailwind**: `tailwind.config`, utility-heavy class patterns, `@tailwind` directives.
- **Vite/Webpack**: config files, dev script names, chunk filenames, `@vite` paths, `webpack.config`.

## Confidence

- **High**: package dependency plus source usage or runtime marker.
- **Medium**: bundle/DOM/class patterns without package metadata.
- **Low**: naming hints only, generated/minified code only, or framework-like CSS class collisions.

## Workflow

1. Search package/config files first to avoid guessing from snippets.
2. Search source for direct imports and global usage patterns.
3. Inspect templates or HTML for runtime markers and script order.
4. Record evidence for each inferred technology and confidence level.
5. Identify migration risks: global scripts, plugin dependencies, mixed framework ownership, browser support, no build step.
6. Recommend the next skill or modernization path.

## Output

```markdown
## Frontend Stack Inference

### Detected Stack
- <technology>: <confidence> - <evidence>

### Legacy Signals
- <signal and why it matters>

### Risks
- <migration or maintenance risk>

### Recommended Next Skills
- `<skill-name>` for <reason>
```

## Avoid

- Treating `$` alone as proof of jQuery; confirm `window.jQuery` or package/source usage.
- Treating Bootstrap-like class names as Bootstrap without supporting evidence.
- Inferring a framework from minified bundle fragments without corroborating files.
