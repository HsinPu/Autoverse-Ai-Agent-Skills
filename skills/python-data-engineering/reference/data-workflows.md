# Python 資料工程與分析 — 參考資料

Use this reference when the work centers on dataframe transformations, ETL/ELT jobs, notebook analysis, or file-based datasets.

## 目錄（Table of Contents）

- [觸發時機](#觸發時機)
- [邊界與分工](#邊界與分工)
- [工具選擇](#工具選擇)
- [資料契約](#資料契約)
- [讀取與剖析](#讀取與剖析)
- [清理與正規化](#清理與正規化)
- [Join 與聚合](#join-與聚合)
- [檔案格式](#檔案格式)
- [Notebook Workflow](#notebook-workflow)
- [驗證與測試](#驗證與測試)
- [效能](#效能)
- [Pipeline Shape](#pipeline-shape)
- [檢查清單](#檢查清單)

---

## 觸發時機

- 清理、轉換、合併或匯出 tabular data
- 設計可重跑的資料管線
- 把 notebook 探索轉成可維護程式
- 選擇 pandas、Polars、DuckDB、PyArrow、Parquet、CSV 時

---

## 邊界與分工

- 用 `spreadsheet-ops` 處理 workbook、公式、格式與圖表。
- 用 `database-design` 或 `sql-best-practices` 處理 schema、migration、query tuning。
- 用 `python-development` 處理一般 Python 架構、包裝與風格。
- 用這份參考處理 dataframe、檔案管線與資料驗證。

---

## 工具選擇

| 情境 | 首選 | 原因 |
|---|---|---|
| 熟悉、通用的 dataframe 工作 | `pandas` | API 成熟、相容性高 |
| 大資料或 lazy pipeline | `polars` | 欄式儲存、平行化、lazy execution |
| 以 SQL 查檔案 | `duckdb` | join、group by、scan file 很方便 |
| 讀寫 Parquet / Arrow | `pyarrow` | schema fidelity 高 |
| 探索、說明、試算 | `jupyter` | 先探索，再移到 `.py` |

```python
import pandas as pd

df = pd.read_csv(
    "input.csv",
    usecols=["user_id", "country", "created_at", "amount"],
    dtype={"user_id": "string", "country": "string", "amount": "float64"},
    parse_dates=["created_at"],
)
```

---

## 資料契約

- 定義欄位名稱、型別、主鍵、時間欄位與單位。
- 明確處理缺值，不要讓隱含推論決定語意。
- 在 ingest 階段就固定時區、日期格式與編碼。
- 對外部資料先做 schema check，再進入變換流程。

```python
from dataclasses import dataclass


@dataclass(frozen=True)
class DatasetContract:
    user_id: str
    created_at: str
    amount: str
```

---

## 讀取與剖析

- 只讀需要的欄位。
- 大檔案用 chunked read 或 lazy scan。
- 不要在最後才修型別；盡早固定 dtype。
- 保留 raw input 的副本或快照，避免覆蓋原始資料。

```python
import polars as pl

lazy = (
    pl.scan_csv("input.csv")
    .select(["user_id", "country", "amount"])
    .filter(pl.col("amount") > 0)
)
```

---

## 清理與正規化

- 標準化欄名、字串大小寫、日期格式與缺值表示法。
- 拆開結構性清理與語意性修正。
- 對重複資料設計明確規則，不要默默覆蓋。
- 優先用向量化操作，避免逐列 `apply`。

```python
def normalize_country(value: str | None) -> str | None:
    if value is None:
        return None
    return value.strip().upper()
```

---

## Join 與聚合

- 先驗證 join key 是否唯一。
- 先確認 join 前後 row count 的變化是否合理。
- 明確選擇 `inner`、`left`、`right` 或 `outer`，不要讓預設值決定商業語意。
- 在正確的 grain 上做 aggregation，不要先聚合再補資料。

```python
import pandas as pd

left = pd.DataFrame({"user_id": [1, 2], "country": ["TW", "JP"]})
right = pd.DataFrame({"user_id": [1, 2], "amount": [10, 20]})
result = left.merge(right, on="user_id", how="left", validate="one_to_one")
```

---

## 檔案格式

- 用 CSV 做互通，不要期待它保留複雜型別。
- 用 Parquet 做重複讀取、欄式壓縮與 schema 保真。
- 用 JSON / NDJSON 處理事件、巢狀資料或 log-like records。
- 用 Excel 只做人工交付，不要把它當 pipeline 的核心格式。

```python
import duckdb

df = duckdb.sql("""
    SELECT country, count(*) AS n
    FROM read_parquet('data/*.parquet')
    GROUP BY country
    ORDER BY n DESC
""").df()
```

---

## Notebook Workflow

- 用 notebook 做探索、說明與試驗。
- 把穩定的邏輯移到 module 或 script。
- 在分享前重啟 kernel 並重新執行全部 cell。
- 不要讓 hidden state 成為結果來源。

---

## 驗證與測試

- 檢查 row count、key uniqueness、null ratio、數值範圍與總和。
- 使用小型 fixture 與 golden output。
- 對 deterministic pipeline，比對前後輸出的差異。
- 若資料規則很多，把 schema checks 和 business checks 分開。

```python
def test_non_negative_amounts(frame):
    assert (frame["amount"] >= 0).all()
```

---

## 效能

- 先縮欄位，再縮列數。
- 用 lazy execution、streaming、chunking 或 partitioning 處理大資料。
- 避免不必要的 copies 與 row-wise loops。
- 重複字串可考慮 category / dictionary encoding。
- 先量測，再優化。

---

## Pipeline Shape

- 把管線拆成 `load -> validate -> transform -> aggregate -> export`。
- 讓每個 stage 接受資料、回傳資料。
- 把路徑、閾值、欄位名與格式選項放進 config。
- 讓輸出可重跑、可比較、可追蹤。

```python
def run_pipeline(source_path: str, output_path: str) -> None:
    frame = load_source(source_path)
    validate_source(frame)
    frame = transform(frame)
    frame = aggregate(frame)
    export_output(frame, output_path)
```

---

## 檢查清單

- [ ] 資料契約已定義
- [ ] join key 與 grain 已確認
- [ ] null / duplicate / range 規則已明確
- [ ] 選擇的工具與資料量相符
- [ ] Notebook 中的邏輯已抽到可重用模組
- [ ] 輸出可重跑、可驗證、可比較
- [ ] 不需要的 spreadsheet / SQL / app 架構內容沒有混進來
