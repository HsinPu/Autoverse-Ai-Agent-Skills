# Modern Java Workflow

Read this reference when Java version choice, newer language features, concurrency, resource ownership, data boundaries, or public compatibility affects the implementation.

## Runtime And Toolchain Baseline

- Read the Maven compiler release, Gradle toolchain, wrapper version, CI JDK, container base image, and production runtime before using a language or library feature.
- Prefer the repository's declared baseline. Do not infer support from the JDK installed on the current machine.
- Verify whether preview or incubating features are allowed by the project before using them. Keep compiler, test, CI, packaging, and runtime flags aligned.
- Libraries must respect the consumer class-file baseline, not only the maintainer's local runtime.

## Domain And Type Modeling

- Use records for transparent immutable data carriers when record semantics, equality, and construction rules fit the domain.
- Use sealed hierarchies and exhaustive switches when the variant set is intentionally closed; use ordinary interfaces when third-party extension is part of the contract.
- Keep generic bounds and variance understandable at call sites. Do not hide runtime type assumptions behind unchecked casts or raw types.
- Model absence deliberately. Use `Optional` mainly for return values where absence is expected; do not use it to avoid defining required fields or validation.
- External JSON, messages, rows, environment values, and user input still need runtime validation even when a serializer produces a typed Java object.

## Exceptions And Resource Lifetime

- Throw exceptions at the abstraction level callers can act on, preserving the original cause when translation adds useful context.
- Do not catch broad exceptions unless the boundary owns logging, mapping, rollback, retry, or shutdown behavior.
- Use try-with-resources for owned `AutoCloseable` values. Document ownership when a stream, client, executor, transaction, or connection outlives one method.
- When catching `InterruptedException`, normally restore the interrupt flag or propagate cancellation according to the surrounding contract.

## Concurrency

- Choose a concurrency model from the workload and declared Java version: synchronous execution, bounded executors, `CompletableFuture`, virtual threads, reactive streams, or framework-managed tasks.
- Make executor ownership, queue bounds, cancellation, timeout, context propagation, and shutdown behavior explicit.
- Do not mix blocking calls into Reactor event-loop paths. Do not assume virtual threads remove the need for timeouts, backpressure, connection-pool limits, or thread-safe state.
- Verify the declared Java version and project policy before using structured concurrency, scoped values, or other features whose availability may differ by release.

## Public Compatibility

- Before changing an exported class, method, field, record component, generic bound, exception, annotation, or serialization shape, identify source, binary, behavioral, and data compatibility requirements.
- Adding an overload can change resolution; changing generic signatures can affect erasure and consumers; changing records or serialized types can break stored or wire data.
- For published libraries, use the repository's API compatibility or binary compatibility tooling when available, in addition to compilation and tests.
- For services, verify request, response, event, database, and error compatibility separately from Java compilation.

## Verification

- Use the repository wrapper and declared toolchain.
- Run the narrowest affected test first, followed by the owning module's check or verify task.
- Include compiler warnings, static analysis, formatting, architecture tests, concurrency or cancellation cases, and compatibility checks when the change touches those risks.
