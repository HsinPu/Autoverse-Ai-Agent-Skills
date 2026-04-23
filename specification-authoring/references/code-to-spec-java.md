# Code → Spec inventory (Java / JVM)

Table of contents: [Identify the stack](#identify-the-stack) · [Entry and bootstrap](#entry-and-bootstrap) · [HTTP surface](#http-surface) · [Security](#security) · [Data layer](#data-layer) · [Messaging and jobs](#messaging-and-jobs) · [Integrations](#integrations) · [Configuration and ops](#configuration-and-ops) · [Tests](#tests) · [Map to Spec chapters](#map-to-spec-chapters)

Use this sheet when the repository is **primarily Java** (single module or multi-module Maven/Gradle). Combine with the generic steps in **code-to-spec-workflow** (same skill: scope → inventory → map → uncertainty). Do not treat this as a tutorial; it is a **scan checklist** for Spec drafting.

## Identify the stack

- **Build**: `pom.xml` (Maven) or `build.gradle` / `build.gradle.kts` (Gradle). Read **Java version**, **Spring Boot** or other framework version if declared.
- **Framework signals**: `spring-boot-starter-*`, `quarkus`, `micronaut`, `jakarta.*` / `javax.*` package prefixes, `META-INF/spring.factories` / `AutoConfiguration`.

## Entry and bootstrap

- Locate `@SpringBootApplication` (or equivalent main class) and `public static void main`.
- Note **profiles** (`spring.profiles.active`) and multi-module **artifact** boundaries (which JAR/WAR is the runnable service).

## HTTP surface

- **Spring MVC / Web**: classes with `@RestController`, `@Controller`, `@RequestMapping` / `@GetMapping` / `@PostMapping`, path prefixes on class and method.
- **WebFlux**: `RouterFunction`, `Handler`, `WebFlux` controllers—extract paths and HTTP methods from code (and router beans).
- **JAX-RS**: `@Path`, `@GET`, `@POST` if present.
- **OpenAPI**: `springdoc-openapi`, `swagger-core` annotations (`@Operation`, `@Tag`), or `openapi.yaml` / `swagger` resources—use for **4.x.3** tables when available.

Record per endpoint: **method, path, request/response types, status codes** visible in annotations or global `@ControllerAdvice` / exception handlers.

## Security

- `SecurityFilterChain`, `WebSecurityConfigurerAdapter` (legacy), `@EnableWebSecurity`, `OncePerRequestFilter`, OAuth2 resource server config.
- Extract: **which paths are public vs authenticated**, roles (`@PreAuthorize`, `hasRole`), JWT/cookie/session hints.

## Data layer

- **JPA**: `@Entity`, `@Table`, `@Id`, relationships; `JpaRepository` / `CrudRepository` interfaces; `@Query` methods.
- **MyBatis**: mapper **interfaces** (`@Mapper`) and **XML** under `resources` (statements, `resultMap`, dynamic SQL).
- **JDBC**: `JdbcTemplate`, named parameter templates—note SQL location.
- **Migrations**: Flyway (`db/migration`), Liquibase `changelog`—for schema history in **4.x.1**.
- **Transactions**: `@Transactional` boundaries—useful for **4.x.2** flow description.

## Messaging and jobs

- **Spring**: `@KafkaListener`, `@RabbitListener`, `@JmsListener`; `RabbitTemplate`, `KafkaTemplate`.
- **Scheduling**: `@Scheduled`, Quartz config.
- Map each listener to a **feature** or **integration** in Ch.3/Ch.4.

## Integrations

- **HTTP clients**: `RestTemplate`, `WebClient`, OpenFeign `@FeignClient`, Micronaut HTTP client—note **base URL**, paths, and config keys.
- **SDKs**: AWS SDK, GCP clients—grep `software.amazon.awssdk`, `com.google.cloud`.

## Configuration and ops

- `application.yml` / `application.properties`, profile-specific `application-{profile}.yml`.
- List **meaningful keys** (URLs, pools, feature flags)—for **Ch.6**; redact secrets in the Spec (describe variable name only).
- **Docker**: `Dockerfile`, `Jib`, **K8s** `Deployment` / `ConfigMap` / `Secret` references—link env vars to config keys when traceable.

## Tests

- `src/test/java`: `@SpringBootTest`, `@WebMvcTest`, `@DataJpaTest`, Testcontainers usage.
- Summarize **coverage type** (unit vs slice vs integration) for **Ch.7**; do not claim coverage percentage unless reported by tooling.

## Map to Spec chapters

| Spec area | Java-oriented sources |
| :--- | :--- |
| Ch.2 技術堆疊 | `pom.xml` / Gradle, `java.version`, starter dependencies |
| Ch.3 功能 / 用法 | Controllers + user-visible flows; listeners as “entry points” |
| Ch.4 DB | Entities + migrations + repositories / mappers |
| Ch.4 邏輯 | `@Service`, domain services, validation, transaction boundaries |
| Ch.4 API | Controller signatures + DTOs + global exception mapping |
| Ch.6 | `application*.yml`, Docker/K8s, JVM opts if documented |

## Uncertainty

- Generated code (MapStruct, OpenAPI generator): describe **contract** in Spec, point to generator config rather than pasting all generated lines.
- If behavior is only in **bytecode** or external libs, mark **待確認** and name the dependency.
