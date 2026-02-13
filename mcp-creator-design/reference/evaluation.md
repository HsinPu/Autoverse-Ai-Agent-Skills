# MCP Server 評測指南（Evaluation Guide）

## 總覽（Overview）

本文件說明如何為 MCP 伺服器建立完整評測。評測用於驗證 LLM 能否**僅透過你提供的 tools**，有效回答貼近真實、具複雜度的問題。

---

## 快速參考（Quick Reference）

### 評測需求（Evaluation Requirements）
- 建立 10 題人類可讀的題目
- 題目須為**唯讀、獨立、非破壞性**
- 每題需多次 tool 呼叫（可能達數十次）
- 答案須為單一、可驗證的值
- 答案須**穩定**（不隨時間改變）

### 輸出格式（Output Format）
```xml
<evaluation>
   <qa_pair>
      <question>Your question here</question>
      <answer>Single verifiable answer</answer>
   </qa_pair>
</evaluation>
```

---

## 評測目的（Purpose of Evaluations）

MCP 伺服器的品質**不是**看 tool 實作多完整，而是：在**沒有其他 context、僅能使用該 MCP 伺服器**的前提下，這些實作（input/output schema、docstring/描述、功能）能否讓 LLM 回答**貼近真實且困難**的問題。

## 評測總覽（Evaluation Overview）

建立 10 題人類可讀的題目，且**僅需唯讀、獨立、非破壞性、冪等**操作即可回答。每題應：
- 貼近真實
- 清楚簡潔
- 無歧義
- 具複雜度，可能需要數十次 tool 呼叫或步驟
- 可事先決定單一、可驗證的答案

## 題目準則（Question Guidelines）

### 核心需求（Core Requirements）

1. **題目須獨立**
   - 不得依賴其他題目的答案
   - 不得假設因處理其他題目而做過寫入操作

2. **題目僅能要求非破壞性與冪等的 tool 使用**
   - 不得要求或指示透過修改狀態來得到正確答案

3. **題目須貼近真實、清楚、簡潔且複雜**
   - 須讓另一個 LLM 使用多個（可能數十個）tools 或步驟才能回答

### 複雜度與深度（Complexity and Depth）

4. **題目須需深入探索**
   - 可考慮多跳題目：需多個子問題與連續 tool 呼叫
   - 每一步應能利用前一步得到的資訊

5. **題目可需大量分頁**
   - 可能需翻越多頁結果
   - 可能需查詢較舊資料（1–2 年前）以找到冷門資訊
   - 題目須**有難度**

6. **題目須需深入理解**
   - 非表面知識即可
   - 可為需證據的 True/False 複雜概念
   - 可為多選題，讓 LLM 需搜尋不同假設

7. **題目不得僅靠關鍵字搜尋即可解**
   - 勿直接使用目標內容的關鍵字
   - 使用同義詞、相關概念或改寫
   - 需多次搜尋、分析多筆相關項目、擷取脈絡後推得答案

### Tool 壓力測試（Tool Testing）

8. **題目應能壓力測試 tool 回傳值**
   - May elicit tools returning large JSON objects or lists, overwhelming the LLM
   - Should require understanding multiple modalities of data:
     - IDs and names
     - Timestamps and datetimes (months, days, years, seconds)
     - File IDs, names, extensions, and mimetypes
     - URLs, GIDs, etc.
   - Should probe the tool's ability to return all useful forms of data

9. **題目應多數反映真實人類使用情境**
   - 人類在 LLM 協助下會關心的資訊檢索任務

10. **題目可需數十次 tool 呼叫**
    - 可考驗 context 有限的 LLM
    - 促使 MCP server 的 tools 精簡回傳資訊

11. **可包含具歧義的題目**
    - 題目本身可具歧義，或需艱難決定要呼叫哪些 tools
    - 讓 LLM 可能出錯或誤解
    - 儘管有歧義，仍須有**單一可驗證答案**

### 穩定性（Stability）

12. **題目設計須使答案不會改變**
    - Do not ask questions that rely on "current state" which is dynamic
    - For example, do not count:
      - Number of reactions to a post
      - Number of replies to a thread
      - Number of members in a channel

