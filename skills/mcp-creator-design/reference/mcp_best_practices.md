# MCP Server 最佳實踐（Best Practices）

通用 MCP 準則：伺服器與 tool 命名、回應格式、分頁、傳輸選擇、安全與錯誤處理。

## 目錄（Table of Contents）

- [快速參考（Quick Reference）](#快速參考quick-reference)
- [伺服器命名規範（Server Naming Conventions）](#伺服器命名規範server-naming-conventions)
- [Tool 命名與設計（Tool Naming and Design）](#tool-命名與設計tool-naming-and-design)
- [回應格式（Response Formats）](#回應格式response-formats)
- [分頁（Pagination）](#分頁pagination)
- [傳輸選項（Transport Options）](#傳輸選項transport-options)
- [安全最佳實踐（Security Best Practices）](#安全最佳實踐security-best-practices)
- [Tool 註解（Tool Annotations）](#tool-註解tool-annotations)
- [錯誤處理（Error Handling）](#錯誤處理error-handling)
- [測試需求（Testing Requirements）](#測試需求testing-requirements)
- [文件需求（Documentation Requirements）](#文件需求documentation-requirements)

---

## 快速參考（Quick Reference）

### 伺服器命名（Server Naming）
- **Python**：`{service}_mcp`（例如 `slack_mcp`）
- **Node/TypeScript**：`{service}-mcp-server`（例如 `slack-mcp-server`）

### Tool 命名（Tool Naming）
- 使用 snake_case 並加上服務前綴
- 格式：`{service}_{action}_{resource}`
- 範例：`slack_send_message`、`github_create_issue`

### 回應格式（Response Formats）
- 同時支援 JSON 與 Markdown
- JSON 供程式處理；Markdown 供人類閱讀

### 分頁（Pagination）
- 務必尊重 `limit` 參數
- 回傳 `has_more`、`next_offset`、`total_count`
- 預設每頁 20–50 筆

### 傳輸（Transport）
- **Streamable HTTP**：遠端伺服器、多客戶端情境
- **stdio**：本機整合、命令列工具
- 避免 SSE（已由 streamable HTTP 取代）

---

## 伺服器命名規範（Server Naming Conventions）

依下列標準命名：

**Python**：格式 `{service}_mcp`（小寫、底線）
- 範例：`slack_mcp`、`github_mcp`、`jira_mcp`

**Node/TypeScript**：格式 `{service}-mcp-server`（小寫、連字號）
- 範例：`slack-mcp-server`、`github-mcp-server`、`jira-mcp-server`

名稱應：具通用性、能描述所整合的服務、易從任務描述推斷、且不含版本號。

---

## Tool 命名與設計（Tool Naming and Design）

### Tool 命名

1. **使用 snake_case**：`search_users`、`create_project`、`get_channel_info`
2. **包含服務前綴**：MCP 伺服器可能與其他伺服器並存，避免名稱衝突
   - 用 `slack_send_message` 而非僅 `send_message`
   - 用 `github_create_issue` 而非僅 `create_issue`
3. **動詞導向**：以動詞開頭（get、list、search、create 等）
4. **具體明確**：避免與其他伺服器可能衝突的通用名稱

### Tool 設計

- Tool 描述須**狹義、無歧義**地說明功能
- 描述須與實際行為**精確一致**
- 提供 tool 註解（readOnlyHint、destructiveHint、idempotentHint、openWorldHint）
- 保持 tool 操作**聚焦且具原子性**

---

## 回應格式（Response Formats）

所有回傳資料的 tool 應支援多種格式：

### JSON 格式（`response_format="json"`）
- 機器可讀的結構化資料
- 包含所有可用欄位與 metadata
- 欄位名稱與型別一致
- 用於程式化處理

### Markdown 格式（`response_format="markdown"`，通常為預設）
- 人類可讀的格式化文字
- 使用標題、列表與格式以提升可讀性
- 將時間戳轉為人類可讀格式
- 顯示名稱並在括號內附 ID
- 省略冗長 metadata

---

## 分頁（Pagination）

對會列出資源的 tool：

- **務必尊重 `limit` 參數**
- **實作分頁**：使用 `offset` 或 cursor-based 分頁
- **回傳分頁 metadata**：包含 `has_more`、`next_offset`/`next_cursor`、`total_count`
- **切勿一次載入全部結果到記憶體**：對大資料集尤其重要
- **預設合理上限**：通常每頁 20–50 筆

分頁回應範例：
```json
{
  "total": 150,
  "count": 20,
  "offset": 0,
  "items": [...],
  "has_more": true,
  "next_offset": 20
}
```

---

## 傳輸選項（Transport Options）

### Streamable HTTP

**適用**：遠端伺服器、網路服務、多客戶端情境

**特點**：
- 透過 HTTP 雙向通訊
- 支援多客戶端同時連線
- 可部署為 web 服務
- 支援 server 對 client 的通知

**使用時機**：同時服務多客戶端、部署為雲端服務、與 web 應用整合時。

### stdio

**適用**：本機整合、命令列工具

**特點**：
- 以標準輸入/輸出串流通訊
- 設定簡單、無需網路設定
- 以 client 的子行程執行

**使用時機**：為本機開發環境建工具、與桌面應用整合、單一使用者／單一 session 時。

**注意**：stdio 伺服器不應將 log 寫到 stdout，應使用 stderr。

### 傳輸選擇對照

| 準則 | stdio | Streamable HTTP |
|------|-------|-----------------|
| **部署** | 本機 | 遠端 |
| **客戶端** | 單一 | 多個 |
| **複雜度** | 低 | 中 |
| **即時** | 否 | 是 |

---

## 安全最佳實踐（Security Best Practices）

### 認證與授權（Authentication and Authorization）

**OAuth 2.1**：
- 使用安全的 OAuth 2.1 與可信憑證
- 處理請求前驗證 access token
- 僅接受明確發給本伺服器的 token

**API Keys**：
- 將 API key 存於環境變數，勿寫入程式碼
- 在伺服器啟動時驗證 key
- 認證失敗時提供清楚錯誤訊息

### 輸入驗證（Input Validation）

- 清理檔案路徑，防止目錄遍歷
- 驗證 URL 與外部識別碼
- 檢查參數大小與範圍
- 防止在系統呼叫中發生 command injection
- 所有輸入使用 schema 驗證（Pydantic/Zod）

### 錯誤處理（Error Handling）

- 不向 client 暴露內部錯誤
- 在伺服器端記錄與安全相關的錯誤
- 提供有幫助但不洩漏細節的錯誤訊息
- 錯誤發生後正確清理資源

### DNS Rebinding 防護

本機執行的 streamable HTTP 伺服器應：
- 啟用 DNS rebinding 防護
- 對所有連線驗證 `Origin` header
- 綁定 `127.0.0.1` 而非 `0.0.0.0`

---

## Tool 註解（Tool Annotations）

提供註解以協助 client 理解 tool 行為：

| 註解 | 型別 | 預設 | 說明 |
|------|------|------|------|
| `readOnlyHint` | boolean | false | Tool 不修改環境 |
| `destructiveHint` | boolean | true | Tool 可能執行破壞性更新 |
| `idempotentHint` | boolean | false | 相同參數重複呼叫無額外效果 |
| `openWorldHint` | boolean | true | Tool 與外部實體互動 |

**重要**：註解僅為提示，非安全保證。Client 不應僅依註解做安全關鍵決策。

---

## 錯誤處理（Error Handling）

- 使用標準 JSON-RPC 錯誤碼
- Tool 錯誤應在 result 物件內回報（非協定層錯誤）
- 提供有幫助、具體的錯誤訊息與建議下一步
- 不暴露內部實作細節
- 錯誤時正確清理資源

錯誤處理範例：
```typescript
try {
  const result = performOperation();
  return { content: [{ type: "text", text: result }] };
} catch (error) {
  return {
    isError: true,
    content: [{
      type: "text",
      text: `Error: ${error.message}. Try using filter='active_only' to reduce results.`
    }]
  };
}
```

---

## 測試需求（Testing Requirements）

完整測試應涵蓋：

- **功能測試**：以有效／無效輸入驗證執行正確性
- **整合測試**：與外部系統的互動
- **安全測試**：驗證認證、輸入清理、rate limiting
- **效能測試**：負載與逾時下的行為
- **錯誤處理**：確認錯誤回報與資源清理正確

---

## 文件需求（Documentation Requirements）

- 清楚記錄所有 tools 與能力
- 每個主要功能至少提供 3 個可運作範例
- 說明安全考量
- 註明所需權限與存取層級
- 記錄 rate limit 與效能特性
