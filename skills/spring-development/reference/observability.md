# Observability / Actuator

## Actuator 基本原則

- **production endpoints 不要全開**：只暴露需要的（health/info/metrics 等）。
- Actuator endpoint 需要保護（網路層或 auth）。

## Health / Readiness

- 設計 readiness/liveness 指標，避免「DB 掛了但還回 200」。

## Metrics / Tracing

- 用 Micrometer 指標，配合 Prometheus/Grafana。
- tracing 要有 correlation id（trace/span），並在 log/response 之間對得起來。

---

## 參考

- Spring Boot Actuator Reference：https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html