13. **勿讓 MCP server 限制你出題的類型**
    - 建立有挑戰性、複雜的題目
    - 部分題目可能無法以現有 MCP server tools 解出
    - 題目可要求特定輸出格式（datetime vs epoch、JSON vs MARKDOWN）
    - 題目可需數十次 tool 呼叫才能完成

## 答案準則（Answer Guidelines）

### 可驗證性（Verification）

1. **答案須可透過直接字串比對驗證**
   - If the answer can be re-written in many formats, clearly specify the output format in the QUESTION
   - Examples: "Use YYYY/MM/DD.", "Respond True or False.", "Answer A, B, C, or D and nothing else."
   - Answer should be a single VERIFIABLE value such as:
     - User ID, user name, display name, first name, last name
     - Channel ID, channel name
     - Message ID, string
     - URL, title
     - Numerical quantity
     - Timestamp, datetime
     - Boolean (for True/False questions)
     - Email address, phone number
     - File ID, file name, file extension
     - Multiple choice answer
   - Answers must not require special formatting or complex, structured output
   - Answer will be verified using DIRECT STRING COMPARISON

### 可讀性（Readability）

2. **答案宜優先採人類可讀格式**
   - 例如：姓名、名字、姓氏、datetime、檔名、訊息字串、URL、yes/no、true/false、a/b/c/d
   - 優於不透明 ID（但 ID 可接受）
   - 絕大多數答案應為人類可讀

### 穩定性（Stability）

3. **答案須穩定／固定**
   - Look at old content (e.g., conversations that have ended, projects that have launched, questions answered)
   - Create QUESTIONS based on "closed" concepts that will always return the same answer
   - Questions may ask to consider a fixed time window to insulate from non-stationary answers
   - Rely on context UNLIKELY to change
   - Example: if finding a paper name, be SPECIFIC enough so answer is not confused with papers published later

4. **答案須清楚且無歧義**
   - 題目設計須使答案唯一、明確
   - 答案可透過使用 MCP server tools 推得

### 多樣性（Diversity）

5. **答案須具多樣性**
   - Answer should be a single VERIFIABLE value in diverse modalities and formats
   - User concept: user ID, user name, display name, first name, last name, email address, phone number
   - Channel concept: channel ID, channel name, channel topic
   - Message concept: message ID, message string, timestamp, month, day, year

6. **答案不得為複雜結構**
   - 非值列表
   - 非複雜物件
   - 非 ID 或字串列表
   - 非自然語言長文
   - 除非答案可透過**直接字串比對**驗證、且可合理重現
   - 且 LLM 不太可能以不同順序或格式回傳相同列表

## 評測流程（Evaluation Process）

### Step 1：文件檢視（Documentation Inspection）

閱讀目標 API 文件以理解：
- 可用端點與功能
- 若有歧義，從網路取得補充資訊
- **盡可能並行**此步驟
- 確保每個 subagent 僅檢視檔案系統或網路上的文件

### Step 2：Tool 檢視（Tool Inspection）

列出 MCP server 的可用 tools：
- 直接檢視 MCP server
- 理解 input/output schema、docstring、描述
- 此階段**不要**實際呼叫 tools

### Step 3：建立理解（Developing Understanding）

重複 Step 1、2 直到有足夠理解：
- 多次迭代
- 思考要建立的任務類型
- 精煉理解
- **任何階段都不要**閱讀 MCP server 的實作程式碼
- 依直覺與理解建立合理、貼近真實但**非常有挑戰性**的任務

### Step 4：唯讀內容檢視（Read-Only Content Inspection）

理解 API 與 tools 後，**使用** MCP server 的 tools：
- **僅**以唯讀、非破壞性操作檢視內容
- 目標：找出可出題的具體內容（如使用者、頻道、訊息、專案、任務）
- 不得呼叫會修改狀態的 tools
- 不閱讀 MCP server 實作程式碼
- 以多個 sub-agent 並行、各自探索
- 確保每個 subagent 僅執行唯讀、非破壞性、冪等操作
- **注意**：部分 tools 可能回傳大量資料導致 context 用盡
- 探索時做**漸進、小規模、有目標**的 tool 呼叫
- 所有 tool 呼叫請求使用 `limit` 參數限制結果（<10）
- 使用分頁

