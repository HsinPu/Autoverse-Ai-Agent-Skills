# Python 自動化與腳本 — 參考資料

Use this reference when building scripts that automate files, commands, or operational workflows.

## 目錄（Table of Contents）

- [觸發時機](#觸發時機)
- [邊界與分工](#邊界與分工)
- [腳本形狀](#腳本形狀)
- [I/O 與路徑](#io-與路徑)
- [子程序](#子程序)
- [CLI 設計](#cli-設計)
- [批次與排程](#批次與排程)
- [錯誤處理](#錯誤處理)
- [Dry Run 與日誌](#dry-run-與日誌)
- [測試](#測試)
- [檢查清單](#檢查清單)

---

## 觸發時機

- 自動化重複性操作
- 包裝 shell command、第三方工具或系統指令
- 做檔案整理、批次搬移、重命名、清理
- 建立命令列工具
- 排程定期作業或小型運維腳本

---

## 邊界與分工

- 用 `python-development` 處理一般 Python 架構、包裝、型別與風格。
- 用 `python-data-engineering` 處理 dataframe / ETL / 分析管線。
- 用 `python-web-scraping` 處理 HTML 擷取與 crawling。
- 這份參考專注在本機自動化、命令封裝、檔案操作與批次腳本。

---

## 腳本形狀

- 小腳本可直接是單一 `main()`。
- 重複使用的命令群組可用子命令結構。
- 把核心邏輯與 CLI 解析分開。
- 將危險操作包成獨立函式，便於測試與 dry-run。

```python
from pathlib import Path


def main() -> int:
    root = Path.cwd()
    for path in root.glob("*.tmp"):
        path.unlink()
    return 0
```

---

## I/O 與路徑

- 用 `pathlib.Path` 代替字串拼路徑。
- 先檢查檔案 / 目錄存在，再執行變更。
- 寫入前先決定覆蓋規則與備份策略。
- 大量檔案處理時，先遍歷再修改，不要在同一層迴圈裡混雜多個副作用。

---

## 子程序

- 用 `subprocess.run(..., check=True, capture_output=True, text=True, timeout=...)`。
- 不要把可避免的 shell string 傳給 shell。
- 需要串接時，優先傳參數陣列。
- 明確處理 exit code 與 stderr。

```python
import subprocess


result = subprocess.run(
    ["git", "status", "--short"],
    check=True,
    capture_output=True,
    text=True,
    timeout=30,
)
```

---

## CLI 設計

- 讓 help text 直接說明動作。
- 預設安全，危險行為要顯式開啟。
- `--dry-run` 應該顯示即將做什麼。
- 回傳可預期的 exit code。
- 適合時再用 `click` 或 `typer`，不必每個 script 都上框架。

---

## 批次與排程

- 對可重跑任務，加上 checkpoint 或 marker file。
- 排程任務要避免重複執行造成副作用。
- 長時間工作要能觀察進度與失敗點。
- 用最簡單可靠的排程方式，不要過早引入複雜工作流引擎。

---

## 錯誤處理

- 捕捉具體例外。
- 對檔案不存在、權限不足、命令失敗與 timeout 給清楚訊息。
- 把「可繼續」與「必須停止」的錯誤分開處理。
- 不要吞掉例外然後默默成功。

---

## Dry Run 與日誌

- 所有會修改檔案的 script 都應提供 dry-run 或至少預覽模式。
- 對批次腳本輸出足夠資訊，方便追蹤失敗檔案。
- 危險或不可逆操作要先列出計畫，再執行。

---

## 測試

- 把核心邏輯抽成可直接測試的函式。
- 用 `tmp_path`、`monkeypatch`、`capfd` / `capsys` 測 CLI。
- 用假資料模擬檔案樹或 subprocess 回應。
- 驗證 dry-run 不會真的改檔。

```python
def test_calculate_target_name(tmp_path):
    assert tmp_path.name
```

---

## 檢查清單

- [ ] input / output / side effects 已定義
- [ ] `pathlib` 與 `subprocess` 使用方式安全
- [ ] CLI help、exit code、dry-run 已設計
- [ ] 批次腳本可重跑，不會重複破壞資料
- [ ] 錯誤訊息可行動且具體
- [ ] 核心邏輯已抽出並可測試
