---
name: lobe-ui-development
description: Lobe UI development guide for using @lobehub/ui in React, Next.js, and AIGC web app interfaces. Use when integrating Lobe UI components, ThemeProvider, I18nProvider, ConfigProvider motion setup, Ant Design compatibility, antd-style theming, or building AI product interfaces with the LobeHub UI ecosystem.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Lobe UI Development

## Core Notes

- `@lobehub/ui` is an ESM-only React UI component library for AIGC web apps.
- Components are based on Ant Design and are intended to work with `antd-style` for CSS-in-JS theming.
- In Next.js page-router SSR setups, add `transpilePackages: ['@lobehub/ui']` to `next.config.js`.

## Integration Pattern

```tsx
import { ThemeProvider, Button } from '@lobehub/ui';

export default function App() {
  return (
    <ThemeProvider>
      <Button>Hello AIGC</Button>
    </ThemeProvider>
  );
}
```

## I18n

- Use `I18nProvider` with resource bundles when components need localized text.
- Component `texts` props should override provider resources when both exist.

## Motion

- Pass a motion implementation through `ConfigProvider` when components require motion.
- If using `LazyMotion`, pass the `motion/react-m` export instead of the regular `motion` object.

## Checks

- Confirm React, Ant Design, and bundler compatibility before adding components.
- Preserve the host product's existing design system unless the task explicitly adopts Lobe UI.
- Verify theme, dark mode, i18n, and SSR behavior in the target app.
