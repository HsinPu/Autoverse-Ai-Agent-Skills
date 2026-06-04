# Autoverse AI Agent Skills

可重複使用的 Agent Skill 模組，方便在 Cursor 等 AI Agent 中套用與分享。

![License](https://img.shields.io/github/license/HsinPu/Autoverse-Ai-Agent-Skills)
![Version](https://img.shields.io/npm/v/autoverse-ai-agent-skills)
![Node](https://img.shields.io/node/v/autoverse-ai-agent-skills)

---

## 什麼是 Skill？

Skill 是擴充 AI Agent 能力的**模組化套件**：把專業知識、工作流程或工具用法寫成一份份可觸發的指引，讓 Agent 在對的時機自動載入對的說明，不必每次都從頭交代。

---

## 快速開始

### 方式一：免 Node 一鍵安裝（推薦）

Windows PowerShell：

安裝所有 skills 到 Codex：
```powershell
powershell -ExecutionPolicy Bypass -NoProfile -Command '$s = irm https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.ps1; & ([scriptblock]::Create($s)) -Agent codex'
```

安裝單一 skill 到 Codex：
```powershell
powershell -ExecutionPolicy Bypass -NoProfile -Command '$s = irm https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.ps1; & ([scriptblock]::Create($s)) -Agent codex -Skill python-development'
```

Linux / macOS：

安裝所有 skills 到 Codex：
```bash
curl -fsSL https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.sh | bash -s -- --agent codex
```

安裝單一 skill 到 Codex：
```bash
curl -fsSL https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.sh | bash -s -- --agent codex --skill python-development
```

安全預覽：

```powershell
powershell -ExecutionPolicy Bypass -NoProfile -Command '$s = irm https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.ps1; & ([scriptblock]::Create($s)) -Agent codex -DryRun'
```

```bash
curl -fsSL https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.sh | bash -s -- --agent codex --dry-run
```

> 必須指定 `Agent`；未指定 `Skill` 時會安裝全部 skills。若目標 skill 已存在，installer 只會在 `.skill-meta.json` 顯示同一個 repo 時更新。沒有 metadata 或來源不同的同名資料夾會被停止保護；確認要覆蓋時才使用 `-Force` / `--force`。

強制覆蓋未知同名資料夾：
```powershell
powershell -ExecutionPolicy Bypass -NoProfile -Command '$s = irm https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.ps1; & ([scriptblock]::Create($s)) -Agent codex -Skill python-development -Force'
```

```bash
curl -fsSL https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.sh | bash -s -- --agent codex --skill python-development --force
```

### 方式二：手動複製

將需要的 skill 資料夾複製到你的 Agent 對應目錄（詳見下方「放置位置」）。

---

## 通用寫程式流程對應 Skills

以下是常見的通用流程，不是每個小改動都要跑完全部步驟；大型需求或多人協作時會更完整。

| 順序 | 階段 | 何時需要 | 對應 Skills |
|---|---|---|---|
| 1 | 需求釐清 | 幾乎都需要 | `ask-questions-if-underspecified` |
| 2 | 任務拆解 | 幾乎都需要 | `todo-first` |
| 3 | 規格/設計 | 規模較大、多人協作時 | `specification-authoring` |
| 4 | 資料設計 | 有資料庫或資料模型時 | `database-design`, `sql-best-practices` |
| 5 | 架構診斷 | 專案架構不清、想比較調整方向時 | `project-architecture-review` |
| 6 | 程式實作 | 幾乎都需要 | `python-development`, `python-data-engineering`, `python-web-scraping`, `python-automation-scripting`, `python-backend-development`, `python-testing-engineering`, `python-observability-debugging`, `python-packaging-release`, `python-concurrency-patterns`, `python-security-hardening`, `python-api-client-development`, `java-development`, `java-architecture`, `java-testing`, `jvm-build-tooling`, `jpa-hibernate-development`, `javascript-development`, `desktop-development`, `typescript-development`, `spring-development`, `spring-security`, `spring-webflux`, `spring-cloud-microservices`, `vue-development`, `nuxt-development`, `css-development`, `tailwind-development`, `frontend-design`, `react-ui-patterns`, `mybatis-development`, `jquery-development`, `mcp-creator-design`, `api-doc-comments`, `openapi-spec-generation`, `i18n-localization` |
| 7 | 驗證/修正 | 幾乎都需要 | `code-review`, `logging-patterns` |
| 8 | 重構 | 視需要 | `code-refactoring` |
| 9 | 文件交付 | 對外交付或交接時 | `document-to-markdown`, `markdown-writer`, `git-readme-writer` |
| 10 | 版本控制 | 幾乎都需要 | `git-operations`, `github-operations` |

Python、Java、前端的差別主要只在第 6 步的實作 skill，流程順序本身大致相同。

如果有部署或維運需求，再接 `deployment-operations` 或對應技術棧 skill。

---

## 收錄 Skills

目前共收錄 **175** 個 skills：**140** 個 Development、**20** 個 Productivity、**7** 個 Browser Automation、**1** 個 Search & Research、**3** 個 Coding Agents & IDEs、**1** 個 Communication、**3** 個 CLI Utilities。

### 前端技能快速索引（按用途）

如果你同時會做實作、視覺與互動，可以先看這裡；下方總表仍保留完整清單。

**核心語言**

- `javascript-development`
- `typescript-development`

**React / 元件與狀態**

- `react-ui-patterns`
- `react-perf`
- `nextjs-development`
- `react-native-expo`
- `flutter-development`
- `mobile-app-testing`
- `app-store-release`
- `firebase-development`
- `postgres-operations`
- `redis-upstash`
- `mongodb-development`
- `frontend-testing`
- `frontend-code-review`
- `shadcn-ui`
- `lobe-ui-development`
- `lobe-icons-usage`

**CSS / Layout**

- `css-development`
- `tailwind-development`
- `responsive-design`
- `tailwind-patterns`
- `ui-styling`

**視覺設計**

- `frontend-design`
- `design-consultation`
- `color-font-skill`
- `dashboard-design`
- `design-system`
- `design-system-patterns`
- `frontend-design-review`
- `logo-design`

**影像 / 影片 / 音訊**

- `ai-image-prompt-design`
- `ai-image-prompts-skill`
- `openai-api-development`
- `agents-sdk-development`
- `rag-vector-search`
- `llm-evals`
- `baoyu-image-gen`
- `stable-diffusion-image-generation`
- `image-utils`
- `remotion-video-toolkit`
- `video-edit`
- `ai-video-generation`
- `ai-video-prompting`
- `storyboard-creation`
- `vlog-production`
- `short-video-script`
- `ugc-video-ads`
- `avatar-video-generation`
- `text-to-speech`
- `audio-transcription`
- `subtitle-captions`
- `audio-generation`

**可用性 / 互動**

- `animation-best-practices`
- `interaction-patterns`
- `ux-writing`
- `hotkey`
- `command-palette`

**其他前端框架**

- `vue-development`
- `vue-composition-api`
- `vue-testing`
- `pinia-state-management`
- `vue-router-patterns`
- `vite`
- `vue-debug-guides`
- `nuxt-development`
- `supabase-development`
- `stripe-payments`
- `auth-integration`
- `prisma-drizzle`
- `vercel-deployment`
- `cloudflare-development`
- `aws-operations`
- `jquery-development`
- `jquery-version-migration`
- `jquery-4-migration`
- `legacy-frontend-modernization`
- `frontend-stack-inference`

### 🛠️ Development（開發）

| Skill | 說明 |
|-------|------|
| **[typescript-development](skills/typescript-development/)** | TypeScript / JavaScript 開發參考（型別安全、設計模式、重構、TS patterns） |
| **[javascript-development](skills/javascript-development/)** | 現代 JavaScript 開發最佳實踐（Node.js 與瀏覽器） |
| **[vite](skills/vite/)** | Vite build tool、vite.config.ts、plugins、SSR、migration |
| **[nextjs-development](skills/nextjs-development/)** | Next.js App Router、Server/Client Components、data fetching、cache、Server Actions、Route Handlers 與 deployment |
| **[react-native-expo](skills/react-native-expo/)** | React Native / Expo、Expo Router、EAS Build / Update / Submit、permissions、device testing 與 store readiness |
| **[flutter-development](skills/flutter-development/)** | Flutter / Dart、widgets、layout、state management、navigation、testing、performance、accessibility、build 與 release |
| **[mobile-app-testing](skills/mobile-app-testing/)** | iOS / Android device matrix、permissions、offline、deep links、push、crash reporting、accessibility 與 Maestro/Appium/Detox |
| **[app-store-release](skills/app-store-release/)** | App Store Connect、TestFlight、Google Play Console、privacy labels、Data Safety、review、rollout 與 rejection handling |
| **[python-development](skills/python-development/)** | Python 開發參考（專案架構、PEP 8、型別、Docstring、設計模式、現代工具鏈） |
| **[python-data-engineering](skills/python-data-engineering/)** | Python 資料工程 / 分析 / ETL（DataFrame、Jupyter、Parquet、Pipeline） |
| **[python-web-scraping](skills/python-web-scraping/)** | Python 網頁擷取 / Scraping（HTML 解析、分頁、去重、輸出） |
| **[python-automation-scripting](skills/python-automation-scripting/)** | Python 自動化 / 腳本（CLI、檔案系統、subprocess、批次作業） |
| **[python-backend-development](skills/python-backend-development/)** | Python 後端 / Web App（Django、Flask、ASGI/WSGI、ORM、migrations） |
| **[python-testing-engineering](skills/python-testing-engineering/)** | Python 測試工程（pytest、fixtures、mocking、async tests） |
| **[python-observability-debugging](skills/python-observability-debugging/)** | Python 除錯 / 可觀測性（traceback、profiling、memory、診斷） |
| **[python-packaging-release](skills/python-packaging-release/)** | Python 打包 / 發佈（build backend、wheel/sdist、versioning、release） |
| **[python-concurrency-patterns](skills/python-concurrency-patterns/)** | Python 並行模式（asyncio、TaskGroup、cancellation、backpressure） |
| **[python-security-hardening](skills/python-security-hardening/)** | Python 安全硬化（secrets、unsafe deserialization、subprocess / path boundaries） |
| **[python-api-client-development](skills/python-api-client-development/)** | Python API client / SDK（OpenAPI、auth、pagination、retries、error mapping） |
| **[java-development](skills/java-development/)** | Java 開發參考（程式碼風格、Javadoc、SOLID、設計模式） |
| **[java-architecture](skills/java-architecture/)** | Java 架構設計（Clean Architecture、Hexagonal、DDD、microservice boundaries） |
| **[java-testing](skills/java-testing/)** | Java 測試工程（JUnit 5、Mockito、AssertJ、Spring test slices、Testcontainers） |
| **[jvm-build-tooling](skills/jvm-build-tooling/)** | JVM 建置工具（Maven、Gradle、dependency、multi-module、CI build） |
| **[jpa-hibernate-development](skills/jpa-hibernate-development/)** | JPA / Hibernate 資料層（entity、fetch、transaction、repository、效能） |
| **[spring-development](skills/spring-development/)** | Spring / Spring Boot 開發最佳實踐（DI、Web API、Security、Testing） |
| **[spring-security](skills/spring-security/)** | Spring Security（OAuth2/OIDC、JWT、method security、CSRF/CORS、headers） |
| **[spring-webflux](skills/spring-webflux/)** | Spring WebFlux / Reactor reactive APIs（WebClient、backpressure、R2DBC） |
| **[spring-cloud-microservices](skills/spring-cloud-microservices/)** | Spring Cloud microservices（gateway、Resilience4j、Kafka、tracing、service boundaries） |
| **[mybatis-development](skills/mybatis-development/)** | MyBatis 開發最佳實踐（Mapper、XML、Spring 整合、效能優化） |
| **[vue-development](skills/vue-development/)** | Vue 3 開發最佳實踐（Composition API、Pinia、Vue Router、TypeScript） |
| **[vue-composition-api](skills/vue-composition-api/)** | Vue 3 Composition API、`<script setup>`、SFC macros、reactivity、composables |
| **[vue-testing](skills/vue-testing/)** | Vue 測試工程（Vitest、Vue Test Utils、Pinia、Suspense、Teleport、Playwright） |
| **[pinia-state-management](skills/pinia-state-management/)** | Pinia state management（setup stores、storeToRefs、SSR、Nuxt、testing） |
| **[vue-router-patterns](skills/vue-router-patterns/)** | Vue Router 4 路由設計、navigation guards、params/query、route lifecycle |
| **[vue-debug-guides](skills/vue-debug-guides/)** | Vue runtime errors、warnings、SSR/hydration、reactivity 除錯 |
| **[nuxt-development](skills/nuxt-development/)** | Nuxt 3/4 開發最佳實踐（SSR、Nitro、SEO、資料抓取） |
| **[css-development](skills/css-development/)** | CSS 開發最佳實踐（Cascade、RWD、Flex/Grid、維護架構） |
| **[tailwind-development](skills/tailwind-development/)** | Tailwind CSS v4+ 開發最佳實踐（Utility-first、Design Tokens、Dark Mode） |
| **[frontend-design](skills/frontend-design/)** | 建立具辨識度的前端介面與視覺成品（網站、landing page、dashboard、React/HTML/CSS UI） |
| **[color-font-skill](skills/color-font-skill/)** | 配色與字體搭配（palette、font pairing、theme direction） |
| **[animation-best-practices](skills/animation-best-practices/)** | 前端動畫與互動回饋（hover、transition、button feedback、loading motion） |
| **[interaction-patterns](skills/interaction-patterns/)** | 導航互動模式（tab overflow、scroll 行為、view transitions、progressive disclosure） |
| **[dashboard-design](skills/dashboard-design/)** | Dashboard 版面與資訊層級（KPI、cards、analytics、widget arrangement） |
| **[design-consultation](skills/design-consultation/)** | 前端視覺方向規劃（配色、字體、spacing、layout、motion、buttons） |
| **[ux-writing](skills/ux-writing/)** | UI microcopy、空狀態、錯誤訊息、CTA、onboarding 文案優化 |
| **[logo-design](skills/logo-design/)** | Logo / brand mark / SVG 視覺識別設計流程 |
| **[ai-image-prompt-design](skills/ai-image-prompt-design/)** | Flux、Stable Diffusion、Midjourney 等影像生成 prompt 設計 |
| **[ai-image-prompts-skill](skills/ai-image-prompts-skill/)** | AI image prompt library、prompt inspiration、style variants |
| **[baoyu-image-gen](skills/baoyu-image-gen/)** | OpenAI / Google / DashScope 文字生圖、reference image、aspect ratio |
| **[stable-diffusion-image-generation](skills/stable-diffusion-image-generation/)** | Stable Diffusion / Diffusers text-to-image、inpainting、pipeline guidance |
| **[image-utils](skills/image-utils/)** | 圖片 resize、crop、format conversion、optimization 與 deterministic 後處理 |
| **[remotion-video-toolkit](skills/remotion-video-toolkit/)** | Remotion / React 程式化影片、動畫、字幕、音訊與 render workflow |
| **[video-edit](skills/video-edit/)** | 本地影片剪輯、合併、resize、壓縮、轉檔與音訊抽取 |
| **[ai-video-generation](skills/ai-video-generation/)** | AI text-to-video / image-to-video、模型選擇、prompt iteration 與輸出檢查 |
| **[ai-video-prompting](skills/ai-video-prompting/)** | AI 影片 prompt 設計、鏡頭語言、motion、timing、continuity 與 negative prompts |
| **[storyboard-creation](skills/storyboard-creation/)** | 影片分鏡、shot list、timing、voiceover、visual prompt 與 production table |
| **[vlog-production](skills/vlog-production/)** | Vlog concept、story arc、talking-head beats、B-roll、shot list、editing rhythm、captions、title、thumbnail 與 platform packaging |
| **[short-video-script](skills/short-video-script/)** | TikTok / Reels / Shorts 短影音 hook、口播稿、CTA 與 retention scripts |
| **[ugc-video-ads](skills/ugc-video-ads/)** | UGC-style 影片廣告、creator persona、hook、product demo、B-roll 與平台素材 |
| **[avatar-video-generation](skills/avatar-video-generation/)** | AI avatar、digital human、talking-head、lipsync、consent 與 export QA |
| **[text-to-speech](skills/text-to-speech/)** | TTS、voiceover、旁白、朗讀與批次語音生成 workflow |
| **[audio-transcription](skills/audio-transcription/)** | Speech-to-text、錄音/影片轉文字、speaker labels 與 transcript workflow |
| **[subtitle-captions](skills/subtitle-captions/)** | SRT/VTT/ASS 字幕產生、對齊、轉換、校對與燒錄 workflow |
| **[audio-generation](skills/audio-generation/)** | 音樂、音效、ambience、jingle 與 text-to-audio 生成 workflow |
| **[hotkey](skills/hotkey/)** | Web keyboard shortcuts 與 keybindings（hotkeys、command bindings） |
| **[command-palette](skills/command-palette/)** | 指令面板 / quick switcher / Spotlight 式快速執行（搜尋、排序、執行） |
| **[responsive-design](skills/responsive-design/)** | 響應式版面與自適應布局（breakpoints、container queries、fluid typography） |
| **[agent-creator-design](skills/agent-creator-design/)** | System Prompt 設計與寫法（metadata、四段結構、template） |
| **[react-ui-patterns](skills/react-ui-patterns/)** | React UI 狀態模式（loading、error、empty、optimistic、Suspense、transition） |
| **[tailwind-patterns](skills/tailwind-patterns/)** | Tailwind 版面與元件 pattern（layout、buttons、cards、navigation、forms、typography） |
| **[design-system-patterns](skills/design-system-patterns/)** | Design tokens、theming、component patterns、theme switching |
| **[ui-styling](skills/ui-styling/)** | shadcn/ui + Radix + Tailwind 的元件 styling 與視覺打磨 |
| **[frontend-code-review](skills/frontend-code-review/)** | 前端 `.tsx` / `.ts` / `.js` / CSS 變更的功能、狀態、a11y、效能 review |
| **[frontend-design-review](skills/frontend-design-review/)** | UI 實作品質、設計系統、a11y、RWD、視覺層級與互動狀態 review |
| **[frontend-testing](skills/frontend-testing/)** | React / TS 前端 unit、component、RTL tests |
| **[github-operations](skills/github-operations/)** | GitHub 端操作（PR、issue、CI、gh CLI、API 查詢） |
| **[design-system](skills/design-system/)** | 視覺系統生成與稽核（tokens、preview、visual audit、AI slop 檢測） |
| **[shadcn-ui](skills/shadcn-ui/)** | shadcn/ui 元件安裝、組合、表單、主題與 Tailwind/Radix 整合 |
| **[lobe-ui-development](skills/lobe-ui-development/)** | @lobehub/ui React / Next.js / AIGC UI 元件整合 |
| **[lobe-icons-usage](skills/lobe-icons-usage/)** | @lobehub/icons AI / LLM 品牌圖示選用與整合 |
| **[coding-standards](skills/coding-standards/)** | TS/JS/React/Node 通用程式規範與架構標準（lint、format、types、constants/config、避免 hardcoded values、tests、a11y、security） |
| **[karpathy-guidelines](skills/karpathy-guidelines/)** | 降低 LLM coding 常見錯誤的行為準則（釐清假設、避免過度設計、精準修改、可驗證目標） |
| **[jquery-development](skills/jquery-development/)** | jQuery 開發最佳實踐（Legacy 專案、AJAX、安全、遷移指南） |
| **[jquery-version-migration](skills/jquery-version-migration/)** | jQuery 1.x / 2.x / 3.x / 4.x 版本盤點、Migrate warnings 與分段升級路線 |
| **[jquery-4-migration](skills/jquery-4-migration/)** | jQuery 3.x -> 4.x 升級（removed APIs、Migrate、slim/full、WordPress 相容） |
| **[legacy-frontend-modernization](skills/legacy-frontend-modernization/)** | Legacy frontend 漸進式現代化（jQuery/Bootstrap/global scripts 到現代架構） |
| **[frontend-stack-inference](skills/frontend-stack-inference/)** | 前端技術棧盤點（jQuery、Bootstrap、React/Vue、build tools、legacy signals） |
| **[database-design](skills/database-design/)** | 資料庫 Schema 設計、索引優化、Migration 模式（PostgreSQL/MySQL/NoSQL） |
| **[sql-best-practices](skills/sql-best-practices/)** | SQL 撰寫風格、JOIN / subqueries、效能優化與安全性（防 SQL Injection） |
| **[prisma-drizzle](skills/prisma-drizzle/)** | Prisma / Drizzle ORM schema、migrations、relations、query patterns、transactions 與 TypeScript database access |
| **[firebase-development](skills/firebase-development/)** | Firebase Auth、Firestore、Realtime Database、Security Rules、Functions、Storage、FCM、Emulator Suite 與 deploys |
| **[postgres-operations](skills/postgres-operations/)** | PostgreSQL roles、permissions、migrations、indexes、EXPLAIN、VACUUM、backups、replication、pgvector 與 troubleshooting |
| **[redis-upstash](skills/redis-upstash/)** | Redis / Upstash cache、rate limiting、sessions、queues、pub/sub、serverless/edge patterns、TTLs 與 observability |
| **[mongodb-development](skills/mongodb-development/)** | MongoDB schema design、indexes、aggregation pipelines、transactions、change streams、Atlas、security 與 performance |
| **[openai-api-development](skills/openai-api-development/)** | OpenAI Responses API、model selection、structured outputs、function calling、tools、streaming 與 production integration |
| **[agents-sdk-development](skills/agents-sdk-development/)** | OpenAI Agents SDK agents、tools、handoffs、guardrails、tracing、多 agent workflow 與 production observability |
| **[rag-vector-search](skills/rag-vector-search/)** | RAG / vector search ingestion、chunking、embeddings、hybrid retrieval、reranking、citations 與 retrieval evaluation |
| **[llm-evals](skills/llm-evals/)** | LLM evals、golden datasets、graders、prompt regression、trace grading、RAG/agent metrics 與 release gates |
| **[supabase-development](skills/supabase-development/)** | Supabase Postgres、RLS、Auth、Storage、Edge Functions、migrations 與 production workflow |
| **[stripe-payments](skills/stripe-payments/)** | Stripe Checkout、PaymentIntents、subscriptions、webhooks、idempotency、billing 與 payments testing |
| **[auth-integration](skills/auth-integration/)** | Auth.js / NextAuth / Better Auth / Clerk / Auth0 / Supabase Auth 等登入、session、OAuth/OIDC 與 authorization boundaries |
| **[git-operations](skills/git-operations/)** | Git 工作流（clone、branch、stage、commit、push、pull、merge、rebase）與狀態檢查，Windows 環境 |
| **[code-review](skills/code-review/)** | 自動化程式碼審查（正確性、安全、效能、架構、測試）含嚴重度分級 |
| **[security-code-review](skills/security-code-review/)** | 高信心安全 code review（OWASP、XSS、Injection、SSRF、Auth、Secrets） |
| **[react-perf](skills/react-perf/)** | React 效能診斷與優化（re-render、waterfall、bundle、slow UI） |
| **[testing-strategy](skills/testing-strategy/)** | 測試分層、fixtures、flakiness 與 coverage 取捨 |
| **[code-change-workflow](skills/code-change-workflow/)** | 修改既有 code 前先追入口、呼叫鏈、資料流、測試與驗證方式，再做最小安全修改 |
| **[project-architecture-review](skills/project-architecture-review/)** | 跨語言專案架構診斷（entry points、module boundaries、dependency direction、data flow、遷移計畫） |
| **[code-refactoring](skills/code-refactoring/)** | 程式碼重構技巧（Code Smells、magic values 改常數、安全流程、語言無關原則） |
| **[logging-patterns](skills/logging-patterns/)** | 撰寫乾淨一致的 log 訊息模式（level、message shape、context fields、低噪音） |
| **[api-doc-comments](skills/api-doc-comments/)** | 公共 API docstring / Javadoc / TSDoc 內容撰寫（契約、參數、回傳、例外、範例） |
| **[openapi-spec-generation](skills/openapi-spec-generation/)** | OpenAPI 3.1 規格生成、更新、驗證與 contract sync |
| **[api-contract-design](skills/api-contract-design/)** | API request/response 契約、錯誤模型、版本與相容性設計 |
| **[i18n-localization](skills/i18n-localization/)** | i18n / localization、locale files、pluralization、RTL 與翻譯一致性 |
| **[mcp-creator-design](skills/mcp-creator-design/)** | 建立高品質 MCP Server（Python FastMCP / Node/TypeScript MCP SDK）整合外部 API / services |
| **[skill-creator-design](skills/skill-creator-design/)** | 建立與優化 Skill 的完整指南（建立流程、SKILL.md 撰寫） |
| **[skill-lint](skills/skill-lint/)** | SKILL.md 結構驗證、frontmatter、連結與品質檢查 |
| **[skillforge](skills/skillforge/)** | Skill 打包、簽章、版本與評測的 quality gate |
| **[skill-scan](skills/skill-scan/)** | Skill package 第一輪掃描與風險 triage |
| **[skill-explorer](skills/skill-explorer/)** | Skill 搜尋、導覽與分類映射 |
| **[skill-gap-analyzer](skills/skill-gap-analyzer/)** | 比對本地 skills 與外部 marketplace / GitHub 候選，判斷要升級、補新 skill，或維持不變 |
| **[git-advanced](skills/git-advanced/)** | 進階 Git 工作流：worktree、bisect、rebase、recovery、hooks |
| **[github-code-review](skills/github-code-review/)** | GitHub PR / diff / check review，偏向找出具體問題與風險 |
| **[github-inline-review](skills/github-inline-review/)** | 使用 `gh api` 對 GitHub PR 批次送出 inline comments 與 suggestion blocks |
| **[skill-audit](skills/skill-audit/)** | SKILL.md 與 bundled content 的安全 / 品質稽核 |
| **[git-readme-writer](skills/git-readme-writer/)** | 依專案類型與 GitHub / Gerrit 平台差異選擇合適的 README 結構 |
| **[repo-ready](skills/repo-ready/)** | Repo 結構、CI/CD、文件、lint 與 release automation |
| **[deployment-operations](skills/deployment-operations/)** | 部署、rollout / rollback、smoke checks 與上線驗證 |
| **[vercel-deployment](skills/vercel-deployment/)** | Vercel projects、builds、env vars、preview/production deployments、domains、functions、rollback 與 release checks |
| **[cloudflare-development](skills/cloudflare-development/)** | Cloudflare Workers / Pages、Wrangler、bindings、D1、KV、R2、Durable Objects、Queues 與 edge runtime constraints |
| **[aws-operations](skills/aws-operations/)** | AWS IAM、Lambda、API Gateway、S3、CloudFront、ECS、RDS、VPC、CloudWatch、CDK、cost 與 incident response |
| **[github-actions-ci](skills/github-actions-ci/)** | GitHub Actions workflow、matrix、cache、artifacts、permissions 與 secrets |
| **[docker-development](skills/docker-development/)** | Dockerfile、multi-stage build、Compose、healthcheck 與 container workflow |
| **[kubernetes-operations](skills/kubernetes-operations/)** | Kubernetes manifests、kubectl 診斷、rollout、probes、logs 與 events |
| **[terraform-infrastructure](skills/terraform-infrastructure/)** | Terraform / OpenTofu IaC、modules、state、plan/apply、drift 與 backends |
| **[observability-engineering](skills/observability-engineering/)** | Metrics、logs、traces、SLI/SLO、alerts、Grafana / Prometheus / OpenTelemetry |
| **[security-scanning](skills/security-scanning/)** | SAST、dependency scan、secret scan、container / IaC scan、SBOM 與 CI gates |
| **[incident-response-postmortems](skills/incident-response-postmortems/)** | 事故 triage、timeline、root cause 與 postmortem |
| **[spec-flow](skills/spec-flow/)** | 需求拆解、spec、task、execution flow 的文件驅動流程 |

### 📋 Productivity（生產力）

| Skill | 說明 |
|-------|------|
| **[markdown-writer](skills/markdown-writer/)** | Markdown 撰寫指引（README、技術文件、格式化 docs、GFM 規範） |
| **[document-to-markdown](skills/document-to-markdown/)** | 文件轉 Markdown（DOCX、PDF、PPTX、HTML、Google Docs export），轉換後整理 GFM、heading、表格與連結 |
| **[specification-authoring](skills/specification-authoring/)** | 技術規格說明書（Spec）撰寫、重整、審查與 code-to-spec 流程指引 |
| **[todo-first](skills/todo-first/)** | 多步驟或 non-trivial 任務前先建立 todo list（含狀態維護與驗證追蹤） |
| **[ask-questions-if-underspecified](skills/ask-questions-if-underspecified/)** | 需求不明時先問澄清問題（僅使用者明確要求時使用） |
| **[answer-writing](skills/answer-writing/)** | 撰寫最終回應的指引（繁體中文預設、清晰可行動） |
| **[file-organizer](skills/file-organizer/)** | 智慧整理電腦檔案（找重複檔、建議架構、自動清理）Windows 環境 |
| **[folder-structure-cleanup](skills/folder-structure-cleanup/)** | 資料夾結構整理（空資料夾、巢狀層級、合併、命名、active/archive 分離與 dry-run 搬移計畫） |
| **[downloads-desktop-cleanup](skills/downloads-desktop-cleanup/)** | Downloads / Desktop 快速盤點、分類、重複/大型/舊檔候選、dry-run 計畫與安全搬移 |
| **[data-organization-system](skills/data-organization-system/)** | 資料整理系統設計（taxonomy、metadata、lifecycle、retention、privacy 與批次 migration） |
| **[skill-security-review](skills/skill-security-review/)** | 第三方 skill 安全審核（來源、權限、可疑行為、風險分級） |
| **[summary-ops](skills/summary-ops/)** | 網址、影片、音訊與長文摘要 / transcript 擷取 |
| **[web-research-ops](skills/web-research-ops/)** | 網路研究、來源查核與事實交叉比對 |
| **[mcp-ops](skills/mcp-ops/)** | MCP 伺服器與工具操作（auth、list、call、codegen） |
| **[workspace-google-ops](skills/workspace-google-ops/)** | Gmail、Calendar、Drive、Sheets、Docs CLI 自動化 |
| **[word-document-ops](skills/word-document-ops/)** | Word / .docx 文件建立、編輯、轉換與 tracked changes |
| **[spreadsheet-ops](skills/spreadsheet-ops/)** | 試算表 / .xlsx / .csv / .tsv 清理、公式、格式化與產生 |
| **[presentation-ops](skills/presentation-ops/)** | PowerPoint / .pptx 簡報建立、編輯與版面保留 |
| **[pdf-operations](skills/pdf-operations/)** | PDF 讀取、合併、分割、旋轉、OCR、產生與版面保留處理 |
| **[drawio-skill](skills/drawio-skill/)** | draw.io 圖表生成與視覺輸出 |

### 🌐 Coding Agents & IDEs（編碼代理與 IDE）

| Skill | 說明 |
|-------|------|
| **[self-improvement](skills/self-improvement/)** | 錯誤、學習與 feature request 記錄 / project memory |
| **[context-governance](skills/context-governance/)** | context budget、學習記錄與重複資訊治理 |
| **[subagent-architecture](skills/subagent-architecture/)** | subagent 切分、角色邊界、handoff 與平行協作 |

### 🌐 Communication（溝通）

| Skill | 說明 |
|-------|------|
| **[humanizer](skills/humanizer/)** | 將 AI 風格文字改寫得更自然、有人味 |

### 🌐 CLI Utilities（CLI 工具）

| Skill | 說明 |
|-------|------|
| **[terminal-ops](skills/terminal-ops/)** | 終端機執行 / 驗證 / repo 狀態 / 窄修復證據流程 |
| **[skill-executor](skills/skill-executor/)** | Skill 的 sandbox 執行、輸出驗證與可重現性檢查 |
| **[skillctl](skills/skillctl/)** | 本地與外部 skill 搜尋 / 安裝 / 列表 / 更新 / 輕量驗證的 CLI 路由 |

### 🌐 Search & Research（搜尋與研究）

| Skill | 說明 |
|-------|------|
| **[agent-reach-ops](skills/agent-reach-ops/)** | 跨平台研究（社群、影片、GitHub、RSS、轉錄） |

### 🌐 Browser Automation（瀏覽器自動化）

| Skill | 說明 |
|-------|------|
| **[webapp-testing](skills/webapp-testing/)** | Playwright 本地 web app 測試、除錯與截圖 |
| **[browser-automation](skills/browser-automation/)** | 真實瀏覽器操作、表單、截圖、JS-heavy extraction 與 web workflow 自動化 |
| **[playwright-automation](skills/playwright-automation/)** | Playwright locators、screenshots、traces、console/network inspection 與 CLI/MCP 操作 |
| **[chrome-devtools-debugging](skills/chrome-devtools-debugging/)** | Chrome DevTools / CDP console、network、performance、DOM 與 a11y 診斷 |
| **[visual-regression-testing](skills/visual-regression-testing/)** | Screenshot baseline、pixel diff、Percy / Chromatic / BackstopJS 視覺回歸 |
| **[browser-compatibility-testing](skills/browser-compatibility-testing/)** | Chrome / Firefox / Safari / Edge / mobile 跨瀏覽器相容性驗證 |
| **[e2e-testing-patterns](skills/e2e-testing-patterns/)** | Playwright / Cypress E2E 測試設計、flakiness、fixtures 與 CI patterns |

---

## 使用方式

1. **選擇 Skill**：根據你的任務選擇對應的 Skill
2. **放置到正確位置**：將 skill 資料夾複製到你的 Agent 目錄
3. **自動載入**：Agent 會依 `SKILL.md` 中的 `description` 自動判斷何時載入

---

## 放置位置（Install Location）

installer 會依 `-Agent` / `--agent` 自動選擇目標資料夾：

| Agent 參數 | 適用環境 | 安裝位置 | 範圍 | 執行位置 |
|---|---|---|---|---|
| `codex` | Codex | `~/.codex/skills/` | 全域 | 任意目錄 |
| `claude` | Claude Code | `~/.claude/skills/` | 全域 | 任意目錄 |
| `cursor` | Cursor 專案 | `.cursor/skills/` | 目前專案 | 目標專案根目錄 |
| `project` | 通用專案 / portable agent | `.skills/` | 目前專案 | 目標專案根目錄 |
| `vscode` | VS Code / GitHub Copilot 專案 | `.github/skills/` | 目前專案 | 目標專案根目錄 |
| `copilot` | GitHub Copilot 專案 | `.github/skills/` | 目前專案 | 目標專案根目錄 |
| `opencode` | OpenCode 全域 | `~/.config/opencode/skills/` | 全域 | 任意目錄 |
| `opencode-project` | OpenCode 專案 | `.opencode/skills/` | 目前專案 | 目標專案根目錄 |
| `goose` | Goose | `~/.config/goose/skills/` | 全域 | 任意目錄 |
| `amp` | Amp | `~/.amp/skills/` | 全域 | 任意目錄 |
| `letta` | Letta | `~/.letta/skills/` | 全域 | 任意目錄 |
| `gemini` | Gemini CLI | `~/.gemini/skills/` | 全域 | 任意目錄 |

> `~` 代表使用者 home 目錄，例如 Windows 通常是 `C:\Users\<你>`；Linux/macOS 通常是 `/home/<你>` 或 `/Users/<你>`。
> `.cursor/skills/`、`.github/skills/`、`.skills/`、`.opencode/skills/` 都是「目前工作目錄」底下的相對路徑，所以要先切到你想安裝 skill 的專案根目錄再執行 installer。
> 可以用 `-InstallDir <path>`（PowerShell）或 `--dir <path>`（Linux/macOS）覆蓋預設安裝位置。
> OpenCode 也相容 `.claude/skills/` 與 `.agents/skills/` 路徑。詳見 [OpenCode Agent Skills 文件](https://opencode.ai/docs/skills/)。

---

## 安裝指令參考

### 免 Node Installer

Windows：安裝全部 skills
```powershell
powershell -ExecutionPolicy Bypass -NoProfile -Command '$s = irm https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.ps1; & ([scriptblock]::Create($s)) -Agent <agent-name>'
```

Windows：安裝單一 skill
```powershell
powershell -ExecutionPolicy Bypass -NoProfile -Command '$s = irm https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.ps1; & ([scriptblock]::Create($s)) -Agent <agent-name> -Skill <skill-name>'
```

Linux / macOS：安裝全部 skills
```bash
curl -fsSL https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.sh | bash -s -- --agent <agent-name>
```

Linux / macOS：安裝單一 skill
```bash
curl -fsSL https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.sh | bash -s -- --agent <agent-name> --skill <skill-name>
```

安全覆蓋規則：

- 目標 skill 不存在：直接安裝。
- 目標 skill 已存在且 `.skill-meta.json` 的 `repo` 相同：更新覆蓋，保留原本 `installedAt`，更新 `updatedAt`。
- 目標 skill 已存在但沒有 `.skill-meta.json`：停止，不刪除。
- 目標 skill 已存在但 metadata 來源不是目前 repo：停止，不刪除。
- 確認要覆蓋未知來源時，Windows 加 `-Force`，Linux/macOS 加 `--force`。

```powershell
powershell -ExecutionPolicy Bypass -NoProfile -Command '$s = irm https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.ps1; & ([scriptblock]::Create($s)) -Agent <agent-name> -Skill <skill-name> -Force'
```

```bash
curl -fsSL https://raw.githubusercontent.com/HsinPu/Autoverse-Ai-Agent-Skills/main/scripts/install.sh | bash -s -- --agent <agent-name> --skill <skill-name> --force
```

### 本地查詢 CLI（可選）

`autoverse-cli.js` 只保留 catalog 查詢功能；安裝請使用上方免 Node installer。

```bash
# 列出所有可用 skills
node autoverse-cli.js list

# 搜尋 skill
node autoverse-cli.js search <keyword>

# 顯示 skill 詳細資訊
node autoverse-cli.js info <skill-name>
```

---

## 貢獻

歡迎貢獻新的 Skill 或改進現有的 Skill！

1. Fork 本專案
2. 建立新的 branch（`git checkout -b feature/your-skill`）
3. 提交變更（`git commit -m 'feat: add your skill'`）
4. 推送到遠端（`git push origin feature/your-skill`）
5. 建立 Pull Request

---

## 授權

本專案採用 **Apache License 2.0**，詳見 [LICENSE](LICENSE)。

各 skill 目錄內若有標示授權則從其約定；未標示者依本專案授權。

---

## 連結

- [GitHub Repository](https://github.com/HsinPu/Autoverse-Ai-Agent-Skills)
- [NPM Package](https://www.npmjs.com/package/autoverse-ai-agent-skills)
- [Issue Tracker](https://github.com/HsinPu/Autoverse-Ai-Agent-Skills/issues)
