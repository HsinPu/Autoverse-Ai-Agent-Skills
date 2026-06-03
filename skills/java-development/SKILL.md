---
name: java-development
description: Java development guide covering code style, naming, formatting, Javadoc, exceptions, and design patterns such as SOLID, composition, dependency injection, and immutability. Use when writing, reviewing, or refactoring Java code, or when deciding Java structure and conventions.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Java Development

Use this skill for general Java implementation, review, and refactoring decisions.

## Workflow

1. Inspect the project style: Java version, build tool, package layout, formatter, test framework, and framework conventions.
2. Keep types, packages, and method boundaries aligned with the existing architecture.
3. Use clear names, small methods, explicit error handling, and immutable values where practical.
4. Apply object-oriented patterns only when they reduce real coupling or duplication.
5. Verify with the narrowest relevant unit, integration, build, or static-analysis command.

## Reference Routing

- Code style, naming, formatting, Javadoc, and exceptions: read [reference/code-style.md](reference/code-style.md).
- SOLID, dependency injection, composition, immutability, and pattern choices: read [reference/design-patterns.md](reference/design-patterns.md).
- Refactoring tactics and Java code smells: read [reference/refactoring.md](reference/refactoring.md).

## Rules

- Prefer composition and dependency injection over hidden global state.
- Keep domain logic out of controllers, adapters, and persistence mapping code.
- Do not introduce a framework abstraction when a local plain Java boundary already exists.
- Preserve public APIs unless the user explicitly asked for a breaking change.

## Handoff

- For Spring or Spring Boot services, use `spring-development`.
- For Java tests, use `java-testing`.
- For persistence with JPA/Hibernate or MyBatis, use `jpa-hibernate-development` or `mybatis-development`.
