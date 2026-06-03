# Java MCP Server 實作指南（Implementation Guide）

## 目錄（Table of Contents）

- [總覽（Overview）](#總覽overview)
- [快速參考（Quick Reference）](#快速參考quick-reference)
- [MCP Java SDK](#mcp-java-sdk)
- [專案結構（Project Structure）](#專案結構project-structure)
- [傳輸（Transports）](#傳輸transports)
- [Tool 實作（Tool Implementation）](#tool-實作tool-implementation)
- [JSON Schema（Input/Output Schema）](#json-schemainputoutput-schema)
- [回應格式（Tool Result Formats）](#回應格式tool-result-formats)
- [錯誤處理（Error Handling）](#錯誤處理error-handling)
- [建置與執行（Building and Running）](#建置與執行building-and-running)
- [用 MCP Inspector 測試（Testing with MCP Inspector）](#用-mcp-inspector-測試testing-with-mcp-inspector)
- [品質檢查清單（Quality Checklist）](#品質檢查清單quality-checklist)

---

## 總覽（Overview）

本文件提供以 **MCP Java SDK** 實作 MCP Server 的建議做法與範例，重點放在：

- 以 `McpServer.sync(...)` / `McpServer.async(...)` 建立伺服器
- 以 `Tool` + `SyncToolSpecification` / `AsyncToolSpecification` 註冊 tools
- 支援 `stdio`（本機）與 `Streamable HTTP`（遠端）傳輸
- 用 JSON Schema 定義 `inputSchema` / `outputSchema`，並回傳 `structuredContent`

參考：
- MCP Spec（Tools）：`https://modelcontextprotocol.io/specification/2025-11-25/server/tools.md`
- MCP Spec（Transports）：`https://modelcontextprotocol.io/specification/2025-11-25/basic/transports.md`
- MCP Java SDK README：`https://raw.githubusercontent.com/modelcontextprotocol/java-sdk/main/README.md`
- MCP Java SDK Docs（Server）：`https://modelcontextprotocol.github.io/java-sdk/latest/server/`

---

## 快速參考（Quick Reference）

### 主要匯入（Key Imports）

```java
import com.fasterxml.jackson.databind.ObjectMapper;
import io.modelcontextprotocol.server.McpServer;
import io.modelcontextprotocol.server.McpSyncServer;
import io.modelcontextprotocol.server.McpServerFeatures.SyncToolSpecification;
import io.modelcontextprotocol.server.transport.StdioServerTransportProvider;
import io.modelcontextprotocol.spec.McpSchema;
import io.modelcontextprotocol.spec.McpSchema.CallToolRequest;
import io.modelcontextprotocol.spec.McpSchema.CallToolResult;
import io.modelcontextprotocol.spec.McpSchema.ServerCapabilities;
import io.modelcontextprotocol.spec.McpSchema.Tool;
import java.util.List;
import java.util.Map;
```

### 最小可用：stdio + 1 個 tool（Sync）

```java
ObjectMapper mapper = new ObjectMapper();
StdioServerTransportProvider transport = new StdioServerTransportProvider(mapper);

var emptyObjectSchema = new McpSchema.JsonSchema(
    "object",
    Map.of(),
    List.of(),
    false,
    null,
    null
);

McpSyncServer server = McpServer.sync(transport)
    .serverInfo("example-mcp-server", "1.0.0")
    .capabilities(ServerCapabilities.builder()
        .tools(true)
        .build())
    .toolCall(
        Tool.builder()
            .name("example_echo")
            .title("Echo")
            .description("Echo input text back to the caller")
            .inputSchema(new McpSchema.JsonSchema(
                "object",
                Map.of(
                    "text", Map.of(
                        "type", "string",
                        "description", "Text to echo"
                    )
                ),
                List.of("text"),
                false,
                null,
                null
            ))
            .build(),
        (exchange, request) -> {
            String text = String.valueOf(request.arguments().get("text"));
            return CallToolResult.builder()
                .content(List.of(new McpSchema.TextContent(text)))
                .structuredContent(Map.of("text", text))
                .build();
        }
    )
    .build();

// Keep process alive for stdio-based hosts.
// The transport handles stdin/stdout message processing; your app just shouldn't exit immediately.
Thread.currentThread().join();
```

---

## MCP Java SDK

### 依賴（Dependencies）

最簡單：使用 convenience bundle `io.modelcontextprotocol.sdk:mcp`（內含 `mcp-core` + Jackson 3 JSON 實作）。

Maven：

```xml
<dependency>
  <groupId>io.modelcontextprotocol.sdk</groupId>
  <artifactId>mcp</artifactId>
  <version>1.0.0</version>
</dependency>
```

Gradle：

```gradle
dependencies {
  implementation "io.modelcontextprotocol.sdk:mcp:1.0.0"
}
```

如果你需要統一管理版本，使用 BOM（`mcp-bom`）。版本請以 Maven Central 為準。

### Sync / Async 風格

- **Sync**：`McpServer.sync(...)` + handler 直接回傳結果
- **Async**：`McpServer.async(...)` + handler 回傳 Reactor `Mono<...>`（適合非同步 I/O / streaming）

如果你的 tool 都是呼叫外部 HTTP / DB，通常選 Async 比較自然；若只是包裝同步 SDK 或單機工具，Sync 更簡單。

---

## 專案結構（Project Structure）

建議將 MCP server 當作獨立可執行程式：

```
{service}-mcp-server/
├── pom.xml
├── README.md
└── src/main/java/
    └── com/example/mcp/
        ├── Main.java
        ├── tools/
        │   ├── EchoTools.java
        │   └── ...
        └── services/
            ├── ApiClient.java
            └── ...
```

原則：
- 把「外部 API client、認證、重試、錯誤格式化」放 `services/`
- `tools/` 只做參數解析、呼叫 service、格式化輸出（Markdown/JSON/structuredContent）

---

## 傳輸（Transports）

MCP 規格定義標準傳輸：

- `stdio`：本機整合（client 啟動你的 JVM 程序，以 stdin/stdout 交換 JSON-RPC，一行一個 JSON）
- `Streamable HTTP`：遠端服務（單一 endpoint，同時支援 POST/GET + SSE）

SDK 內建（核心 `mcp` 模組就有）：

### stdio（本機，推薦起步）

```java
StdioServerTransportProvider transport = new StdioServerTransportProvider(new ObjectMapper());
McpSyncServer server = McpServer.sync(transport)
    .serverInfo("my-server", "1.0.0")
    .capabilities(ServerCapabilities.builder().tools(true).build())
    .build();
```

注意：stdio 模式 **stdout 只能輸出 MCP 訊息**；日誌請寫到 stderr。

### Streamable HTTP（遠端）

Java SDK 提供 Servlet 版 Streamable HTTP transport provider（核心 `mcp` 模組內）。
實作上通常會把 provider 註冊成 Servlet（例如在 Spring WebMVC / Servlet 容器）。

同時務必遵循 Spec：檢查 `Origin`、本機綁 127.0.0.1、加認證。

---

## Tool 實作（Tool Implementation）

### Tool 命名

Spec 建議 tool name 使用 ASCII 字母/數字/`_`/`-`/`.`，長度 1–128，且在 server 內唯一。
本 repo 的通用建議是加上服務前綴避免衝突：`{service}_{action}_{resource}`。

### Sync Tool：建議模式

Java SDK 推薦用 `SyncToolSpecification.builder()` + `CallToolRequest` 取得 arguments：

```java
var schema = new McpSchema.JsonSchema(
    "object",
    Map.of(
        "a", Map.of("type", "number", "description", "First operand"),
        "b", Map.of("type", "number", "description", "Second operand")
    ),
    List.of("a", "b"),
    false,
    null,
    null
);

var tool = SyncToolSpecification.builder()
    .tool(Tool.builder()
        .name("example_add")
        .title("Add")
        .description("Add two numbers")
        .inputSchema(schema)
        .outputSchema(Map.of(
            "type", "object",
            "properties", Map.of(
                "sum", Map.of("type", "number")
            ),
            "required", List.of("sum")
        ))
        .build())
    .callHandler((exchange, request) -> {
        double a = ((Number) request.arguments().get("a")).doubleValue();
        double b = ((Number) request.arguments().get("b")).doubleValue();
        double sum = a + b;

        Map<String, Object> structured = Map.of("sum", sum);
        return CallToolResult.builder()
            .content(List.of(new McpSchema.TextContent("{\"sum\":" + sum + "}")))
            .structuredContent(structured)
            .build();
    })
    .build();

McpSyncServer server = McpServer.sync(transport)
    .serverInfo("example-mcp-server", "1.0.0")
    .capabilities(ServerCapabilities.builder().tools(true).build())
    .build();

server.addTool(tool);
```

### Async Tool：外部 I/O（HTTP/DB）

Async 版本的 handler 回傳 `Mono<CallToolResult>`：

```java
var asyncTool = io.modelcontextprotocol.server.McpServerFeatures.AsyncToolSpecification.builder()
    .tool(Tool.builder()
        .name("example_lookup")
        .description("Lookup something asynchronously")
        .inputSchema(schema)
        .build())
    .callHandler((exchange, request) ->
        someMonoRequest(request)
            .map(data -> CallToolResult.builder()
                .addTextContent(data)
                .build())
    )
    .build();
```

---

## JSON Schema（Input/Output Schema）

### inputSchema

在 Java SDK 裡，`Tool.inputSchema` 型別是 `McpSchema.JsonSchema`：

- `type` 通常用 `"object"`
- `properties` 放 JSON Schema 片段（`Map<String, Object>`）
- `required` 建議填清楚
- `additionalProperties` 建議 `false`（避免模型塞多餘欄位）

### outputSchema

`Tool.outputSchema` 是可選（`Map<String, Object>`），用來描述 `CallToolResult.structuredContent` 的結構。
如果你提供了 `outputSchema`，你就應該確保 `structuredContent` 符合它。

---

## 回應格式（Tool Result Formats）

MCP tool result 的核心是 `CallToolResult`：

- `content`: 一組內容（最常用 `TextContent`）
- `structuredContent`: 可選的 JSON object（建議有就提供）
- `isError`: tool 執行錯誤（注意：這是 tool-level error，不是 protocol error）

建議模式（對 structured output）：

1. `structuredContent` 放乾淨的 JSON 結構（Map / record / POJO 皆可，視 mapper 支援）
2. `content` 同時回傳序列化後的 JSON（TextContent），便於舊 client 或人類檢視

---

## 錯誤處理（Error Handling）

MCP 區分兩類錯誤：

1. **Protocol errors**（JSON-RPC error）：請求結構不對、未知 method、未知 tool 等
2. **Tool execution errors**（回在 `CallToolResult.isError=true`）：輸入值不合理、外部 API 失敗、業務規則不允許等

建議對「可讓模型自我修正」的問題（例如輸入 validation）回 tool execution error：

```java
return CallToolResult.builder()
    .isError(true)
    .content(List.of(new McpSchema.TextContent(
        "Invalid 'date': must be ISO-8601 (YYYY-MM-DD). Example: 2026-02-26"
    )))
    .build();
```

錯誤訊息要可執行：包含期待格式、可用範例、下一步建議（例如加 filter/縮小範圍）。

---

## 建置與執行（Building and Running）

### Maven

```bash
mvn -q -DskipTests package
java -jar target/{artifact}.jar
```

### Gradle

```bash
./gradlew build
java -jar build/libs/{artifact}.jar
```

stdio server 需要保持程序存活（host 會透過 stdin/stdout 交換訊息）。

---

## 用 MCP Inspector 測試（Testing with MCP Inspector）

MCP Inspector 可用來手動呼叫 `tools/list` / `tools/call`、檢查 schema、觀察回應。

```bash
npx @modelcontextprotocol/inspector
```

在 Inspector 裡選擇 stdio 模式，Command 設為：

```text
java -jar build/libs/{artifact}.jar
```

如果你的 server 會印 log，請確保寫到 stderr（不要污染 stdout）。

---

## 品質檢查清單（Quality Checklist）

- [ ] Tool 名稱一致、可發現（動詞導向 + 服務前綴），且穩定不亂改
- [ ] 每個 tool 都有清楚 `description`，說明輸入、輸出、限制與錯誤
- [ ] `inputSchema` 完整（含 required / additionalProperties=false）
- [ ] 有 `structuredContent` 並盡量提供 `outputSchema`
- [ ] 回應大小可控（必要時加入分頁、filter、截斷提示）
- [ ] 失敗時回 `isError=true` 且錯誤可引導重試
- [ ] stdio：stdout 不輸出任何 log
- [ ] Streamable HTTP：驗 `Origin`、綁 localhost（本機）、加認證/授權
