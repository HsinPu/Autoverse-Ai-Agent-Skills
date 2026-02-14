# Node/TypeScript MCP Server 實作指南（Implementation Guide）

## 目錄（Table of Contents）

- [總覽（Overview）](#總覽overview)
- [快速參考（Quick Reference）](#快速參考quick-reference)
- [MCP TypeScript SDK](#mcp-typescript-sdk)
- [伺服器命名規範（Server Naming Convention）](#伺服器命名規範server-naming-convention)
- [專案結構（Project Structure）](#專案結構project-structure)
- [Tool 實作（Tool Implementation）](#tool-實作tool-implementation)
- [Zod Schema 輸入驗證（Zod Schemas for Input Validation）](#zod-schema-輸入驗證zod-schemas-for-input-validation)
- [回應格式選項（Response Format Options）](#回應格式選項response-format-options)
- [分頁實作（Pagination Implementation）](#分頁實作pagination-implementation)
- [字元上限與截斷（Character Limits and Truncation）](#字元上限與截斷character-limits-and-truncation)
- [錯誤處理（Error Handling）](#錯誤處理error-handling)
- [共用工具（Shared Utilities）](#共用工具shared-utilities)
- [Async/Await 最佳實踐（Async/Await Best Practices）](#asyncawait-最佳實踐asyncawait-best-practices)
- [TypeScript 最佳實踐（TypeScript Best Practices）](#typescript-最佳實踐typescript-best-practices)
- [套件設定（Package Configuration）](#套件設定package-configuration)
- [完整範例（Complete Example）](#完整範例complete-example)
- [進階 MCP 功能（Advanced MCP Features）](#進階-mcp-功能advanced-mcp-features)
- [程式碼最佳實踐（Code Best Practices）](#程式碼最佳實踐code-best-practices)
- [建置與執行（Building and Running）](#建置與執行building-and-running)
- [品質檢查清單（Quality Checklist）](#品質檢查清單quality-checklist)

---

## 總覽（Overview）

本文件提供以 MCP TypeScript SDK 實作 MCP 伺服器時，Node/TypeScript 專用的最佳實踐與範例。涵蓋專案結構、伺服器設定、tool 註冊模式、以 Zod 做輸入驗證、錯誤處理，以及完整可運作範例。

---

## 快速參考（Quick Reference）

### 主要匯入（Key Imports）
```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import express from "express";
import { z } from "zod";
```

### 伺服器初始化（Server Initialization）
```typescript
const server = new McpServer({
  name: "service-mcp-server",
  version: "1.0.0"
});
```

### Tool 註冊模式（Tool Registration Pattern）
```typescript
server.registerTool(
  "tool_name",
  {
    title: "Tool Display Name",
    description: "What the tool does",
    inputSchema: { param: z.string() },
    outputSchema: { result: z.string() }
  },
  async ({ param }) => {
    const output = { result: `Processed: ${param}` };
    return {
      content: [{ type: "text", text: JSON.stringify(output) }],
      structuredContent: output // Modern pattern for structured data
    };
  }
);
```

---

## MCP TypeScript SDK

官方 MCP TypeScript SDK 提供：
- `McpServer` 類別用於伺服器初始化
- `registerTool` 方法用於 tool 註冊
- Zod schema 整合以進行執行期輸入驗證
- 型別安全的 tool handler 實作

**重要：僅使用現代 API**
- **請使用**：`server.registerTool()`、`server.registerResource()`、`server.registerPrompt()`
- **請勿使用**：已棄用的舊 API，如 `server.tool()`、`server.setRequestHandler(ListToolsRequestSchema, ...)` 或手動註冊 handler
- `register*` 方法提供較佳型別安全、自動 schema 處理，為建議做法

完整細節請見 MCP SDK 文件。

## 伺服器命名規範（Server Naming Convention）

Node/TypeScript MCP 伺服器須遵循下列命名：
- **格式**：`{service}-mcp-server`（小寫、連字號）
- **範例**：`github-mcp-server`、`jira-mcp-server`、`stripe-mcp-server`

名稱應：具通用性、能描述所整合的服務/API、易從任務描述推斷、且不含版本號或日期。

## 專案結構（Project Structure）

Node/TypeScript MCP 伺服器建議採用下列結構：

```
{service}-mcp-server/
├── package.json
├── tsconfig.json
├── README.md
├── src/
│   ├── index.ts          # Main entry point with McpServer initialization
│   ├── types.ts          # TypeScript type definitions and interfaces
│   ├── tools/            # Tool implementations (one file per domain)
│   ├── services/         # API clients and shared utilities
│   ├── schemas/          # Zod validation schemas
│   └── constants.ts      # Shared constants (API_URL, CHARACTER_LIMIT, etc.)
└── dist/                 # Built JavaScript files (entry point: dist/index.js)
```

## Tool 實作（Tool Implementation）

### Tool 命名（Tool Naming）

Tool 名稱使用 snake_case（如 "search_users"、"create_project"、"get_channel_info"），並採用清楚、動詞導向的名稱。

**避免命名衝突**：加上服務前綴以區隔：
- 用 "slack_send_message" 而非僅 "send_message"
- 用 "github_create_issue" 而非僅 "create_issue"
- 用 "asana_list_tasks" 而非僅 "list_tasks"

### Tool 結構（Tool Structure）

以 `registerTool` 註冊 tool 時須符合：
- 使用 Zod schema 做執行期輸入驗證與型別安全
- `description` 須**明確提供**，JSDoc 註解不會自動擷取
- 明確提供 `title`、`description`、`inputSchema`、`annotations`
- `inputSchema` 須為 Zod schema 物件（非 JSON schema）
- 所有參數與回傳值皆須有型別

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({
  name: "example-mcp",
  version: "1.0.0"
});

// Zod schema for input validation
const UserSearchInputSchema = z.object({
  query: z.string()
    .min(2, "Query must be at least 2 characters")
    .max(200, "Query must not exceed 200 characters")
    .describe("Search string to match against names/emails"),
  limit: z.number()
    .int()
    .min(1)
    .max(100)
    .default(20)
    .describe("Maximum results to return"),
  offset: z.number()
    .int()
    .min(0)
    .default(0)
    .describe("Number of results to skip for pagination"),
  response_format: z.nativeEnum(ResponseFormat)
    .default(ResponseFormat.MARKDOWN)
    .describe("Output format: 'markdown' for human-readable or 'json' for machine-readable")
}).strict();

// Type definition from Zod schema
type UserSearchInput = z.infer<typeof UserSearchInputSchema>;

server.registerTool(
  "example_search_users",
  {
    title: "Search Example Users",
    description: `Search for users in the Example system by name, email, or team.

This tool searches across all user profiles in the Example platform, supporting partial matches and various search filters. It does NOT create or modify users, only searches existing ones.

Args:
  - query (string): Search string to match against names/emails
  - limit (number): Maximum results to return, between 1-100 (default: 20)
  - offset (number): Number of results to skip for pagination (default: 0)
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')

Returns:
  For JSON format: Structured data with schema:
  {
    "total": number,           // Total number of matches found
    "count": number,           // Number of results in this response
    "offset": number,          // Current pagination offset
    "users": [
      {
        "id": string,          // User ID (e.g., "U123456789")
        "name": string,        // Full name (e.g., "John Doe")
        "email": string,       // Email address
        "team": string,        // Team name (optional)
        "active": boolean      // Whether user is active
      }
    ],
    "has_more": boolean,       // Whether more results are available
    "next_offset": number      // Offset for next page (if has_more is true)
  }

Examples:
  - Use when: "Find all marketing team members" -> params with query="team:marketing"
  - Use when: "Search for John's account" -> params with query="john"
  - Don't use when: You need to create a user (use example_create_user instead)

Error Handling:
  - Returns "Error: Rate limit exceeded" if too many requests (429 status)
  - Returns "No users found matching '<query>'" if search returns empty`,
    inputSchema: UserSearchInputSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true
    }
  },
  async (params: UserSearchInput) => {
    try {
      // Input validation is handled by Zod schema
      // Make API request using validated parameters
      const data = await makeApiRequest<any>(
        "users/search",
        "GET",
        undefined,
        {
          q: params.query,
          limit: params.limit,
          offset: params.offset
        }
      );

      const users = data.users || [];
      const total = data.total || 0;

      if (!users.length) {
        return {
          content: [{
            type: "text",
            text: `No users found matching '${params.query}'`
          }]
        };
      }

      // Prepare structured output
      const output = {
        total,
        count: users.length,
        offset: params.offset,
        users: users.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          ...(user.team ? { team: user.team } : {}),
          active: user.active ?? true
        })),
        has_more: total > params.offset + users.length,
        ...(total > params.offset + users.length ? {
          next_offset: params.offset + users.length
        } : {})
      };

      // Format text representation based on requested format
      let textContent: string;
      if (params.response_format === ResponseFormat.MARKDOWN) {
        const lines = [`# User Search Results: '${params.query}'`, "",
          `Found ${total} users (showing ${users.length})`, ""];
        for (const user of users) {
          lines.push(`## ${user.name} (${user.id})`);
          lines.push(`- **Email**: ${user.email}`);
          if (user.team) lines.push(`- **Team**: ${user.team}`);
          lines.push("");
        }
        textContent = lines.join("\n");
      } else {
        textContent = JSON.stringify(output, null, 2);
      }

      return {
        content: [{ type: "text", text: textContent }],
        structuredContent: output // Modern pattern for structured data
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: handleApiError(error)
        }]
      };
    }
  }
);
```

## Zod Schema 輸入驗證（Zod Schemas for Input Validation）

Zod 提供執行期型別驗證：

```typescript
import { z } from "zod";

// Basic schema with validation
const CreateUserSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters"),
  email: z.string()
    .email("Invalid email format"),
  age: z.number()
    .int("Age must be a whole number")
    .min(0, "Age cannot be negative")
    .max(150, "Age cannot be greater than 150")
}).strict();  // Use .strict() to forbid extra fields

// Enums
enum ResponseFormat {
  MARKDOWN = "markdown",
  JSON = "json"
}

const SearchSchema = z.object({
  response_format: z.nativeEnum(ResponseFormat)
    .default(ResponseFormat.MARKDOWN)
    .describe("Output format")
});

// Optional fields with defaults
const PaginationSchema = z.object({
  limit: z.number()
    .int()
    .min(1)
    .max(100)
    .default(20)
    .describe("Maximum results to return"),
  offset: z.number()
    .int()
    .min(0)
    .default(0)
    .describe("Number of results to skip")
});
```

## 回應格式選項（Response Format Options）

為彈性起見，支援多種輸出格式：

```typescript
enum ResponseFormat {
  MARKDOWN = "markdown",
  JSON = "json"
}

const inputSchema = z.object({
  query: z.string(),
  response_format: z.nativeEnum(ResponseFormat)
    .default(ResponseFormat.MARKDOWN)
    .describe("Output format: 'markdown' for human-readable or 'json' for machine-readable")
});
```

**Markdown 格式**：
- 使用標題、列表與格式以提升可讀性
- 將時間戳轉為人類可讀格式
- 顯示名稱並在括號內附 ID
- 省略冗長 metadata
- 依邏輯分組相關資訊

**JSON 格式**：
- 回傳完整、結構化資料供程式處理
- 包含所有可用欄位與 metadata
- 欄位名稱與型別一致

## 分頁實作（Pagination Implementation）

對會列出資源的 tool：

```typescript
const ListSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0)
});

async function listItems(params: z.infer<typeof ListSchema>) {
  const data = await apiRequest(params.limit, params.offset);

  const response = {
    total: data.total,
    count: data.items.length,
    offset: params.offset,
    items: data.items,
    has_more: data.total > params.offset + data.items.length,
    next_offset: data.total > params.offset + data.items.length
      ? params.offset + data.items.length
      : undefined
  };

  return JSON.stringify(response, null, 2);
}
```

## 字元上限與截斷（Character Limits and Truncation）

加入 CHARACTER_LIMIT 常數以避免回應過大：

```typescript
// At module level in constants.ts
export const CHARACTER_LIMIT = 25000;  // Maximum response size in characters

async function searchTool(params: SearchInput) {
  let result = generateResponse(data);

  // Check character limit and truncate if needed
  if (result.length > CHARACTER_LIMIT) {
    const truncatedData = data.slice(0, Math.max(1, data.length / 2));
    response.data = truncatedData;
    response.truncated = true;
    response.truncation_message =
      `Response truncated from ${data.length} to ${truncatedData.length} items. ` +
      `Use 'offset' parameter or add filters to see more results.`;
    result = JSON.stringify(response, null, 2);
  }

  return result;
}
```

## 錯誤處理（Error Handling）

提供清楚、可執行的錯誤訊息：

```typescript
import axios, { AxiosError } from "axios";

function handleApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response) {
      switch (error.response.status) {
        case 404:
          return "Error: Resource not found. Please check the ID is correct.";
        case 403:
          return "Error: Permission denied. You don't have access to this resource.";
        case 429:
          return "Error: Rate limit exceeded. Please wait before making more requests.";
        default:
          return `Error: API request failed with status ${error.response.status}`;
      }
    } else if (error.code === "ECONNABORTED") {
      return "Error: Request timed out. Please try again.";
    }
  }
  return `Error: Unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`;
}
```

## 共用工具（Shared Utilities）

將共通邏輯抽出為可重複使用的函式：

```typescript
// Shared API request function
async function makeApiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: any,
  params?: any
): Promise<T> {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}/${endpoint}`,
      data,
      params,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
```

## Async/Await 最佳實踐（Async/Await Best Practices）

網路請求與 I/O 一律使用 async/await：

```typescript
// Good: Async network request
async function fetchData(resourceId: string): Promise<ResourceData> {
  const response = await axios.get(`${API_URL}/resource/${resourceId}`);
  return response.data;
}

// Bad: Promise chains
function fetchData(resourceId: string): Promise<ResourceData> {
  return axios.get(`${API_URL}/resource/${resourceId}`)
    .then(response => response.data);  // Harder to read and maintain
}
```

## TypeScript 最佳實踐（TypeScript Best Practices）

1. **啟用嚴格模式**：在 tsconfig.json 啟用 strict mode
2. **定義介面**：為所有資料結構建立清楚的 interface
3. **避免 `any`**：改用適當型別或 `unknown`
4. **以 Zod 做執行期驗證**：用 Zod schema 驗證外部資料
5. **型別守衛**：對複雜型別建立 type guard 函式
6. **錯誤處理**：一律使用 try-catch 並正確檢查錯誤型別
7. **空值安全**：使用 optional chaining（`?.`）與 nullish coalescing（`??`）

```typescript
// Good: Type-safe with Zod and interfaces
interface UserResponse {
  id: string;
  name: string;
  email: string;
  team?: string;
  active: boolean;
}

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  team: z.string().optional(),
  active: z.boolean()
});

type User = z.infer<typeof UserSchema>;

async function getUser(id: string): Promise<User> {
  const data = await apiCall(`/users/${id}`);
  return UserSchema.parse(data);  // Runtime validation
}

// Bad: Using any
async function getUser(id: string): Promise<any> {
  return await apiCall(`/users/${id}`);  // No type safety
}
```

## 套件設定（Package Configuration）

### package.json

```json
{
  "name": "{service}-mcp-server",
  "version": "1.0.0",
  "description": "MCP server for {Service} API integration",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "clean": "rm -rf dist"
  },
  "engines": {
    "node": ">=18"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.6.1",
    "axios": "^1.7.9",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^22.10.0",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 完整範例（Complete Example）

```typescript
#!/usr/bin/env node
/**
 * MCP Server for Example Service.
 *
 * This server provides tools to interact with Example API, including user search,
 * project management, and data export capabilities.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios, { AxiosError } from "axios";

// Constants
const API_BASE_URL = "https://api.example.com/v1";
const CHARACTER_LIMIT = 25000;

// Enums
enum ResponseFormat {
  MARKDOWN = "markdown",
  JSON = "json"
}

// Zod schemas
const UserSearchInputSchema = z.object({
  query: z.string()
    .min(2, "Query must be at least 2 characters")
    .max(200, "Query must not exceed 200 characters")
    .describe("Search string to match against names/emails"),
  limit: z.number()
    .int()
    .min(1)
    .max(100)
    .default(20)
    .describe("Maximum results to return"),
  offset: z.number()
    .int()
    .min(0)
    .default(0)
    .describe("Number of results to skip for pagination"),
  response_format: z.nativeEnum(ResponseFormat)
    .default(ResponseFormat.MARKDOWN)
    .describe("Output format: 'markdown' for human-readable or 'json' for machine-readable")
}).strict();

type UserSearchInput = z.infer<typeof UserSearchInputSchema>;

// Shared utility functions
async function makeApiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: any,
  params?: any
): Promise<T> {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}/${endpoint}`,
      data,
      params,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

function handleApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response) {
      switch (error.response.status) {
        case 404:
          return "Error: Resource not found. Please check the ID is correct.";
        case 403:
          return "Error: Permission denied. You don't have access to this resource.";
        case 429:
          return "Error: Rate limit exceeded. Please wait before making more requests.";
        default:
          return `Error: API request failed with status ${error.response.status}`;
      }
    } else if (error.code === "ECONNABORTED") {
      return "Error: Request timed out. Please try again.";
    }
  }
  return `Error: Unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`;
}

// Create MCP server instance
const server = new McpServer({
  name: "example-mcp",
  version: "1.0.0"
});

// Register tools
server.registerTool(
  "example_search_users",
  {
    title: "Search Example Users",
    description: `[Full description as shown above]`,
    inputSchema: UserSearchInputSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true
    }
  },
  async (params: UserSearchInput) => {
    // Implementation as shown above
  }
);

// Main function
// For stdio (local):
async function runStdio() {
  if (!process.env.EXAMPLE_API_KEY) {
    console.error("ERROR: EXAMPLE_API_KEY environment variable is required");
    process.exit(1);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP server running via stdio");
}

// For streamable HTTP (remote):
async function runHTTP() {
  if (!process.env.EXAMPLE_API_KEY) {
    console.error("ERROR: EXAMPLE_API_KEY environment variable is required");
    process.exit(1);
  }

  const app = express();
  app.use(express.json());

  app.post('/mcp', async (req, res) => {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true
    });
    res.on('close', () => transport.close());
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  });

  const port = parseInt(process.env.PORT || '3000');
  app.listen(port, () => {
    console.error(`MCP server running on http://localhost:${port}/mcp`);
  });
}

// Choose transport based on environment
const transport = process.env.TRANSPORT || 'stdio';
if (transport === 'http') {
  runHTTP().catch(error => {
    console.error("Server error:", error);
    process.exit(1);
  });
} else {
  runStdio().catch(error => {
    console.error("Server error:", error);
    process.exit(1);
  });
}
```

---

## 進階 MCP 功能（Advanced MCP Features）

### 資源註冊（Resource Registration）

以資源形式暴露資料，便於以 URI 存取：

```typescript
import { ResourceTemplate } from "@modelcontextprotocol/sdk/types.js";

// Register a resource with URI template
server.registerResource(
  {
    uri: "file://documents/{name}",
    name: "Document Resource",
    description: "Access documents by name",
    mimeType: "text/plain"
  },
  async (uri: string) => {
    // Extract parameter from URI
    const match = uri.match(/^file:\/\/documents\/(.+)$/);
    if (!match) {
      throw new Error("Invalid URI format");
    }

    const documentName = match[1];
    const content = await loadDocument(documentName);

    return {
      contents: [{
        uri,
        mimeType: "text/plain",
        text: content
      }]
    };
  }
);

// List available resources dynamically
server.registerResourceList(async () => {
  const documents = await getAvailableDocuments();
  return {
    resources: documents.map(doc => ({
      uri: `file://documents/${doc.name}`,
      name: doc.name,
      mimeType: "text/plain",
      description: doc.description
    }))
  };
});
```

**Resources 與 Tools 使用時機**：
- **Resources**：以簡單 URI 參數存取資料時
- **Tools**：需驗證與業務邏輯的複雜操作時
- **Resources**：資料較靜態或具模板時
- **Tools**：操作有副作用或複雜工作流程時

### 傳輸選項（Transport Options）

TypeScript SDK 支援兩種主要傳輸：

#### Streamable HTTP（遠端伺服器建議）

```typescript
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";

const app = express();
app.use(express.json());

app.post('/mcp', async (req, res) => {
  // Create new transport for each request (stateless, prevents request ID collisions)
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true
  });

  res.on('close', () => transport.close());

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.listen(3000);
```

#### stdio（本機整合）

```typescript
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const transport = new StdioServerTransport();
await server.connect(transport);
```

**傳輸選擇**：
- **Streamable HTTP**：Web 服務、遠端存取、多客戶端
- **stdio**：命令列工具、本機開發、子行程整合

### 通知支援（Notification Support）

伺服器狀態變更時通知 client：

```typescript
// Notify when tools list changes
server.notification({
  method: "notifications/tools/list_changed"
});

// Notify when resources change
server.notification({
  method: "notifications/resources/list_changed"
});
```

通知請節制使用，僅在伺服器能力**確實變更**時發送。

---

## 程式碼最佳實踐（Code Best Practices）

### 可組合性與重用（Code Composability and Reusability）

實作須**優先考慮可組合與程式碼重用**：

1. **抽出共通功能**：
   - 為多個 tool 共用的操作建立可重用 helper
   - 以共用的 API client 發送 HTTP 請求，勿重複寫
   - 將錯誤處理集中到工具函式
   - 將業務邏輯抽出為可組合的函式
   - 抽出共用的 Markdown/JSON 欄位選擇與格式化邏輯

2. **避免重複**：
   - 切勿在 tool 之間複製貼上相似程式碼
   - 若相同邏輯寫了兩次，請抽出成函式
   - 分頁、篩選、欄位選擇、格式化等應共用
   - 認證／授權邏輯應集中

## 建置與執行（Building and Running）

執行前務必先建置 TypeScript：

```bash
# Build the project
npm run build

# Run the server
npm start

# Development with auto-reload
npm run dev
```

實作完成前請確認 `npm run build` 成功。

## 品質檢查清單（Quality Checklist）

完成 Node/TypeScript MCP 伺服器前請確認：

### 策略設計（Strategic Design）
- [ ] Tools 支援完整工作流程，而非僅包裝 API 端點
- [ ] Tool 名稱反映自然的任務切分
- [ ] 回應格式有利 agent context 效率
- [ ] 適當處使用人類可讀識別碼
- [ ] 錯誤訊息能引導 agent 正確使用

### 實作品質（Implementation Quality）
- [ ] FOCUSED IMPLEMENTATION: Most important and valuable tools implemented
- [ ] All tools registered using `registerTool` with complete configuration
- [ ] All tools include `title`, `description`, `inputSchema`, and `annotations`
- [ ] Annotations correctly set (readOnlyHint, destructiveHint, idempotentHint, openWorldHint)
- [ ] All tools use Zod schemas for runtime input validation with `.strict()` enforcement
- [ ] All Zod schemas have proper constraints and descriptive error messages
- [ ] All tools have comprehensive descriptions with explicit input/output types
- [ ] Descriptions include return value examples and complete schema documentation
- [ ] Error messages are clear, actionable, and educational

### TypeScript 品質（TypeScript Quality）
- [ ] 所有資料結構皆有 TypeScript interface
- [ ] tsconfig.json 已啟用 strict
- [ ] 不使用 `any`，改用 `unknown` 或適當型別
- [ ] 所有 async 函式有明確的 Promise<T> 回傳型別
- [ ] 錯誤處理使用適當 type guard（如 `axios.isAxiosError`、`z.ZodError`）

### 進階功能（視情況）（Advanced Features）
- [ ] 適當的資料端點已註冊為 Resources
- [ ] 已設定適當傳輸（stdio 或 streamable HTTP）
- [ ] 動態伺服器能力已實作通知
- [ ] 與 SDK 介面型別一致

### 專案設定（Project Configuration）
- [ ] package.json 含所有必要依賴
- [ ] 建置腳本在 dist/ 產出可執行 JavaScript
- [ ] 主入口正確設為 dist/index.js
- [ ] 伺服器名稱符合 `{service}-mcp-server`
- [ ] tsconfig.json 已正確設定 strict mode

### 程式碼品質（Code Quality）
- [ ] 適用處已正確實作分頁
- [ ] 大回應會檢查 CHARACTER_LIMIT 並以清楚訊息截斷
- [ ] 對可能很大的結果集提供篩選選項
- [ ] 所有網路操作妥善處理逾時與連線錯誤
- [ ] 共通功能已抽出為可重用函式
- [ ] 相似操作的回傳型別一致

### 測試與建置（Testing and Build）
- [ ] `npm run build` 無錯誤完成
- [ ] 已產生且可執行的 dist/index.js
- [ ] 伺服器可執行：`node dist/index.js --help`
- [ ] 所有 import 正確解析
- [ ] 範例 tool 呼叫運作正常