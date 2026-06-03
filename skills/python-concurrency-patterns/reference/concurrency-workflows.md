# Python 並行與協調模式 — 參考資料

Use this reference when a Python system needs coordinated concurrent work.

## 目錄（Table of Contents）

- [觸發時機](#觸發時機)
- [邊界與分工](#邊界與分工)
- [Concurrency Model](#concurrency-model)
- [Task Groups](#task-groups)
- [Cancellation](#cancellation)
- [Backpressure](#backpressure)
- [Queues and Pipelines](#queues-and-pipelines)
- [Shared State](#shared-state)
- [Worker Coordination](#worker-coordination)
- [Verification](#verification)
- [Checklist](#checklist)

---

## 觸發時機

- Fan out or fan in async work
- Coordinate multiple jobs, streams, or worker tasks
- Limit throughput with backpressure or concurrency caps
- Handle cancellation, timeout, or partial failure cleanly
- Refactor a hard-to-follow concurrent flow

---

## 邊界與分工

- 用 `python-development` 處理一般 async I/O、typing、style。
- 用 `python-backend-development` 處理 framework-specific worker flows。
- 用 `python-observability-debugging` 處理 race conditions、hangs、slowdowns。
- 這份參考專注在協調、限流與取消語意。

---

## Concurrency Model

- Choose the simplest model that matches the work.
- Use async for I/O-bound coordination.
- Use threads or processes only when the workload justifies them.
- Avoid mixing models unless there is a clear boundary.

---

## Task Groups

- Prefer structured concurrency when available.
- Make task ownership explicit.
- Collect and handle exceptions in one place.
- Avoid orphaned tasks.

```python
async def run_all(items: list[str]) -> None:
    async with asyncio.TaskGroup() as tg:
        for item in items:
            tg.create_task(process(item))
```

---

## Cancellation

- Treat cancellation as normal control flow.
- Propagate cancellation unless there is a clear reason not to.
- Clean up resources deterministically.
- Keep timeout handling close to the task boundary.

---

## Backpressure

- Limit in-flight tasks with semaphores, queues, or bounded pools.
- Make queue growth visible.
- Do not spawn unbounded tasks.
- Match producer rate to downstream capacity.

---

## Queues and Pipelines

- Use queues to separate stages when work naturally forms a pipeline.
- Keep stage contracts simple and explicit.
- Decide how to signal completion and failure across stages.
- Make shutdown and drain behavior explicit.

---

## Shared State

- Minimize shared mutable state.
- Protect state with locks only when needed.
- Prefer message passing or ownership boundaries.
- Document whether state is immutable, single-writer, or synchronized.

---

## Worker Coordination

- Make worker count, batch size, and retry policy explicit.
- Keep per-worker responsibility narrow.
- Distinguish transient failures from permanent ones.
- Ensure workers exit cleanly on shutdown.

---

## Verification

- Test cancellation, timeout, and partial failure paths.
- Verify concurrency limits are respected.
- Check that queue growth stays bounded under load.
- Reproduce race-prone behavior with small deterministic inputs where possible.

---

## Checklist

- [ ] Concurrency model is explicit
- [ ] Task ownership is clear
- [ ] Cancellation is handled cleanly
- [ ] Concurrency is bounded
- [ ] Shared state is minimized
- [ ] Shutdown and failure paths are verified
