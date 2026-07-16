---
name: vercel-deployment
description: Vercel deployment workflow covering projects, builds, environment variables, preview and production deployments, domains, redirects, functions, edge runtime, Next.js behavior, rollback, observability, and release checks. Use when deploying, debugging, or reviewing apps on Vercel.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/Autoverse-Ai-Agent-Skills"
---

# Vercel Deployment

Use this skill when deploying or debugging a web app on Vercel, especially Next.js, React, frontend frameworks, serverless functions, and preview deployments.

## Core Scope

- Vercel projects, teams, Git integrations, preview deployments, and production deployments
- Build commands, output directories, framework auto-detection, and build cache
- Environment variables, system environment variables, and local env pull
- Serverless functions, Edge Functions, Middleware, and runtime constraints
- Domains, redirects, rewrites, headers, rollback, logs, and production checks

## Workflow

1. Identify the framework, build command, output directory, and package manager.
2. Confirm environment variables for development, preview, and production.
3. Reproduce deployment issues locally with the project build command or Vercel CLI when available.
4. Check build logs before changing application code.
5. Verify runtime assumptions: Node.js version, Edge compatibility, file system access, and secrets.
6. Test preview deployment before promoting or merging to production.
7. Confirm domain, redirects, headers, analytics, and rollback path after release.

## Environment Rules

- Keep secrets in Vercel environment variables, not source code.
- Separate preview and production credentials.
- Use `NEXT_PUBLIC_` only for values that are safe to expose in the browser.
- Pull local env only into ignored files such as `.env.local`.
- Watch Edge runtime environment limits when using Middleware or Edge Functions.

## Deployment Checks

- Confirm `next build` or framework build passes locally.
- Check serverless function logs for runtime-only failures.
- Validate routes that depend on dynamic rendering, caching, ISR, or server actions.
- Confirm webhooks and callback URLs point at the correct deployment.
- Use rollback for production regressions instead of hot-editing risky changes.

## Handoff

- Use `nextjs-development` for Next.js App Router, caching, and server boundary behavior.
- Use `deployment-operations` for release verification and rollback strategy.
- Use `github-actions-ci` when deployment is driven from CI workflows.
- Use `observability-engineering` for production logs, metrics, and alerts.

## References

- Vercel Builds: `https://vercel.com/docs/builds`
- Vercel Environment Variables: `https://vercel.com/docs/projects/environment-variables`
- Vercel System Environment Variables: `https://vercel.com/docs/environment-variables/system-environment-variables`
