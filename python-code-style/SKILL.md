---
name: python-code-style
description: Enforces consistent Python code style following PEP 8 and common conventions. Use when writing, reviewing, or refactoring Python code; when the user asks for style compliance, formatting, or PEP 8; or when ensuring naming, type hints, and docstrings follow project standards.
license: Apache-2.0
---

# Python 程式碼風格（Python Code Style）

撰寫或審查 Python 程式碼時，依下列規範保持風格一致。以 PEP 8 為基底，必要時可於專案內用 `pyproject.toml` 或 `.flake8` 覆寫。

## 觸發時機

- 使用者要求「符合 PEP 8」「統一風格」「整理格式」
- 撰寫新 Python 程式碼或重構既有程式碼
- 進行 code review 時檢查風格與慣例

---

## 命名（Naming）

| 類型 | 風格 | 範例 |
|------|------|------|
| 模組、套件 | `snake_case` | `user_service.py`, `data_loader` |
| 類別 | `PascalCase` | `UserRepository`, `HTTPClient` |
| 函式、方法、變數 | `snake_case` | `get_user_by_id`, `max_retries` |
| 常數 | `UPPER_SNAKE_CASE` | `MAX_SIZE`, `DEFAULT_TIMEOUT` |
| 私有 | 前綴單底線 | `_internal_helper` |
| 避免與關鍵字衝突 | 尾綴底線 | `class_`, `type_` |

- 名稱要有意義，避免單字元（迴圈用 `i`, `j`, `k` 可接受）。
- 布林變數/回傳值建議用 `is_`, `has_`, `should_` 等前綴。

---

## 格式（Formatting）

- **縮排**：4 個空格，不用 tab。
- **行寬**：建議每行 ≤ 88 字元（Black 預設）；若專案未指定，可用 88 或 100。
- **空行**：頂層定義之間 2 行；類別內方法之間 1 行。
- **空白**：
  - 運算符號兩側各一空格：`a + b`，`x == 1`。
  - 逗號後一空格：`func(a, b, c)`。
  - 括號、方括號內不強制空格：`[1, 2, 3]`，`(x, y)`。
- **結尾**：檔案以單一新行結尾。

```python
# 好的寫法
def calculate_total(items: list[float], discount: float = 0.0) -> float:
    return sum(items) * (1 - discount)

# 避免：運算符擠在一起、多餘空白
def bad( a,b ):
    return a+b
```

---

## 匯入（Imports）

- 順序：標準庫 → 第三方 → 專案本地，各組之間空一行。
- 每組內依字母排序。
- 一行一個模組；同一模組多個名稱可同一行，但不宜過長。

```python
import os
import sys
from pathlib import Path

import requests
from django.conf import settings

from myapp.models import User
from myapp.utils import format_date
```

- 避免 `from module import *`（除明確的 `__all__` 公開 API）。
- 未使用的匯入應刪除。

---

## 型別註解（Type Hints）

- 公開 API（函式參數、回傳值）建議加上型別註解。
- 使用 `list[T]`, `dict[K, V]`（Python 3.9+）或 `List[T]`, `Dict[K, V]`（3.8 需 `from typing import`）。
- 可為 `None` 的參數用 `Optional[T]` 或 `T | None`（3.10+）。
- 僅在需要時使用 `Any`；可先考慮 `object` 或更具體型別。

```python
from typing import Optional

def find_user(user_id: int, include_inactive: bool = False) -> Optional[dict]:
    ...
```

---

## Docstring

- 模組：簡短說明用途；若有公開 API，可列重點。
- 類別：說明職責與使用情境。
- 函式／方法：一句摘要；必要時補充 Args / Returns / Raises。

風格擇一並一致（Google / NumPy / Sphinx 等）。範例（Google 風格）：

```python
def parse_config(path: str, encoding: str = "utf-8") -> dict:
    """從檔案路徑讀取並解析設定檔。

    Args:
        path: 設定檔路徑。
        encoding: 檔案編碼，預設 utf-8。

    Returns:
        解析後的鍵值對。

    Raises:
        FileNotFoundError: 當 path 不存在時。
    """
    ...
```

---

## 程式結構與慣例

- **函式長度**：單一職責，過長時拆成小函式。
- **類別**：依 `__init__`、`@property`、公開方法、私有方法排序。
- **比較**：與 `None` 用 `is None` / `is not None`；布林不用 `== True` / `== False`。
- **字串**：偏好 `"` 或 `'` 擇一；多行用三引號 `"""`。
- **例外**：捕捉具體例外，避免裸 `except:`；必要時用 `except Exception` 並記錄。

```python
# 建議
if value is None:
    return default
if items:
    process(items)

# 避免
if value == None:
if len(items) > 0:
```

---

## 工具建議

- **格式化**：Black（預設 88 字元）、Ruff format。
- **檢查**：Ruff、Flake8、Pylint；型別檢查用 pyright 或 mypy。
- 專案內若有 `pyproject.toml`、`ruff.toml` 或 `.flake8`，以專案設定為準。

---

## 檢查清單（撰寫／審查時）

- [ ] 命名符合 PEP 8 與上表
- [ ] 縮排 4 空格、行寬與空行一致
- [ ] 匯入分組、排序、無未使用匯入
- [ ] 公開函式有型別註解與簡要 docstring
- [ ] 無裸 `except`、與 `None` 比較用 `is` / `is not`
- [ ] 與專案既有風格一致（含引號、註解風格）
