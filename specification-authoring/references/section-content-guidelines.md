# Section content guidelines (Ch.1–Ch.8)

Table of contents: [1 概覽](#1-概覽-overview) · [2 系統架構](#2-系統架構-system-architecture) · [3 功能規格](#3-功能規格-functional-specification) · [4 技術詳細設計](#4-技術詳細設計-detailed-technical-design) · [5 介面與工作流程](#5-介面與工作流程-uiux--workflow) · [6 環境與運維](#6-環境與運維-environment--maintenance) · [7 測試與驗證](#7-測試與驗證-testing--validation) · [8 附錄與變更記錄](#8-附錄與變更記錄-appendix--revision)

## 1 概覽 (Overview)

Explain **why** the system exists: business problem, goals, main usage scenarios, and value. Readers should understand context before technical detail.

## 2 系統架構 (System Architecture)

Cover three angles:

- **Architecture diagram** — Components and interactions (visual).
- **技術堆疊** — Technologies, frameworks, tools; optionally roles and rationale.
- **系統整合點** — External / internal integrations, methods, and purpose; clarifies boundaries and dependencies.

## 3 功能規格 (Functional Specification)

Per feature module (submodule order and numbering: use the skill reference *front-matter-and-structure* from SKILL.md):

- Purpose and expected behavior.
- All entry points (UI, API, schedules, etc.) and operation steps.
- Shared naming rules across the system.
- Shared business rules and constraints.

## 4 技術詳細設計 (Detailed Technical Design)

For each feature aligned with Ch.3:

- **資料庫設計** — Schema, indexes, access patterns, SQL.
- **程式處理邏輯** — Validation → processing → response; exception strategy.
- **API 規格** — Paths, headers/body, success and error responses.

## 5 介面與工作流程 (UI/UX & Workflow)

- UI layout and interaction per feature where applicable.
- End-to-end workflows; prefer Mermaid sequence or flowcharts.
- If there is no UI, state explicitly (e.g. API-only service).

## 6 環境與運維 (Environment & Maintenance)

Subtopics:

- **環境設定** — Environment variables, K8s/Docker, network (domains, ports, allowlists).
- **系統限制** — Resource limits (memory, CPU, rate limits, etc.).
- **紀錄管理** — Log paths, formats, retention.
- **監控與告警** — Metrics and alerts; state explicitly if none.

## 7 測試與驗證 (Testing & Validation)

No fixed subsection names—organize by test type, feature, or other sensible structure. Describe strategy and acceptance criteria.

## 8 附錄與變更記錄 (Appendix & Revision)

Mandatory: **8.1 術語表**, **8.2 參考文件**, **8.3 變更記錄** (full rules in the *front-matter-and-structure* reference from SKILL.md). Optional appendices after **8.3**.
