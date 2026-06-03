# JavaScript 測試最佳實踐（Testing）

## 分層

- **單元測試**：純函式、邏輯分支、資料轉換（快、穩）。
- **整合測試**：含 I/O（DB、HTTP）但在可控環境（docker/testcontainers）。
- **端對端**：只留關鍵流程（慢、但最接近真實）。

## 可重現性（Determinism）

- Freeze 時間：mock `Date.now()` / fake timers。
- 固定隨機：注入 RNG 或設定 seed。
- 不依賴真實網路：HTTP 用 mock server（msw/nock）或 recorded fixtures。

## 測試工具

- Node/前端都常用：Vitest 或 Jest。
- 建議：
  - assertions 用內建 expect（或 chai）
  - 覆蓋率要看趨勢，不只看數字

## Mock 策略

- 優先 mock 邊界（HTTP client、DB client），不要 mock 內部細節。
- 避免 over-mocking 造成測試與實作強耦合。

## 斷言

- 斷言要聚焦在「行為與輸出」，不要只測 implementation details。
- 錯誤測試要確認訊息可用（包含關鍵欄位與提示）。
