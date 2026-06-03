# README 類型參考（README Type Reference）

## 目錄（Table of Contents）

- [使用方式](#使用方式)
- [共同核心章節](#共同核心章節)
- [快速選擇表](#快速選擇表)
- [範例檔索引](#範例檔索引)
- [Product / App README](#product--app-readme)
- [Library / SDK README](#library--sdk-readme)
- [CLI Tool README](#cli-tool-readme)
- [API Service README](#api-service-readme)
- [Template / Boilerplate README](#template--boilerplate-readme)
- [Monorepo README](#monorepo-readme)
- [Internal / Enterprise / Gerrit README](#internal--enterprise--gerrit-readme)
- [Research / Demo README](#research--demo-readme)
- [Platform Overlay](#platform-overlay)

## 使用方式

- 先選擇一個 primary README type，再視需要借用少數次要章節。
- 不要把 `Product`、`Library`、`CLI`、`API`、`Monorepo` 的結構全部混在同一份 root README。
- 若 repository 同時面向多種讀者，root README 先處理 discoverability，再用連結導向 deeper docs。
- 若 repo 是 monorepo，root README 主要負責 workspace overview；各 package / app 可有自己的子 README。
- 需要可直接改寫的 README skeleton 時，先看 [readme-examples.md](readme-examples.md) 的索引，再開對應的 example file。

## 共同核心章節

大多數 README 至少應考慮以下內容：

- `Title`：專案名稱。
- `Summary`：1-2 句說明用途、對象與價值。
- `Quick Start` 或 `Installation`：讓讀者可以最短路徑開始使用。
- `Usage`：最小可執行範例、常見命令、典型流程。
- `Type-specific sections`：依專案類型補充功能、API、commands、architecture、workspace map 等。
- `Contributing`：若希望外部或內部協作，至少說明基本流程。
- `License`：開源專案通常必填；內部專案可改成 ownership / usage policy。

## 快速選擇表

| 類型 | 何時使用 | 主要讀者 | 重點 |
|------|----------|----------|------|
| Product / App | repo 交付可執行產品、網站、桌面 App、服務 | end users、evaluators、developers | 功能、畫面、快速開始、部署 |
| Library / SDK | repo 提供可被整合的函式庫或 SDK | integrators、developers | 安裝、版本相容性、API、範例 |
| CLI Tool | repo 提供 command-line tool | operators、developers | 安裝、commands、flags、examples |
| API Service | repo 提供 HTTP / RPC service | backend devs、integrators、ops | run locally、auth、endpoints、env |
| Template / Boilerplate | repo 提供 starter、scaffold、範本 | new project authors | 如何使用模板、包含內容、客製化 |
| Monorepo | repo 聚合多個 packages / apps | contributors、maintainers | workspace map、common commands、子文件導覽 |
| Internal / Enterprise / Gerrit | repo 主要供內部團隊協作或 Gerrit review | internal devs、reviewers | access、setup、workflow、review flow |
| Research / Demo | repo 用於論文、模型、實驗、展示 | researchers、evaluators | reproduce、datasets、results、citation |

## 範例檔索引

- Minimal pack：見 [readme-example-minimal.md](readme-example-minimal.md)
- Product / App：見 [readme-example-product-app.md](readme-example-product-app.md)
- Library / SDK：見 [readme-example-library-sdk.md](readme-example-library-sdk.md)
- CLI Tool：見 [readme-example-cli-tool.md](readme-example-cli-tool.md)
- API Service：見 [readme-example-api-service.md](readme-example-api-service.md)
- Template / Boilerplate：見 [readme-example-template-boilerplate.md](readme-example-template-boilerplate.md)
- Monorepo：見 [readme-example-monorepo.md](readme-example-monorepo.md)
- Internal / Enterprise / Gerrit：見 [readme-example-internal-enterprise-gerrit.md](readme-example-internal-enterprise-gerrit.md)
- Research / Demo：見 [readme-example-research-demo.md](readme-example-research-demo.md)
- Platform overlays：見 [readme-example-platform-overlays.md](readme-example-platform-overlays.md)
- Common snippets：見 [readme-example-section-snippets.md](readme-example-section-snippets.md)

## Product / App README

### When to Use

- 專案重點是提供最終產品、網站、dashboard、桌面 App 或可直接執行的服務。

### Must-have Sections

- `Overview` 或 `Summary`
- `Features`
- `Quick Start` 或 `Run Locally`
- `Usage` 或 `Demo`
- `Configuration`（若有 env vars、runtime options）
- `Contributing` / `License`

### Optional Sections

- `Screenshots`
- `Architecture`
- `Deployment`
- `FAQ`
- `Roadmap`

### Suggested Order

`Overview -> Features -> Quick Start -> Usage/Demo -> Configuration -> Development -> Contributing -> License`

### Platform Notes

- **GitHub**：可加入 badges、live demo、Issues、Releases、GitHub Pages。
- **Gerrit**：若主要為內部產品 repo，補上 developer setup 與 review flow，但不要讓 review 細節蓋過產品介紹。

## Library / SDK README

### When to Use

- 專案重點是被其他程式整合、import、install 或 link 的 library / SDK。

### Must-have Sections

- `Overview`
- `Installation`
- `Supported Versions` 或 `Compatibility`
- `Quick Example`
- `API Surface` 或 `Key Modules`
- `Contributing` / `License`

### Optional Sections

- `Advanced Examples`
- `Configuration`
- `Migration Guide`
- `Benchmark`

### Suggested Order

`Overview -> Installation -> Quick Example -> API/Modules -> Advanced Usage -> Compatibility -> Contributing -> License`

### Platform Notes

- **GitHub**：可補 package registry、release notes、version badge、docs site。
- **Gerrit**：對外使用者仍優先看 install / example；review flow 放在 `Contributing`，不要放前面。

## CLI Tool README

### When to Use

- 專案主要透過 terminal command 使用，例如 dev tool、ops tool、generator、migration utility。

### Must-have Sections

- `Overview`
- `Installation`
- `Quick Start`
- `Commands` 或 `Command Reference`
- `Examples`
- `Configuration`（若有 config file、env vars）

### Optional Sections

- `Shell Completion`
- `Exit Codes`
- `Troubleshooting`
- `Packaging / Distribution`

### Suggested Order

`Overview -> Installation -> Quick Start -> Commands -> Examples -> Configuration -> Troubleshooting -> Contributing`

### Platform Notes

- **GitHub**：可補 release assets、Homebrew / Scoop / npm / PyPI 安裝方式。
- **Gerrit**：若為內部工具，補上 internal registry 或 binary distribution 方式。

## API Service README

### When to Use

- 專案主要提供 HTTP API、GraphQL、gRPC 或其他 service interface。

### Must-have Sections

- `Overview`
- `Run Locally`
- `Configuration` 或 `Environment Variables`
- `Authentication`
- `Endpoints` 或 `API Docs Link`
- `Testing` / `Development`

### Optional Sections

- `Error Model`
- `Rate Limits`
- `Database / Dependencies`
- `Deployment`

### Suggested Order

`Overview -> Run Locally -> Configuration -> Authentication -> Endpoints/Docs -> Testing -> Deployment -> Contributing`

### Platform Notes

- **GitHub**：可連到 Swagger / OpenAPI、Postman collection、Actions pipeline。
- **Gerrit**：若為內部 API，補上 VPN、staging / prod access policy、service ownership。

## Template / Boilerplate README

### When to Use

- 專案提供 starter、boilerplate、template repo、scaffold 起手式，而不是最終產品本身。

### Must-have Sections

- `Purpose`
- `What Is Included`
- `How to Use This Template`
- `Customization Guide`
- `Project Structure`
- `Limitations` 或 `Opinionated Choices`

### Optional Sections

- `Example Output`
- `Upgrade Path`
- `FAQ`

### Suggested Order

`Purpose -> Included Features -> How to Use -> Customize -> Project Structure -> Limitations -> Contributing`

### Platform Notes

- **GitHub**：若是 template repository，可明確提到 `Use this template` 或 fork 流程。
- **Gerrit**：通常沒有 GitHub template button，需改寫成手動複製或 bootstrap 指令。

## Monorepo README

### When to Use

- repo root 管理多個 apps、packages、services、shared libs。

### Must-have Sections

- `Workspace Overview`
- `Repository Layout`
- `Apps / Packages Map`
- `Common Commands`
- `How to Work in a Specific Package`
- `Links to Child Docs`

### Optional Sections

- `Release Strategy`
- `Ownership`
- `Architecture`
- `Dependency Graph`

### Suggested Order

`Overview -> Workspace Layout -> Packages/Apps -> Common Commands -> Per-package Docs -> Contributing`

### Platform Notes

- **GitHub**：可連到 packages、Actions matrix、workspace badges。
- **Gerrit**：若多模組共用同一 review flow，清楚寫 branch / submit policy 與 reviewer expectations。

## Internal / Enterprise / Gerrit README

### When to Use

- 專案主要供公司內部或封閉團隊使用，尤其依賴 Gerrit code review、內部 network、權限控管。

### Must-have Sections

- `Purpose`
- `Prerequisites`（帳號、VPN、權限、工具）
- `Local Setup`
- `Development Workflow`
- `Code Review / Submit Flow`
- `Owners / Support`

### Optional Sections

- `Environment Matrix`
- `Operational Notes`
- `Release Process`
- `Security / Access Policy`

### Suggested Order

`Purpose -> Prerequisites -> Setup -> Development Workflow -> Review Flow -> Troubleshooting -> Owners/Support`

### Platform Notes

- **GitHub**：若為 private repo，可補 issue / PR policy、branch protection、internal package source。
- **Gerrit**：通常要寫清楚 `Change-Id`、commit message 規範、`git review` 或 `refs/for/<branch>`、reviewer / approver 流程。

## Research / Demo README

### When to Use

- 專案重點在展示研究結果、模型、paper 實驗或 prototype demo。

### Must-have Sections

- `Overview`
- `Setup`
- `Reproduce` 或 `Run the Demo`
- `Datasets / Models`
- `Results`
- `Citation`（若適用）

### Optional Sections

- `Checkpoints`
- `Experiment Matrix`
- `Limitations`
- `Future Work`

### Suggested Order

`Overview -> Setup -> Reproduce/Demo -> Data/Models -> Results -> Citation -> License`

### Platform Notes

- **GitHub**：可補 paper link、Colab、demo video、model weights、release assets。
- **Gerrit**：若為內部研究 repo，補上資料權限、模型存取限制與合規提醒。

## Platform Overlay

### GitHub 常見補充

- badges（build、coverage、version、license）
- `Issues`、`Pull Requests`、`Discussions`
- `Actions`、`Releases`、`Packages`、`Pages`
- live demo、screenshots、marketplace 或 package registry 連結

### Gerrit 常見補充

- clone URL、review URL、access prerequisites
- `Change-Id`、commit message 規範、submit policy
- `git review` 或 `git push origin HEAD:refs/for/<branch>` 流程
- reviewer / approver expectations、internal branch policy

### GitHub 與 Gerrit 並存

- 先維持 root README 平台中立。
- 將 Issue / PR 與 review flow 的差異放在 `Contributing` 或 `Development`。
- 若 GitHub 只是 mirror，直接寫清楚 authoritative review platform 是 Gerrit。
