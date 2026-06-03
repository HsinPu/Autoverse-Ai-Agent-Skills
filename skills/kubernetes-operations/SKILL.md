---
name: kubernetes-operations
description: Kubernetes operations workflow for manifests, kubectl diagnosis, Deployments, Services, Ingress, ConfigMaps, Secrets, probes, resources, rollouts, logs, events, and troubleshooting cluster workloads. Use when deploying, inspecting, or debugging applications running on Kubernetes.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Kubernetes Operations

Use this skill when the task involves Kubernetes workloads or cluster behavior.

## Workflow

1. Identify namespace, context, workload type, image, config, service exposure, and desired state.
2. Inspect resources with `kubectl get`, `describe`, logs, events, rollout status, and endpoints.
3. Check probes, resource requests/limits, environment variables, mounts, secrets, and service selectors.
4. Apply manifest changes through the repo's deployment path instead of ad hoc cluster edits when possible.
5. Verify rollout health, pod readiness, service routing, ingress behavior, and rollback plan.

## Rules

- Confirm kube context and namespace before reading or changing cluster resources.
- Do not print Secret values; reference names and keys only.
- Prefer declarative manifests or GitOps paths over manual `kubectl edit` changes.
- Treat readiness/liveness/startup probes and resource limits as production behavior, not optional YAML.
- Investigate `CrashLoopBackOff`, `ImagePullBackOff`, pending pods, and failed probes from events outward.

## Handoff

- For building container images, use `docker-development`.
- For release rollout and smoke checks, use `deployment-operations`.
- For Spring service boundaries and cloud-native design, use `spring-cloud-microservices`.
