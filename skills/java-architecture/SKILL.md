---
name: java-architecture
description: Define and migrate Java or Spring package, module, dependency, bounded-context, and service boundaries using Clean Architecture, hexagonal architecture, ports and adapters, and DDD. Use when a request explicitly concerns architecture, Java monolith decomposition, controller-service-repository coupling, vertical-slice migration, package or module cycles, domain and framework separation, or microservice boundaries; use project-architecture-review first for repo-wide cross-language diagnosis.
license: Apache-2.0
metadata:
  author: "HsinPu"
  source: "HsinPu/CraftRoster"
---

# Java Architecture

在設計或重構 Java 後端架構時使用本 skill。它聚焦 architecture boundaries；實作細節依需要搭配 `java-development`、`spring-development`、`jpa-hibernate-development`、`mybatis-development`、`java-testing`。

若需求是整個 repo 或跨語言系統的架構診斷、目標架構比較、遷移路線規劃，先使用 `project-architecture-review`；再回到本 skill 處理 Java / Spring 的 Clean Architecture、DDD 與 package boundary 細節。

## Java Baseline Gate

When architecture work creates, moves, changes, or plans a migration of Java source, public types, package boundaries, or runtime behavior, read the sibling [`../java-development/SKILL.md`](../java-development/SKILL.md) before planning, even when that skill was omitted from the runtime's initial metadata list. A migration or refactoring plan counts as Java implementation planning even when the current turn is read-only and creates no files. Keep this skill responsible for dependency direction, bounded contexts, ports, adapters, and migration shape while `java-development` owns Java language, API, exception, resource, and compatibility decisions. Only a current-state architecture assessment that proposes no Java implementation or migration may remain with this skill alone.

When the migration requires characterization, regression, ArchUnit, or package-boundary tests, also read the sibling [`../java-testing/SKILL.md`](../java-testing/SKILL.md) before planning. Keep `java-testing` responsible for test level, fixtures, determinism, assertions, and architecture-test mechanics.

## When To Use

- 設計新 Java / Spring backend service 的 package、module、layer boundary。
- 把 controller/service/repository 混雜的程式重構成可測、可替換的結構。
- 導入 Clean Architecture、Hexagonal Architecture、Ports and Adapters、DDD。
- 規劃 microservice boundary、bounded context、aggregate ownership。
- 需要隔離 Spring、ORM、message broker、external SDK 對 domain logic 的影響。

## Workflow

1. Identify the bounded context, core use cases, current package structure, and framework dependencies.
2. Map inbound adapters, application/use-case logic, domain rules, outbound ports, and infrastructure adapters.
3. Choose the smallest boundary change that improves dependency direction without rewriting the system.
4. Protect behavior with tests before moving orchestration or persistence details.
5. Migrate one vertical slice at a time and verify package boundaries, tests, and external contracts.

## Core Rules

- Dependency direction points inward: adapters depend on application/domain, not the reverse.
- Domain model does not import Spring, JPA, HTTP, messaging, SDK, or persistence-specific classes.
- Use cases orchestrate behavior; adapters translate protocols and infrastructure details.
- Ports model capabilities, not technologies: `PaymentGateway`, not `StripeClientPort` unless Stripe is the domain.
- Keep wiring in a composition root: Spring configuration, module factory, or application bootstrap.

## Suggested Java Package Layout

```text
com.example.orders
  domain
    model
    event
    policy
  application
    port.in
    port.out
    usecase
  adapter.in.web
  adapter.in.messaging
  adapter.out.persistence
  adapter.out.client
  config
```

Feature-first packaging is usually better than global `controller/service/repository` folders when the system has multiple bounded contexts.

## Layer Responsibilities

- **Domain**：entities、value objects、domain services、domain events、business invariants。
- **Application**：use cases、commands/queries、transaction boundary intent、ports。
- **Inbound adapters**：REST controllers、CLI handlers、scheduled jobs、message consumers。
- **Outbound adapters**：JPA/MyBatis repositories、HTTP clients、message publishers、file/storage gateways。
- **Configuration**：Spring wiring、bean creation、profile-specific infrastructure choices。

## DDD Guidance

- Define bounded contexts using language and ownership, not database tables.
- Keep aggregate boundaries small; one transaction should update one aggregate when possible.
- Use value objects for validated concepts such as `Email`, `Money`, `OrderId`, `DateRange`.
- Publish domain events for meaningful business facts, not every technical state change.
- Repositories load and save aggregate roots; avoid exposing ORM query objects into domain/application layers.

## Spring Integration

- Spring annotations are acceptable in adapters and configuration.
- Keep use cases as plain constructor-injected classes when possible; using `@Service` is acceptable but should not leak Spring APIs into method signatures.
- Put `@Transactional` at application service/use-case boundary or adapter boundary consistently; avoid hidden transaction behavior in domain objects.
- Controllers map HTTP DTOs to use-case commands and map results/errors back to HTTP responses.

## Migration Playbook

1. Pick one vertical slice with frequent change pain.
2. Add characterization tests around current behavior.
3. Extract a use-case input/output boundary.
4. Wrap persistence, external clients, clock, UUID, and event publishing behind outbound ports.
5. Move orchestration out of controllers and framework-heavy services.
6. Keep old adapters delegating to the new use case until behavior is stable.
7. Repeat slice-by-slice; avoid big-bang rewrites.

## Testing Strategy

- Domain tests use no Spring context and no mocks.
- Use-case tests use fake ports and assert behavior plus emitted effects.
- Adapter integration tests use real infrastructure where mapping or protocol behavior matters.
- End-to-end tests cover only critical flows; do not use them as the only safety net.

## Avoid

- Domain entities annotated as both API DTOs and persistence records when the model is non-trivial.
- Use cases depending on `HttpServletRequest`, `ResponseEntity`, JPA `EntityManager`, SDK clients, or queue metadata.
- Anemic domain plus giant transaction scripts for complex business rules.
- Splitting into microservices before bounded contexts, ownership, data consistency, and operational cost are clear.
- Architecture ceremony for simple CRUD modules with low change pressure.

## Handoff

- Use `project-architecture-review` for repo-wide architecture diagnosis or cross-language migration planning.
- Use `spring-development` for Spring Boot application structure, DI, REST, configuration, and testing implementation.
- Use `jpa-hibernate-development` or `mybatis-development` for persistence mapping details.
- Use `java-development` for general Java code style, APIs, and language-level refactoring.
- Use `incremental-implementation` when the architecture migration needs small verified slices.