### Step 5：任務產出（Task Generation）

檢視內容後，建立 10 題人類可讀題目：
- LLM 應能僅靠 MCP server 回答這些題目
- 遵循上述題目與答案準則

## 輸出格式（Output Format）

每組 QA 含一題一答。輸出為具下列結構的 XML 檔：

```xml
<evaluation>
   <qa_pair>
      <question>Find the project created in Q2 2024 with the highest number of completed tasks. What is the project name?</question>
      <answer>Website Redesign</answer>
   </qa_pair>
   <qa_pair>
      <question>Search for issues labeled as "bug" that were closed in March 2024. Which user closed the most issues? Provide their username.</question>
      <answer>sarah_dev</answer>
   </qa_pair>
   <qa_pair>
      <question>Look for pull requests that modified files in the /api directory and were merged between January 1 and January 31, 2024. How many different contributors worked on these PRs?</question>
      <answer>7</answer>
   </qa_pair>
   <qa_pair>
      <question>Find the repository with the most stars that was created before 2023. What is the repository name?</question>
      <answer>data-pipeline</answer>
   </qa_pair>
</evaluation>
```

## 評測範例（Evaluation Examples）

### 良好題目（Good Questions）

**範例 1：需深入探索的多跳題（GitHub MCP）**
```xml
<qa_pair>
   <question>Find the repository that was archived in Q3 2023 and had previously been the most forked project in the organization. What was the primary programming language used in that repository?</question>
   <answer>Python</answer>
</qa_pair>
```

此題佳因為：
- 需多次搜尋才能找到已封存 repo
- 需找出封存前 fork 數最多者
- 需檢視 repo 詳情以取得語言
- 答案為簡單、可驗證的值
- 基於不會變動的歷史（已結束）資料

**範例 2：需理解脈絡、非關鍵字匹配（專案管理 MCP）**
```xml
<qa_pair>
   <question>Locate the initiative focused on improving customer onboarding that was completed in late 2023. The project lead created a retrospective document after completion. What was the lead's role title at that time?</question>
   <answer>Product Manager</answer>
</qa_pair>
```

此題佳因為：
- 未使用具體專案名稱（「聚焦改善客戶入職的計畫」）
- 需在特定時間範圍內找到已完成的專案
- 需找出專案負責人與其職稱
- 需從 retrospective 文件理解脈絡
- 答案人類可讀且穩定
- 基於已結束的工作（不會變）

**範例 3：需多步驟的複雜彙總（Issue Tracker MCP）**
```xml
<qa_pair>
   <question>Among all bugs reported in January 2024 that were marked as critical priority, which assignee resolved the highest percentage of their assigned bugs within 48 hours? Provide the assignee's username.</question>
   <answer>alex_eng</answer>
</qa_pair>
```

此題佳因為：
- 需依日期、優先級、狀態篩選 bug
- 需依 assignee 分組並計算解決率
- 需理解時間戳以判斷 48 小時區間
- 考驗分頁（可能需處理大量 bug）
- 答案為單一 username
- 基於特定時段的歷史資料

**範例 4：需跨多種資料類型綜合（CRM MCP）**
```xml
<qa_pair>
   <question>Find the account that upgraded from the Starter to Enterprise plan in Q4 2023 and had the highest annual contract value. What industry does this account operate in?</question>
   <answer>Healthcare</answer>
</qa_pair>
```

此題佳因為：
- 需理解訂閱方案變更
- 需在特定時間範圍內找出升級事件
- 需比較合約金額
- 需存取帳戶產業資訊
- 答案簡單可驗證
- 基於已完成的歷史交易

### 不良題目（Poor Questions）

**範例 1：答案會隨時間改變**
```xml
<qa_pair>
   <question>How many open issues are currently assigned to the engineering team?</question>
   <answer>47</answer>
</qa_pair>
```

此題不佳因為：
- 答案會隨 issue 新增、關閉或重新指派而變
- 非基於穩定／固定資料
- 依賴動態的「當前狀態」

**範例 2：關鍵字搜尋即可解、過於簡單**
```xml
<qa_pair>
   <question>Find the pull request with title "Add authentication feature" and tell me who created it.</question>
   <answer>developer123</answer>
</qa_pair>
```

