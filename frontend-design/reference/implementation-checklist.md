# 落地檢查清單（Implementation Checklist）

## 介面品質（UI Quality Bar）

- **內容層級**：主標題/副標題/輔助文字/按鈕層級清楚，避免全部同一個字級與灰階。
- **狀態完整**：hover、active、focus-visible、disabled、loading、empty、error 至少覆蓋核心流程。
- **互動可預期**：可點元素有明顯 affordance；避免「看起來像按鈕但其實不能點」。
- **可讀性**：正文行長與行高合理；小字避免過淡/過細。

## 響應式（Responsive）

- **至少 2 個 breakpoint**：手機（<768px）與桌機（>=1024px）。
- **小螢幕策略**：重排優先於縮小；長表格改成卡片/摘要。
- **可觸控**：主要點擊目標至少 40px 高（或等效 hit area）。

## 無障礙（A11y）

- **鍵盤**：Tab 可走完整流程；focus 樣式清楚。
- **對比**：正文與重要按鈕符合基本對比（至少接近 WCAG AA）。
- **Reduced motion**：尊重 `prefers-reduced-motion`。

## 效能與穩定性（Performance）

- **避免 layout thrash**：批次 DOM 更新；避免在 scroll/resize 中做重排。
- **圖片**：設定尺寸避免 CLS；適當壓縮（webp/avif 依情況）。
- **字體**：避免 FOIT；提供 fallback；字重不要過多。

## 交付物（Deliverables）

- 可直接執行（含必要的資產/相依/指令）。
- 以 CSS variables 定義主題 tokens（顏色、字級、間距、圓角、陰影）。
- 核心畫面在手機與桌機都「可用且好看」。
