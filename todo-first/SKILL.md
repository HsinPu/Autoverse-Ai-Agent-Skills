---
name: todo-first
description: Create and maintain a structured todo list before executing multi-step or non-trivial tasks. Use when implementing features, refactoring, running multi-command workflows, handling user-provided task lists, or when verification (tests/build/lint) is needed. Use todowrite to track pending/in_progress/completed items and update status as execution proceeds. Skip for single-step or trivial requests.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Todo-First Execution

## Goal

- 在開始執行前先用 `todowrite` 建立 todo list。
- 在執行過程持續更新狀態：`pending` / `in_progress` / `completed` / `cancelled`。

## When To Create A Todo List

在「開始執行」前建立 todo list（用 `todowrite`），當下列任一條件成立：

- 需要 3+ 個明確步驟。
- 會修改多個檔案/模組，或跨多個區域（例如 backend + frontend）。
- 需要多個指令流程（例如 migrate + build + deploy，或多段 git 操作）。
- 需要驗證步驟（tests/build/lint/format/checks）。
- 使用者提供多個任務（清單、條列、逗號分隔）。

## When NOT To Create A Todo List

不要建立 todo list，直接做或直接回答，當下列任一條件成立：

- 單一步驟且不容易漏（例如改一行字、跑一個指令、回覆一個問題）。
- 純資訊/解釋性問題（不需要實作或執行）。
- 使用者明確要求不要列 todo。

## How To Write Todos

- 保持精準：每一項是「動詞 + 物件」，可被執行與驗收。
- 粒度：通常 3-8 項；避免拆到太碎的 micro-steps。
- 覆蓋驗證：需要時加上 tests/build/lint 之類的檢查項。
- 狀態規則：建立時全部 `pending`。
- 狀態規則：開始做某項時，把該項改成 `in_progress`；同一時間只能有 1 個 `in_progress`。
- 狀態規則：做完立刻改成 `completed`；不再需要的改成 `cancelled`。
- 優先級：用 `high` / `medium` / `low`，把風險高或阻塞性的項目排前面。

## Execution Workflow

1) 做最小必要的探索/讀取 context（避免盲目做破壞性操作）。
2) 用 `todowrite` 建 todo list。
3) 依序執行每一項，並在過程中持續更新 todo 狀態。
4) 完成後用簡短 recap 說明做了什麼、驗證結果、以及下一步（若有）。

## Interaction Rules

- 不要問 permission questions（例如「要不要我繼續？」）。
- 只有在「規格不清楚且會影響結果」時才提問。
- 若必須問：先做所有不會被影響的工作，再問 1 個最關鍵問題，並給出建議預設值。

## Examples

### Multi-step feature

Todo 典型包含：找入口/相關檔案、實作變更、更新/新增測試、跑 tests/build、總結與驗證。

### Trivial request

不要建立 todo list；直接完成該動作或直接回答。