此題不佳因為：
- 以標題關鍵字搜尋即可解
- 不需深入探索或理解
- 不需綜合或分析

**範例 3：答案格式有歧義**
```xml
<qa_pair>
   <question>List all the repositories that have Python as their primary language.</question>
   <answer>repo1, repo2, repo3, data-pipeline, ml-tools</answer>
</qa_pair>
```

此題不佳因為：
- 答案為列表，可能以任意順序回傳
- 難以用直接字串比對驗證
- LLM 可能以不同格式回傳（JSON 陣列、逗號分隔、換行分隔）
- 較佳做法是問特定彙總（如數量）或極值（如最多 star）

## 驗證流程（Verification Process）

建立評測後：

1. **檢視 XML 檔**以理解 schema
2. **載入每題**，並以 MCP server 與 tools **並行**自行解題以得到正確答案
3. **標記**任何需寫入或破壞性操作的題目
4. **彙總所有正確答案**，替換文件中的錯誤答案
5. **刪除**任何需寫入或破壞性操作的 `<qa_pair>`

記得並行解題以節省 context，最後再彙總答案並一次修改檔案。

## 產出高品質評測的建議（Tips for Creating Quality Evaluations）

1. **先深思與規劃**再產出任務
2. **有機會就並行**以加速並管理 context
3. **聚焦真實使用情境**，人類會想完成的任務
4. **出有挑戰性的題目**以考驗 MCP server 能力邊界
5. **確保穩定性**：使用歷史資料與已結束的概念
6. **自行驗證答案**：用 MCP server tools 解題
7. **依過程所學迭代與精煉**

---

# 執行評測（Running Evaluations）

建立評測檔後，可使用評測 harness 測試 MCP server。以下以**範例評測腳本**為例（不同腳本可能使用不同 LLM 或 API），實際執行時請依你採用的腳本與供應商文件設定。

## 設定（Setup）

1. **安裝依賴（Install Dependencies）**

   ```bash
   pip install -r scripts/requirements.txt
   ```

   或依該評測腳本說明手動安裝所需套件（例如 LLM 供應商 SDK、`mcp` 等）。

2. **設定 API Key（Set API Key）**

   依評測腳本所採用的 LLM API 設定對應的環境變數，例如：
   ```bash
   export LLM_API_KEY=your_api_key_here
   ```
   若腳本使用特定供應商，請參照其文件（如 `ANTHROPIC_API_KEY`、`OPENAI_API_KEY` 等）。

## 評測檔格式（Evaluation File Format）

評測檔使用 XML，以 `<qa_pair>` 元素表示：

```xml
<evaluation>
   <qa_pair>
      <question>Find the project created in Q2 2024 with the highest number of completed tasks. What is the project name?</question>
      <answer>Website Redesign</answer>
   </qa_pair>
   <qa_pair>
      <question>Search for issues labeled as "bug" that were closed in March 2024. Which user closed the most issues? Provide their username.</question>
      <answer>sarah_dev</answer>
   </qa_pair>
</evaluation>
```

## 執行評測（Running Evaluations）

評測腳本（`scripts/evaluation.py`）支援三種傳輸：

**注意**：
- **stdio**：評測腳本會自動啟動並管理 MCP server 行程，勿手動啟動 server。
- **sse/http**：須先單獨啟動 MCP server，再執行評測；腳本會連到指定 URL 上已運行的 server。

### 1. 本機 STDIO Server

本機執行的 MCP server（腳本會自動啟動 server）：

```bash
python scripts/evaluation.py \
  -t stdio \
  -c python \
  -a my_mcp_server.py \
  evaluation.xml
```

With environment variables:
```bash
python scripts/evaluation.py \
  -t stdio \
  -c python \
  -a my_mcp_server.py \
  -e API_KEY=abc123 \
  -e DEBUG=true \
  evaluation.xml
```

### 2. Server-Sent Events (SSE)

以 SSE 為傳輸的 MCP server（須先啟動 server）：

```bash
python scripts/evaluation.py \
  -t sse \
  -u https://example.com/mcp \
  -H "Authorization: Bearer token123" \
  -H "X-Custom-Header: value" \
  evaluation.xml
```

