---
name: todo-first
description: Create and maintain a structured todo list before executing multi-step or non-trivial work. Use when tasks have 3+ steps, span multiple files or commands, include verification, or bundle several user requests. Use todowrite to track pending/in_progress/completed/cancelled items during execution. Skip for single-step, trivial, or purely informational requests.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Todo-First Execution

## Goal

- 在開始執行前，先判斷是否應建立 todo list。
- 若需要 todo list，立即用 `todowrite` 建立並持續維護。
- 用 `pending` / `in_progress` / `completed` / `cancelled` 讓執行進度可見且可信。

## Quick Decision

- **符合任一條件就建 todo**：3+ 步驟、多檔案、多指令流程、需要驗證、使用者一次交代多件事。
- **符合任一條件就不要建 todo**：單一步驟、純資訊問題、只需回一句話、只改一個很明確的小地方。
- **先探索再決定**：若任務表面上看起來很小，但你尚未知道影響範圍，先做最小必要探索，再判斷是否開 todo。

## When To Create A Todo List

在「開始執行」前建立 todo list（用 `todowrite`），當下列任一條件成立：

- 需要 3+ 個明確步驟。
- 會修改多個檔案/模組，或跨多個區域（例如 backend + frontend）。
- 需要多個指令流程（例如 migrate + build + deploy，或一段完整 git workflow）。
- 需要驗證步驟（tests/build/lint/format/checks）。
- 使用者提供多個任務（清單、條列、逗號分隔）。
- 需要先探索範圍，再分段執行與收斂。

## When NOT To Create A Todo List

不要建立 todo list，直接做或直接回答，當下列任一條件成立：

- 單一步驟且不容易漏（例如改一行字、跑一個指令、回覆一個問題）。
- 純資訊/解釋性問題（不需要實作或執行）。
- 單一檔案的小修改，且不需要延伸驗證或多段操作。
- 使用者明確要求不要列 todo。

## Borderline Cases

- **先搜尋再決定**：像「幫我把 `foo` 改名」這種任務，若尚未知道影響範圍，可先搜尋；若發現跨多檔案，再建立 todo。
- **單一指令但後續可能要修錯**：若使用者說「跑一下 tests」，先直接執行；只有在發現後續需要多步修復時，再建立 todo。
- **一個小改動 + 驗證**：若只是單點修改但還要跑測試、修格式、確認 build，通常就值得建 todo。
- **git 工作流**：若只是看 `git status`，不用 todo；若要 stage、commit、push、處理 hook 或衝突，通常要建 todo。

## How To Write Todos

- 保持精準：每一項是「動詞 + 物件」，可被執行與驗收。
- 保持可驗證：看標題就知道完成條件，例如「更新 API route tests」比「處理測試」更好。
- 保持合理粒度：通常 3-8 項；避免拆到太碎的 micro-steps。
- 覆蓋驗證：需要時加上 tests/build/lint/format 等檢查項。
- 補上後續工作：若實作後幾乎一定要驗證，直接把驗證列成 todo，而不是等做完才想起來。
- 用優先級反映阻塞性：風險高、先決條件、驗證失敗風險高的項目放 `high`。

## Good vs Bad Todo Items

- **Good**：`Locate settings page entry point`
- **Good**：`Add dark mode toggle state management`
- **Good**：`Run tests and fix failures`
- **Bad**：`Work on feature`
- **Bad**：`Do stuff`
- **Bad**：`Finish everything`

## Status Rules

- 建立時全部設為 `pending`。
- 開始做某項時，把該項改成 `in_progress`。
- 同一時間只能有 1 個 `in_progress`。
- 做完立刻改成 `completed`，不要等最後一起更新。
- 不再需要或被取代的項目改成 `cancelled`。
- 若中途發現新工作，立即把它新增到 todo list，而不是只記在腦中。

## Execution Workflow

1. 做最小必要的探索/讀取 context，避免盲目開始。
2. 一旦確認屬於 multi-step 或 non-trivial work，立即用 `todowrite` 建立 todo list。
3. 選一個最先做的項目，改成 `in_progress`。
4. 執行工作；完成後立刻更新狀態。
5. 若工作途中出現新的必要步驟，立刻補進 todo list。
6. 全部完成後，用簡短 recap 說明做了什麼、驗證結果、以及下一步（若有）。

## Interaction Rules

- 不要問 permission questions（例如「要不要我繼續？」）。
- 不要把 todo list 當成裝飾；建立後就要真的維護。
- 只有在「規格不清楚且會影響結果」時才提問。
- 若必須問：先做所有不會被影響的工作，再問 1 個最關鍵問題，並給出建議預設值。

## Quality Checklist

- 這個任務是否真的複雜到值得建立 todo？
- 每個 todo 是否都有清楚的完成條件？
- 是否已把驗證工作列入，而不是只列實作？
- 是否只保留一個 `in_progress`？
- 是否在完成當下就更新狀態，而不是事後補記？

## Examples

### Create a todo list: multi-step feature

情境：新增 dark mode toggle，並在完成後跑 tests 與 build。

典型 todo：找入口、加入 state、更新 UI、補測試、跑驗證。

### Create a todo list: scoped refactor

情境：把 `getCwd` 改名成 `getCurrentWorkingDirectory`，但還沒知道影響範圍。

先搜尋；若發現跨多檔案與測試，建立 todo list 並逐步追蹤。

### Create a todo list: git workflow

情境：stage、commit、push，且可能遇到 hook、衝突或需要檢查 diff。

先看狀態，再把 stage / commit / verify / push 視為一段多步驟流程來追蹤。

### Do not create a todo list: trivial request

情境：幫某個函式補一行註解、回答一個指令用途、跑一次單一命令。

直接完成，不要額外建立 todo。

### Create a todo list after exploration

情境：使用者說「幫我優化效能」，一開始尚未知道範圍。

先做最小探索；一旦發現有多個 bottlenecks 或多個修正項目，再建立 todo list。
