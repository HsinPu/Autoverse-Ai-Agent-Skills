---
name: kubernetes-operations
description: Operate and deliver Kubernetes workloads through manifests, Helm, GitOps, kubectl diagnosis, rollout control, probes, resources, networking, RBAC, Pod Security, and policy validation. Use when creating, deploying, inspecting, securing, or debugging Kubernetes applications, Helm charts, Argo CD or Flux delivery, or cluster workload configuration.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/Autoverse-Ai-Agent-Skills"
---

# Kubernetes Operations

## Workflow

1. Confirm cluster context, namespace, environment, workload owner, delivery source, and change authority.
2. Inspect desired state in Git before comparing live resources, events, logs, endpoints, and rollout history.
3. Validate images, configuration, secrets references, probes, resources, scheduling, storage, service selectors, and ingress paths.
4. Change the declarative source through plain manifests, Helm, Kustomize, or the repository's GitOps path.
5. Run client and server-side validation, policy checks, diff or plan review, then deploy in a bounded stage.
6. Verify readiness, routing, saturation, disruption behavior, security policy, and rollback.

## Operational Rules

- Never print Secret values or commit rendered credentials.
- Treat readiness, liveness, startup, termination, and disruption as independent contracts.
- Set requests from measured steady-state use and limits from failure containment needs.
- Prefer immutable image digests or release-specific tags.
- Investigate events and ownership chains before restarting or scaling a failing workload.
- Preserve Git as the source of truth when GitOps owns the resource.

## Delivery Choice

- Use plain manifests for a small, stable deployment surface.
- Use Kustomize for environment overlays without templating logic.
- Use Helm for reusable packages with a documented values contract.
- Use Argo CD or Flux when reconciliation, drift detection, and promotion are required.

## References

- Read [references/helm-gitops-security.md](references/helm-gitops-security.md) for chart structure, values design, GitOps promotion, NetworkPolicy, RBAC, Pod Security, and policy-as-code checks.

## Handoff

- Use `docker-development` for image construction.
- Use `terraform-infrastructure` for cluster and cloud resources.
- Use `deployment-operations` for release sequencing and smoke checks.
- Use `observability-engineering` for SLOs, dashboards, and alerts.
