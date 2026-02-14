---
name: frontend-design
description: Create distinctive, production-ready frontend interfaces with high design quality and polished, creative code; avoid generic AI aesthetics. Use when the user asks to build web components, pages, artifacts, posters, or applications (e.g. websites, landing pages, dashboards, React components, HTML/CSS layouts), or when styling/beautifying any web UI.
---

# 前端設計 Frontend Design

引導建立具辨識度、可上線的前端介面。產出可實際運作的程式碼，並在美學細節與創意選擇上格外用心。避免 generic「AI slop」美學。

## 設計思維 Design Thinking（動手寫程式前）

理解脈絡並**明確選定**一個美學方向：

- **目的 Purpose**：介面要解決什麼問題？誰在使用？
- **調性 Tone**：選一個極端並精準執行—例如 brutally minimal（極簡）、maximalist chaos（極繁混亂）、retro-futuristic（復古未來）、organic/natural（有機／自然）、luxury/refined（奢華／精緻）、playful/toy-like（玩趣／玩具感）、editorial/magazine（雜誌編輯風）、brutalist/raw（粗獷／原生）、art deco/geometric（裝飾藝術／幾何）、soft/pastel（柔和／粉彩）、industrial/utilitarian（工業／實用）。可作靈感，但設計要忠於所選方向。
- **限制 Constraints**：技術需求（framework、效能、accessibility 無障礙）。
- **差異化 Differentiation**：什麼會讓人**難忘 unforgettable**？使用者會記住哪一點？

**關鍵**：選定清晰的概念方向並精準執行。大膽極繁與精煉極簡都成立—重點是 intentionality（意圖明確），不是 intensity（強度）。

接著產出可運作的程式碼（HTML/CSS/JS、React、Vue 等），並確保：可上線、功能完整、視覺突出、風格一致、細節講究。

---

## 前端美學準則 Frontend Aesthetics Guidelines

### 字體排版 Typography

- 選用美觀、有特色、有趣的字體。
- 避免 generic 字體（Arial、Inter、Roboto、系統預設）。
- 偏好 distinctive、characterful 的選擇；以一款突出的 display 字體搭配一款精緻的 body 字體。

### 色彩與主題 Color & Theme

- 鎖定一致的美學；用 CSS variables 維持一致性。
- 主色＋鮮明重點色，優於 timid、evenly-distributed 的配色。
- 不要預設使用 clichéd 配色（例如 purple gradients on white 白底紫漸層）。

### 動態與動畫 Motion

- 用動畫做效果與 micro-interactions（微互動）。
- HTML 優先以純 CSS 實作；React 可搭配 Motion library。
- 聚焦高光時刻：一次有節奏的 page load 搭配 staggered reveals（`animation-delay`）比零散 micro-interactions 更有感。
- 善用 scroll-triggering 與令人驚喜的 hover 狀態。

### 空間與版面 Spatial Composition

- 偏好 unexpected 版面：asymmetry（不對稱）、overlap（疊合）、diagonal flow（對角流動）、grid-breaking 元素。
- 大量 negative space（留白）**或**受控的 density（密度）—擇一貫徹。

### 背景與視覺細節 Backgrounds & Visual Details

- 營造 atmosphere 與 depth；不要只靠 solid colors。
- 依整體美學加入情境效果與紋理：gradient meshes、noise textures、geometric patterns、layered transparencies、dramatic shadows、decorative borders、custom cursors、grain overlays（漸層網格、噪點紋理、幾何圖案、層疊透明、戲劇性陰影、裝飾邊框、自訂游標、顆粒疊加）。

---

## 應避免事項 What to Avoid

- 過度常見的字體（Inter、Roboto、Arial、系統字體）。
- Cliched 配色（尤其是 purple gradients on white）。
- Predictable 版面與 cookie-cutter 元件套路。
- 缺乏 context-specific character 的設計。

以創意解讀需求，做出真正符合情境的意外選擇。每次設計都應不同；在 light/dark themes、字體與美學風格之間變化。不要在不同產出中收斂到常見選擇（例如 Space Grotesk）。

---

## 實作 Implementation

- 實作複雜度要對應美學願景。
- Maximalist 設計需要完整程式：大量 animations 與 effects。
- Minimalist 或 refined 設計需要節制、精準，以及對 spacing、typography 與細微細節的講究。
- 優雅來自把願景執行到位。

**記住**：全心投入一個 distinctive 願景。不要保留—展現跳脫框架、全力執行時能達成的成果。
