---
name: frontend-design
description: Frontend design guide for creating distinctive, production-grade interfaces with clear visual direction, strong hierarchy, meaningful motion, and non-generic implementation details. Use when building or restyling web components, pages, or applications where the visual design matters as much as the code quality.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# 前端設計 Frontend Design

當任務不是只有「做得動」，而是要「看起來真的被設計過」時，使用這個 skill。目標是交付可上線的前端，而不是 generic 的 AI UI。

## 何時使用 When To Use

- 從零建立 landing page、dashboard、app shell 或 design-heavy component
- 把 bland 或 generic 的介面改成有明確觀點的產品 UI
- 把產品概念轉成具體的 visual direction
- 使用者同時在乎 code quality 與 visual quality

## 核心原則 Core Principle

先選定方向，再全力執行。

safe-average UI 通常比不上有明確觀點、少數大膽選擇但整體一致的介面。

## 進階與參考（Bundled resources）

- **落地檢查清單**：響應式、a11y、狀態、效能與交付物要求，見 [reference/implementation-checklist.md](reference/implementation-checklist.md)。
- **A11y（無障礙）**：鍵盤操作、focus、對比、reduced motion、語意化 HTML，見 [reference/accessibility.md](reference/accessibility.md)。
- **CSS tokens**：CSS variables、主題一致性、層級與間距尺度，見 [reference/css-tokens.md](reference/css-tokens.md)。

## 設計 Workflow

### 1. 先框定介面

動手寫程式前，先明確決定：

- **目的 Purpose**：介面要解決什麼問題？誰在使用？
- **受眾 Audience**：誰會使用？他們在意什麼？
- **調性 Tone**：選一個方向並精準執行，例如 brutally minimal、editorial、industrial、luxury、playful、geometric、retro-futuristic、soft and organic、maximalist。
- **限制 Constraints**：framework、效能、a11y、裝置、內容密度。
- **既有系統 Existing system**：若在既有網站/設計系統內工作，優先沿用現有的 layout、元件模式、字體與 tone；差異化只能在系統允許的範圍內做。
- **差異化 Differentiation**：什麼會讓人**難忘 unforgettable**？使用者會記住哪一點？

不要隨意混搭多種方向。先選一個，再乾淨地執行。

### 2. 建立 visual system

在開始堆畫面前，先定義：

- type hierarchy
- color variables / theme tokens
- spacing rhythm
- layout logic
- motion rules
- surface / border / shadow treatment

用 CSS variables 或專案既有 token system 讓風格可擴充，而不是只在單頁看起來漂亮。

### 3. 有意識地構圖

優先考慮：

- asymmetry：在需要強化層級時使用不對稱
- overlap：在需要深度時使用疊合
- whitespace：在需要聚焦時使用明確留白
- density：只有產品真的需要高資訊密度時才採用

不要預設回到對稱 card grid，除非它明顯就是最對的解法。

在小螢幕上，優先重排資訊層級與版面秩序，而不是把所有元素等比縮小。

### 4. 讓動態有意義

動畫應該用來：

- reveal hierarchy
- stage information
- reinforce user action
- create one or two memorable moments

一次有節奏的 load sequence，通常比二十個零散 hover effects 更有力量。

尊重 `prefers-reduced-motion`；reduced motion 時改用淡入或直接移除大幅位移。

---

## Strong Defaults

### 字體排版 Typography

- 選用有 character 的字體。
- 避免 generic 字體（Arial、Inter、Roboto、系統預設）作為設計主角。
- 偏好 distinctive 的 display 字體搭配可讀的 body 字體。
- 字體必須可載入：提供可靠的 fallback、避免 FOIT，並注意字重與字距在小螢幕的可讀性。

### 色彩與主題 Color & Theme

- 鎖定一致的美學；用 CSS variables 維持一致性。
- 主色＋鮮明重點色，優於 timid、evenly-distributed 的配色。
- 不要預設使用 clichéd 配色，例如 purple gradients on white。
- 一次選定 1 個主背景語言（mesh / pattern / solid + texture），不要同頁混多種背景邏輯。

### 動態與動畫 Motion

- HTML 優先以純 CSS 實作；React 可搭配 Motion library。
- 聚焦高光時刻：一次有節奏的 page load 搭配 staggered reveals 比零散 micro-interactions 更有感。
- 善用 scroll-triggering 與令人驚喜的 hover 狀態。

### 版面與背景 Layout & Background

- 用 atmosphere 與 depth，而不是只靠 solid colors。
- 依整體美學加入情境效果與紋理：gradient meshes、noise textures、geometric patterns、layered transparencies、dramatic shadows、decorative borders、custom cursors、grain overlays（漸層網格、噪點紋理、幾何圖案、層疊透明、戲劇性陰影、裝飾邊框、自訂游標、顆粒疊加）。
- 每個裝飾元素都要有目的（導視、分層、節奏），不要只是塞滿特效。
- 版面可以 break the grid，但閱讀流向仍然要明確。

---

## 應避免事項 What to Avoid

- interchangeable SaaS hero sections
- generic card piles with no hierarchy
- random accent colors without a system
- placeholder-feeling typography
- motion that exists only because animation was easy to add
- 過度常見的字體（Inter、Roboto、Arial、系統字體）。
- clichéd 配色（尤其是 purple gradients on white）。
- predictable 版面與 cookie-cutter 元件套路。
- 缺乏 context-specific character 的設計。
- 用 `alert()` / `confirm()` / `prompt()` 當成互動回饋或錯誤提示（改用 inline 狀態、toast/snackbar、banner、modal 等非阻塞 UI）。
- 沒有 focus/disabled/loading/empty/error 等狀態，只做「截圖式」UI。
- 只靠陰影、發光與玻璃化（glassmorphism）當成整體風格。

以創意解讀需求，做出真正符合情境的意外選擇。不要在不同產出中收斂到相同的常見字體、配色和 hero 模板。

---

## 執行規則 Execution Rules

- 在既有產品內工作時，優先保留既有設計系統與元件模式。
- 實作複雜度要對應美學願景：maximalist 需要完整效果，minimalist 需要極高的 spacing 與 typography 精度。
- 維持 accessibility、responsiveness 與 state completeness，不要為了視覺犧牲可用性。
- 前端在 desktop 和 mobile 都要感覺 deliberate，不只是縮小版。

## Quality Gate

- 介面有清楚的 visual point of view。
- typography、spacing、color、motion 都是 intentional 的，而不是臨時拼湊。
- 顏色與動態是在支援產品，不是在隨機裝飾。
- 手機與桌機都可用且有設計感。
- 結果看起來不是 generic AI UI。
- 最終產出是 production-grade，而不只是 visually interesting。

**記住**：全心投入一個 distinctive 願景。不要保留，讓介面看起來像是有人真的做過設計決策，而不是從預設模板裡拼出來的。
