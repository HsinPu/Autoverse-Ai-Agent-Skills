---
name: code-review
description: Automated code review for pull requests using specialized review patterns. Analyzes code for quality, security, performance, and best practices. Use when reviewing code changes, PRs, or doing code audits.
---

# Code Review

依安全、效能、程式品質與測試四大面向**嚴謹**審查程式碼。適用情境：審查 Pull Request、檢視程式變更、或執行程式碼稽核（code audit）時使用本 skill。

## 審查原則（Principles）

- **有 Critical 不得合併**：只要存在任一 🔴 Critical 項目，審查結論為 **Request Changes**，不得合併直至修正並通過覆審。
- **逐項對照**：必須依下方審查類別與檢查清單逐項檢查，不得遺漏；無法檢查的項目須在輸出中註明「未檢查」及原因。
- **證據導向**：每個 Critical 與 Suggestion 必須標註 **檔案與行號**，並簡述原因與建議修正方式。
- **安全零妥協**：安全審查中任一項問題一律列為 Critical，不得降級為 Suggestion。

## 審查類別（Review Categories）

### 1. 安全審查（Security Review）

**凡符合以下任一條件，一律列為 🔴 Critical，不得合併。**

檢查項目：

- **SQL 注入**：使用者輸入或字串拼接直接進入 SQL；未使用參數化查詢或 ORM 參數綁定。
- **XSS**：未經跳脫的使用者輸入輸出至 HTML／DOM（含 `innerHTML`、`dangerouslySetInnerHTML`、`v-html` 等）。
- **指令／程式碼注入**：`eval()`、`new Function()`、`exec`/`shell_exec` 等使用使用者可控輸入。
- **不安全的反序列化**：反序列化來自不可信來源的資料且未驗證／白名單。
- **硬編碼密鑰或憑證**：API key、密碼、secret、token 寫死在程式碼或設定檔並提交至版控。
- **認證／授權缺失**：敏感操作未檢查登入狀態、權限或資源所屬；依 URL/參數即可越權存取。
- **不安全的直接物件參考（IDOR）**：以可預測 ID 存取資源且未驗證該使用者是否有權限。
- **不安全的重新導向**：重新導向目標來自使用者輸入且未白名單驗證。

### 2. 效能審查（Performance Review）

**下列項目若會導致生產環境明顯風險（如大量請求下癱瘓、OOM），列為 Critical；其餘列為 Suggestion。**

檢查項目：

- **N+1 查詢**：迴圈內對資料庫/API 發起請求；必須改為批次查詢或預先載入。
- **缺少資料庫索引**：查詢條件或排序欄位未建索引且資料量可能成長。
- **不必要的重繪**：React 等未適當使用 key、依賴未 memo、或造成整樹重繪的變更。
- **記憶體洩漏**：未取消訂閱、未清除 timer/listener、或閉包長期持有大物件。
- **阻塞主執行緒**：在 async/非同步路徑中執行同步 I/O 或 CPU 密集操作。
- **未善用快取**：重複且成本高的計算或 I/O 未做合理快取或快取失效策略不當。
- **過大的 bundle**：新增大型依賴未做 code split 或 tree-shaking 檢視。

### 3. 程式品質審查（Code Quality Review）

**下列若導致可預見的錯誤、資料錯誤或維護困難，列為 Critical；其餘列為 Suggestion 或 Nit。**

檢查項目：

- **程式碼重複**：明顯違反 DRY，同一邏輯多處複製且變更易不同步。
- **單一函式職責過多**：單一函式/方法做多件不相關的事，違反 SRP，難以測試與維護。
- **巢狀過深或條件過於複雜**：巢狀超過 3～4 層或條件式難以理解；應重構為早期 return 或拆函式。
- **魔術數字／字串**：未以常數或設定表示，影響可讀性與後續調整。
- **命名不當**：變數/函式名稱與實際行為不符或難以理解。
- **錯誤處理**：**Critical**：吞掉例外（empty catch）、未處理 reject、對外介面未處理錯誤。**Suggestion**：錯誤訊息不足、未區分可重試與不可重試。
- **型別／介面**：對外 API 或跨模組介面未定義型別/介面列為 Suggestion；若專案已明訂全面型別化則未覆蓋處列為 Suggestion。

