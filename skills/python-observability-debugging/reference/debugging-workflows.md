# Python 可觀測性與除錯 — 參考資料

Use this reference when a Python system is failing, slow, memory-heavy, or difficult to diagnose.

## 目錄（Table of Contents）

- [觸發時機](#觸發時機)
- [邊界與分工](#邊界與分工)
- [先復現再推理](#先復現再推理)
- [資訊蒐集](#資訊蒐集)
- [Traceback Triage](#traceback-triage)
- [性能問題](#性能問題)
- [記憶體問題](#記憶體問題)
- [Runtime Diagnostics](#runtime-diagnostics)
- [Temporary Instrumentation](#temporary-instrumentation)
- [驗證修復](#驗證修復)
- [檢查清單](#檢查清單)

---

## 觸發時機

- Exception、crash、stack trace、hang、timeout
- Slow path、CPU hotspot、memory growth
- Production-only or environment-specific bugs
- Repeated flaky failures that need root-cause analysis

---

## 邊界與分工

- 用 `logging-patterns` 處理 log 寫法與訊息格式。
- 用 `testing-strategy` 決定測試層級與覆蓋策略。
- 用 `python-development` 處理修復後的架構與風格調整。
- 這份參考專注在找原因，而不是重寫應用結構。

---

## 先復現再推理

- 找最小可重現案例。
- 記錄輸入、環境、版本、時間、資料大小。
- 如果不能穩定復現，先縮小變因再推論。
- 不要一次改太多。

---

## 資訊蒐集

- 保留原始 traceback。
- 收集相關 log、metrics、request id、job id、input sample。
- 比對正常與異常案例的差異。
- 把臨時診斷輸出限制在最少量。

---

## Traceback Triage

- 先看最底層的 exception。
- 找出第一個出現異常的內層 frame。
- 判斷是資料問題、環境問題、依賴問題，還是程式邏輯問題。
- 如果 exception 被包裝過，追到 root cause 再判斷。

```python
import traceback

try:
    run_job()
except Exception:
    print(traceback.format_exc())
    raise
```

---

## 性能問題

- 先量測再優化。
- 找 CPU bound 還是 I/O bound。
- 用最小範圍的 profile 對象。
- 對比快慢兩條路徑的輸入大小、資料形狀與外部依賴。

---

## 記憶體問題

- 檢查大型 list、cache、buffer、資料複製與循環引用。
- 比較前後 snapshot 或 object count。
- 驗證是否有未釋放的長生命週期物件。
- 必要時在有限範圍內縮小資料集重跑。

---

## Runtime Diagnostics

- 必要時加入短暫的 debug log、assert、timing 或 counters。
- 只在關鍵節點插入診斷，不要全程噴滿輸出。
- 將診斷輸出附上 request id / job id。
- 修完後移除臨時診斷。

---

## Temporary Instrumentation

- 用最短時間引入最小可驗證觀測點。
- 不要為了 debug 長期保留臨時程式碼。
- 如果 instrumentation 會改變 timing，要注意它本身可能影響結果。

---

## 驗證修復

- 用原始 symptom 和原始 input 重跑。
- 確認主要錯誤消失，且沒有引入新警訊。
- 若問題和環境有關，記錄修復生效的條件。
- 把結論整理成可重用的排查步驟。

---

## 檢查清單

- [ ] 已建立最小可重現案例
- [ ] 已收集 traceback / logs / environment facts
- [ ] 已區分 symptom 與 root cause
- [ ] 已使用適當的 profile 或 diagnostics
- [ ] 臨時 instrumentation 可移除
- [ ] 修復已用原始情境驗證
