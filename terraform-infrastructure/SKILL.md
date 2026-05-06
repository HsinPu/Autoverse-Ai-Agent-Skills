---
name: terraform-infrastructure
description: Terraform and OpenTofu infrastructure-as-code workflow for modules, providers, variables, state, plan/apply review, drift detection, imports, workspaces, backends, and safe cloud provisioning. Use when creating, reviewing, or troubleshooting Terraform/OpenTofu configuration rather than doing manual cloud changes.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Terraform Infrastructure

Use this skill when infrastructure should be managed as code with Terraform or OpenTofu.

## Workflow

1. Identify the target cloud, provider versions, backend, workspace, state ownership, and desired resources.
2. Model resources with clear variables, outputs, modules, data sources, and provider aliases only when needed.
3. Run format, validate, plan, and policy/security checks before applying any change.
4. Review plans for creates, updates, destroys, replacement risk, drift, and sensitive values.
5. Apply through the approved CI/GitOps path when available, then verify the provisioned infrastructure.

## Rules

- Treat state as production data; never rewrite, delete, or move it casually.
- Prefer small modules with explicit inputs and outputs over generic abstraction layers.
- Pin provider constraints deliberately and document upgrade expectations.
- Do not hardcode secrets; use secret managers, variables, or platform-native references.
- Avoid manual cloud console changes unless they are part of a documented import or break-glass workflow.

## Handoff

- For Kubernetes workload operations, use `kubernetes-operations`.
- For CI integration and plan checks, use `github-actions-ci`.
- For release rollout verification, use `deployment-operations`.
