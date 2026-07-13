---
name: service-mesh-engineering
description: Evaluate, design, deploy, secure, and operate service meshes using Istio, Linkerd, sidecar or ambient data planes, workload identity, mTLS, authorization policy, traffic routing, retries, timeouts, circuit breaking, canaries, telemetry, upgrades, and rollback. Use when a Kubernetes platform needs uniform service-to-service security, traffic policy, or observability and the operational tradeoffs must be proven.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Service Mesh Engineering

## Fit Check

1. Define the exact security, traffic, identity, or telemetry problem.
2. Compare mesh capabilities with gateway, ingress, platform-native networking, and application-library solutions.
3. Measure latency, resource, control-plane, upgrade, debugging, and operator cost.
4. Reject a mesh when a smaller control plane meets the requirement.

## Workflow

1. Map services, protocols, ports, trust domains, namespaces, identities, dependencies, and failure paths.
2. Select sidecar, ambient, proxyless, or gateway boundaries and document unsupported workloads.
3. Establish workload identity, certificate lifecycle, mTLS mode, authorization, and policy ownership.
4. Align timeouts, retries, outlier detection, circuit behavior, and connection pools across every layer.
5. Introduce routing, canaries, mirroring, fault tests, and policy through a limited workload cohort.
6. Build telemetry and debugging paths before broad enforcement.
7. Validate control-plane and data-plane failure, upgrade, rollback, certificate rotation, and partial adoption.

## Rules

- Prevent retry amplification and timeout inversion.
- Keep authorization deny-by-default and attributable to service owners.
- Do not rely on mTLS alone for application authorization.
- Bound telemetry cardinality and proxy resource overhead.
- Preserve an escape and rollback path during control-plane upgrades.

## References

- Read [references/traffic-security-and-operations.md](references/traffic-security-and-operations.md) for Istio and Linkerd tradeoffs, identity, policy, traffic management, observability, rollout, failure drills, and upgrade checklists.

## Handoff

- Use `kubernetes-operations` for workload and policy delivery.
- Use `observability-engineering` for metrics, traces, dashboards, and SLOs.
- Use `threat-modeling` for trust-boundary analysis.
- Use `deployment-operations` for staged rollout.
