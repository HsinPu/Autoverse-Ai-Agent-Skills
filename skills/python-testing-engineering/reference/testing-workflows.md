# Python 測試工程 — 參考資料

Use this reference when writing, refactoring, or stabilizing Python tests and test harnesses.

## 目錄（Table of Contents）

- [觸發時機](#觸發時機)
- [邊界與分工](#邊界與分工)
- [Test Shape](#test-shape)
- [Pytest Baseline](#pytest-baseline)
- [Fixtures](#fixtures)
- [Parametrization](#parametrization)
- [Mocking and Fakes](#mocking-and-fakes)
- [Isolation Helpers](#isolation-helpers)
- [Async Tests](#async-tests)
- [Framework Adapters](#framework-adapters)
- [Flaky Test Triage](#flaky-test-triage)
- [Coverage and CI](#coverage-and-ci)
- [Checklist](#checklist)

---

## 觸發時機

- 編寫或整理 Python tests
- 設計 fixtures / factories / test helpers
- 處理 mocking, monkeypatching, or async test code
- 除掉 flaky tests 或不穩定 assertions
- 讓既有測試更可讀、更可重用

---

## 邊界與分工

- 用 `testing-strategy` 決定 unit / integration / e2e 的分工。
- 用 `python-observability-debugging` 找出為什麼測試或程式失敗。
- 用 `python-development` 處理一般 Python 架構與風格。
- 這份參考專注在 test implementation 本身。

---

## Test Shape

- Each test should prove one behavior.
- Keep arrange / act / assert visible.
- Prefer public behavior over implementation details.
- Make the failure message point to the broken behavior.

```python
def test_total_price_includes_tax() -> None:
    cart = Cart(items=[Item(price=100)])
    assert cart.total_price() == 110
```

---

## Pytest Baseline

- Use `pytest` as the default test runner.
- Use `parametrize` for repeated cases.
- Use markers for slow, integration, or conditional tests.
- Name tests by behavior, not by method implementation.

```python
import pytest


@pytest.mark.parametrize("value, expected", [(1, 2), (2, 3)])
def test_increment(value: int, expected: int) -> None:
    assert value + 1 == expected
```

---

## Fixtures

- Default to function-scoped fixtures.
- Build small fixtures that compose cleanly.
- Use `conftest.py` only for shared, broadly useful setup.
- Avoid fixture chains that hide the real test setup.

```python
import pytest


@pytest.fixture()
def sample_user() -> dict[str, str]:
    return {"id": "u1", "name": "Ada"}
```

---

## Parametrization

- Use parameterization for edge cases, regression cases, and input matrices.
- Keep case names readable when the test matrix grows.
- Prefer explicit values over clever generated tables when the case count is small.

---

## Mocking and Fakes

- Mock at boundaries like HTTP, DB, queue, clock, or filesystem adapters.
- Prefer fakes when you need realistic state transitions.
- Use `Mock`, `MagicMock`, and `AsyncMock` with `spec` when possible.
- Avoid over-asserting call order unless call order is the contract.

```python
from unittest.mock import AsyncMock

client = AsyncMock()
client.fetch.return_value = {"ok": True}
```

---

## Isolation Helpers

- Use `tmp_path` for real filesystem behavior.
- Use `monkeypatch.setenv` and `monkeypatch.chdir` for environment isolation.
- Use `capsys` or `capfd` for stdout and stderr assertions.
- Use `caplog` for log assertions.
- Reset shared state between tests.

```python
def test_reads_env(monkeypatch):
    monkeypatch.setenv("FEATURE_FLAG", "1")
    assert read_flag() is True
```

---

## Async Tests

- Use the project's async plugin consistently.
- Avoid blocking calls inside async tests.
- Await the exact coroutine behavior you want to prove.
- Keep async fixtures as small as sync fixtures.

---

## Framework Adapters

- Use framework-provided test clients and fixtures for integration tests.
- Keep adapter setup in a shared helper when repeated across files.
- If the backend framework defines request flow, keep app structure in the backend skill and test mechanics here.

---

## Flaky Test Triage

- Remove sleeps unless they are the actual behavior under test.
- Remove dependence on wall clock, random order, or shared global state.
- Replace real network calls with deterministic doubles.
- Simplify the fixture graph before raising timeouts.

---

## Coverage and CI

- Treat coverage as a signal, not the goal.
- Fail the build on broken or flaky tests before increasing thresholds.
- Keep test runtime small enough for frequent local execution.
- Split slow or integration-heavy tests into clearly marked groups.

---

## Checklist

- [ ] Test proves one behavior
- [ ] Fixtures are small and explicit
- [ ] Boundary dependencies are isolated
- [ ] Async tests use the right plugin / marker
- [ ] Flaky sources are removed
- [ ] Coverage goal matches the risk