### 3. HTTP（Streamable HTTP）

以 HTTP 為傳輸的 MCP server（須先啟動 server）：

```bash
python scripts/evaluation.py \
  -t http \
  -u https://example.com/mcp \
  -H "Authorization: Bearer token123" \
  evaluation.xml
```

## 命令列選項（Command-Line Options）

```
usage: evaluation.py [-h] [-t {stdio,sse,http}] [-m MODEL] [-c COMMAND]
                     [-a ARGS [ARGS ...]] [-e ENV [ENV ...]] [-u URL]
                     [-H HEADERS [HEADERS ...]] [-o OUTPUT]
                     eval_file

positional arguments:
  eval_file             Path to evaluation XML file

optional arguments:
  -h, --help            Show help message
  -t, --transport       Transport type: stdio, sse, or http (default: stdio)
  -m, --model           LLM model to use for answering questions (default depends on harness)
  -o, --output          Output file for report (default: print to stdout)

stdio options:
  -c, --command         Command to run MCP server (e.g., python, node)
  -a, --args            Arguments for the command (e.g., server.py)
  -e, --env             Environment variables in KEY=VALUE format

sse/http options:
  -u, --url             MCP server URL
  -H, --header          HTTP headers in 'Key: Value' format
```

## 輸出（Output）

評測腳本會產生詳細報告，包含：

- **摘要統計（Summary Statistics）**：
  - 正確率（正確數/總數）
  - 平均任務耗時
  - 每任務平均 tool 呼叫數
  - 總 tool 呼叫數

- **每題結果（Per-Task Results）**：
  - 題目與預期答案
  - Agent 實際回覆
  - 答案是否正確（✅/❌）
  - 耗時與 tool 呼叫細節
  - Agent 對做法的摘要
  - Agent 對 tools 的回饋

### 將報告存成檔案（Save Report to File）

```bash
python scripts/evaluation.py \
  -t stdio \
  -c python \
  -a my_server.py \
  -o evaluation_report.md \
  evaluation.xml
```

## 完整範例流程（Complete Example Workflow）

以下為建立並執行評測的完整範例：

1. **Create your evaluation file** (`my_evaluation.xml`):

```xml
<evaluation>
   <qa_pair>
      <question>Find the user who created the most issues in January 2024. What is their username?</question>
      <answer>alice_developer</answer>
   </qa_pair>
   <qa_pair>
      <question>Among all pull requests merged in Q1 2024, which repository had the highest number? Provide the repository name.</question>
      <answer>backend-api</answer>
   </qa_pair>
   <qa_pair>
      <question>Find the project that was completed in December 2023 and had the longest duration from start to finish. How many days did it take?</question>
      <answer>127</answer>
   </qa_pair>
</evaluation>
```

2. **安裝依賴**：依評測腳本要求安裝並設定對應的 LLM API key（環境變數名稱依供應商而異）。

3. **Run evaluation**:

```bash
python scripts/evaluation.py \
  -t stdio \
  -c python \
  -a github_mcp_server.py \
  -e GITHUB_TOKEN=ghp_xxx \
  -o github_eval_report.md \
  my_evaluation.xml
```

4. **檢視報告**（`github_eval_report.md`）以：
   - 查看哪些題目通過／失敗
   - 閱讀 agent 對你 tools 的回饋
   - 找出可改進處
   - 迭代 MCP server 設計

## 疑難排解（Troubleshooting）

### 連線錯誤（Connection Errors）

若出現連線錯誤：
- **STDIO**：確認指令與參數正確
- **SSE/HTTP**：確認 URL 可連且 headers 正確
- 確認所需 API key 已設於環境變數或 headers

### 正確率低（Low Accuracy）

若多題失敗：
- 檢視每題的 agent 回饋
- 檢查 tool 描述是否清楚完整
- 確認輸入參數有妥善文件
- 考慮 tools 是否回傳過多或過少資料
- 確保錯誤訊息具可執行性

### 逾時（Timeout Issues）

若任務逾時：
- 改用能力較強的 LLM 模型（依你使用的評測 harness 與供應商指定型號）
- 檢查 tools 是否回傳過多資料
- 確認分頁運作正常
- 考慮簡化複雜題目