### 4. 測試審查（Testing Review）

**新增或修改核心邏輯、API、安全相關程式碼時，缺少對應測試列為 Critical；其餘列為 Suggestion。**

檢查項目：

- **覆蓋率**：新程式碼（含分支）應有對應單元或整合測試；修 bug 應有回歸測試。
- **測試意圖**：測試應驗證「行為」與預期結果，而非僅實作細節；避免只 assert 無拋錯。
- **穩定性**：依時間、順序或外部狀態的測試（flaky）應改為可控或 mock。
- **邊界與錯誤**：空值、邊界值、錯誤路徑應有測試。
- **外部依賴**：外部服務/DB 應 mock 或使用 test double，避免測試依賴真實環境。

## 審查輸出格式（Review Output Format）

回報時**必須**依下列結構撰寫，且**結論區塊不可省略**。

```markdown
## Code Review Summary

**結論：** [Approve / Request Changes]
- 若存在任一 🔴 Critical → 結論為 **Request Changes**，並列出必須修正項。
- 僅有 🟡🟢 時可 **Approve**，仍可於內文列出建議。

### 🔴 Critical（必須修正，否則不得合併）
- **[File:Line]** [Issue description]
  - **Why:** [簡要說明為何屬 Critical]
  - **Fix:** [具體建議修正方式]

### 🟡 Suggestions（強烈建議修正）
- **[File:Line]** [Issue description]
  - **Why:** [說明]
  - **Fix:** [建議]

### 🟢 Nits（可選）
- **[File:Line]** [Minor suggestion]

### ✅ What's Good
- [正面回饋，可略]

---
**檢查清單：** [列出本 PR 已對照的審查項；未檢查項請註明「未檢查」及原因]
```

## 常見反例與建議（Common Patterns to Flag）

### 安全（Security）

以下皆屬 **Critical**，不得合併。

```javascript
// BAD: SQL injection → Critical
const query = `SELECT * FROM users WHERE id = ${userId}`;

// GOOD: Parameterized query
const query = 'SELECT * FROM users WHERE id = $1';
await db.query(query, [userId]);
```

```javascript
// BAD: 使用者輸入直接進入 eval/Function → Critical
eval(userInput);
new Function(userInput)();

// BAD: 未跳脫輸出至 DOM → Critical (XSS)
element.innerHTML = userContent;
```

```javascript
// BAD: 重新導向目標來自輸入且未驗證 → Critical
window.location.href = request.query.redirect;
```

### 效能（Performance）
```javascript
// BAD: N+1 query
users.forEach(async user => {
  const posts = await getPosts(user.id);
});

// GOOD: Batch query
const userIds = users.map(u => u.id);
const posts = await getPostsForUsers(userIds);
```

### 錯誤處理（Error Handling）

```javascript
// BAD: 吞掉錯誤 → Critical（無法除錯、錯誤會靜默擴散）
try {
  await riskyOperation();
} catch (e) {}

// GOOD: 記錄並傳播或轉為領域錯誤
try {
  await riskyOperation();
} catch (e) {
  logger.error('Operation failed', { error: e });
  throw new AppError('Operation failed', { cause: e });
}
```

## 審查檢查清單（Review Checklist）

審查結束前**必須**對照以下項目，並在輸出中勾選或註明「未檢查」。

**阻擋合併（任一未通過即不得合併）：**

- [ ] 無硬編碼密鑰、憑證或 secret（含設定檔提交至版控）
- [ ] 敏感操作有認證／授權檢查；無 IDOR 或越權風險
- [ ] 使用者輸入進入 SQL/指令/HTML 時已參數化或跳脫
- [ ] 無吞掉錯誤的 empty catch；非預期錯誤有記錄或傳播
- [ ] 新增或修改之核心邏輯／API 有對應測試

**強烈建議（應在審查中提出，可視專案政策決定是否阻擋）：**

- [ ] 關鍵路徑有輸入驗證與邊界處理
- [ ] 對外或跨模組介面有型別／介面定義
- [ ] 無明顯 N+1、主執行緒阻塞或記憶體洩漏風險
- [ ] 程式可讀、命名與結構合理
- [ ] 破壞性變更或行為變更有註記或文件
