---
name: spring-development
description: Read when building Spring / Spring Boot applications. Provides best practices for layering, dependency injection, configuration, web APIs, data access, security, testing, and observability.
always: true
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Spring 開發（Spring Development）

**在撰寫或維護 Spring / Spring Boot 專案時請讀取本 skill。**

本 skill 以「官方 reference docs」為優先依據，提供偏實務的最佳做法：專案結構、DI 與設定管理、REST API、資料存取與交易、Spring Security、測試策略、以及 Actuator/Observability。

## 適用範圍（Assumptions）

- 預設以現代版本為主：Spring Boot 3+ / Spring Framework 6+（或更高）
- 以 **Spring Boot** 當作預設組態管理與建置入口；若是純 Spring Framework（無 Boot），本 skill 會明確標註差異與替代做法

## 進階與參考（Bundled resources）

- **專案結構與分層**：controller/service/repository、DTO、configuration 與 boundary，見 [reference/project-structure.md](reference/project-structure.md)。
- **DI 與組態**：constructor injection、`@ConfigurationProperties`、profiles、環境變數、依賴邊界，見 [reference/di-and-configuration.md](reference/di-and-configuration.md)。
- **Web API**：REST 設計、validation、例外處理、錯誤回應、序列化、API versioning，見 [reference/web-api.md](reference/web-api.md)。
- **Data/JPA**：transaction、N+1、fetch 策略、repository 設計、migration，見 [reference/data-jpa.md](reference/data-jpa.md)。
- **Security**：認證/授權、CSRF、headers、resource server，見 [reference/security.md](reference/security.md)。
- **Testing**：test slicing、`@SpringBootTest`、MockMvc/WebTestClient、Testcontainers，見 [reference/testing.md](reference/testing.md)。
- **Observability/Actuator**：health/metrics/tracing、production endpoints 暴露策略，見 [reference/observability.md](reference/observability.md)。

---

## 外部參考（官方）

- Spring Boot Reference：`https://docs.spring.io/spring-boot/`
- Spring Framework Reference：`https://docs.spring.io/spring-framework/reference/`
- Spring Framework（Java-based config）：`https://docs.spring.io/spring-framework/reference/core/beans/java.html`
- Spring Framework（Environment abstraction）：`https://docs.spring.io/spring-framework/reference/core/beans/environment.html`
- Spring Boot Actuator：`https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html`
- Spring Boot Testing：`https://docs.spring.io/spring-boot/docs/current/reference/html/testing.html`
- Spring Security Reference：`https://docs.spring.io/spring-security/reference/`
- Spring Data JPA Reference：`https://docs.spring.io/spring-data/jpa/reference/`
