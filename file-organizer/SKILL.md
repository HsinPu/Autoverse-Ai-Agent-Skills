---
name: file-organizer
description: Intelligently organizes files and folders by understanding context, finding duplicates, suggesting structures, and automating cleanup. Use when organizing Downloads/Documents, finding duplicates, restructuring folders, cleaning desktop, or establishing file organization habits.
---

# 檔案整理（File Organizer）

協助使用者整理電腦中的檔案與資料夾：分析結構、找出重複檔、建議目錄架構、在取得同意後執行搬移/重新命名與清理。**環境預設為 Windows**，指令以 PowerShell 為主。

## 適用情境（When to Use）

- 下載資料夾（Downloads）雜亂、檔案過多
- 檔案散落各處難以尋找
- 懷疑有重複檔案佔用空間
- 資料夾結構不合邏輯或過時
- 想建立較好的整理習慣
- 新專案需要建議的目錄結構
- 歸檔舊專案前的清理

## 本 Skill 可執行項目（What This Skill Does）

1. **分析現有結構**：檢視指定目錄的檔案與資料夾、類型、大小、日期。
2. **找出重複檔**：以檔名或雜湊（hash）辨識重複，並建議保留哪一份。
3. **建議整理方式**：依檔案類型、用途、日期提出邏輯化的資料夾結構。
4. **執行整理**：在使用者同意後，建立資料夾、搬移/重新命名檔案；**刪除前一律再次確認**。
5. **維持脈絡**：依副檔名、修改日期、檔名等做合理分類。
6. **辨識可清理項目**：標示長期未使用的檔案作為歸檔或刪除候選。

## 工作流程（Instructions）

使用者請求檔案整理時，依下列步驟執行。

### 1. 確認範圍（Understand the Scope）

先釐清：

- **要整理的目錄**：下載、文件、桌面、整個使用者目錄，或特定路徑？
- **主要問題**：找不到檔案、重複檔、太亂、缺乏結構？
- **排除項目**：是否跳過進行中專案、敏感資料夾？
- **整理強度**：保守（只做明顯分類）或全面（含歸檔、重新命名）？

### 2. 分析現況（Analyze Current State）

使用 **Windows / PowerShell** 檢視目標目錄：

```powershell
# 目錄與檔案概覽
Get-ChildItem -Path "目標路徑" -Recurse -Force | Measure-Object
Get-ChildItem -Path "目標路徑" -Recurse -File | Group-Object Extension | Sort-Object Count -Descending

# 依副檔名統計
Get-ChildItem -Path "目標路徑" -Recurse -File | Group-Object Extension | Select-Object Name, Count

# 依大小排序（前 20 大）
Get-ChildItem -Path "目標路徑" -Recurse -File | Sort-Object Length -Descending | Select-Object -First 20 FullName, @{N='SizeMB';E={[math]::Round($_.Length/1MB,2)}}

# 資料夾總大小
(Get-ChildItem -Path "目標路徑" -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1GB
```

輸出摘要應包含：總檔案數與資料夾數、副檔名分布、大小分布、修改日期範圍、明顯問題（如大量未分類、重複檔名）。

### 3. 辨識整理模式（Identify Organization Patterns）

依內容決定合理分組，可混合使用：

**依類型**：文件（PDF、DOCX、TXT）、圖片（JPG、PNG、SVG）、影片（MP4、MOV）、壓縮檔（ZIP、RAR）、試算表（XLSX、CSV）、簡報（PPTX）等。

**依用途**：工作 vs 個人、進行中 vs 歸檔、專案專用、參考資料、暫存。

**依日期**：當年/當月、往年、過舊（歸檔候選）。

### 4. 找出重複檔（Find Duplicates）

當使用者要求找重複時：

```powershell
# 依檔名找出重複
Get-ChildItem -Path "目標路徑" -Recurse -File | Group-Object Name | Where-Object { $_.Count -gt 1 }

# 依雜湊找出內容相同（較慢，可先取樣）
Get-ChildItem -Path "目標路徑" -Recurse -File | Get-FileHash -Algorithm MD5 | Group-Object Hash | Where-Object { $_.Count -gt 1 }
```

對每組重複：列出完整路徑、大小、修改日期；建議保留哪一份（通常為最新或路徑較合理者）；**刪除前必須明確列出並取得使用者確認**。

### 5. 提出整理計畫（Propose Organization Plan）

**先提出計畫，取得同意後再執行。** 計畫範本：

```markdown
# [目錄名稱] 整理計畫

## 現況
- 檔案數 / 資料夾數 / 總大小
- 副檔名分布、主要問題

## 建議結構
[以樹狀或列表呈現新資料夾與歸類方式]

## 將執行的變更
1. 新增資料夾：[列出]
2. 搬移檔案：例如 X 個 PDF → 文件/、Y 個圖片 → 圖片/
3. 重新命名：（若有）說明規則
4. 刪除：（若有）僅限已確認之重複檔，並再次列出

## 需您決定的項目
- [不確定該歸類或是否刪除的檔案]

是否同意執行？（是 / 否 / 要修改）
```

### 6. 執行整理（Execute Organization）

僅在使用者明確同意後執行：

```powershell
# 建立資料夾
New-Item -ItemType Directory -Path "路徑" -Force

# 搬移檔案（可逐筆或批次，避免覆蓋時先確認）
Move-Item -Path "來源" -Destination "目的地" -Force
```

**必須遵守**：

- **刪除前一律再次確認**，並列出將刪除的檔案。
- 搬移/重新命名可簡要記錄（例如列出「從 A 搬到 B」），便於還原。
- 若有檔名衝突，先詢問覆蓋或改檔名，勿直接覆蓋。
- 執行中遇預期外狀況（權限、路徑過長、大量錯誤）應停止並回報。

### 7. 完成後摘要與維護建議（Summary and Maintenance Tips）

完成後提供：

- 新增了哪些資料夾、搬移了多少檔案、刪除重複釋出多少空間、歸檔數量。
- 新的目錄樹或結構摘要。
- 簡短維護建議：例如每週整理下載、每月檢視專案是否歸檔、定期檢查重複。
- 可選：一兩條使用者之後可自用的 PowerShell 指令（例如「列出最近 7 天修改的檔案」）。

---

## 輸出格式要點

- 分析結果：以簡短列表或表格呈現，必要時用程式碼區塊貼出指令與輸出。
- 整理計畫：使用上方 Markdown 範本，結論為「是否同意執行」。
- 執行後：摘要數字 + 新結構 + 維護建議。

## 命名與結構建議（Best Practices）

**資料夾**：名稱清楚、少用空格（可用連字或底線）；必要時用數字前綴排序（如 `01-進行中`、`02-歸檔`）。

**檔案**：重要檔案可含日期（如 `2024-10-17-會議紀錄.md`）、描述清楚；避免檔名中的版本號（改由版控管理）；下載產生的 `(1)`、`- 複本` 等可在整理時一併清理。

**何時歸檔**：超過 6 個月未動的專案、已完成但可能需查閱的檔案、不確定是否刪除時先歸檔。

## 常見任務範例（Common Tasks）

| 情境 | 可說的話 / 指令範例 |
|------|---------------------|
| 下載資料夾 | 「幫我整理 Downloads：文件移到文件夾、圖片到圖片夾、安裝檔分開、超過 3 個月的歸檔」 |
| 重複檔 | 「在 Documents 裡找重複檔，幫我決定要留哪一個」 |
| 桌面 | 「桌面太多東西，幫我整理到對應的 Documents 子資料夾」 |
| 專案結構 | 「檢視我的 Projects 資料夾，建議把進行中與舊專案分開並歸檔」 |
| 照片 | 「把這個資料夾的照片依拍攝日期（年/月）整理」 |
| 工作與個人 | 「幫我把 Documents 裡的工作與個人檔案分開」 |

## 重要原則（Rules）

- **不主動刪除**：除非使用者已對「將刪除的檔案清單」明確同意。
- **先計畫再執行**：提出結構與變更清單，取得同意後才搬移/重新命名/刪除。
- **路徑與權限**：Windows 路徑注意空格與特殊字元（必要時用引號）；無權限時說明並建議以管理員或調整權限後再試。
- **大規模變更**：若檔案量極大，可建議先做子目錄或單一類型試跑，再全面執行。

## 進階與範例（Reference）

- 更多完整範例（Downloads 整理、重複檔報告、專案重構、照片依日期整理）與詳細指令說明，見 [reference/organizer-reference.md](reference/organizer-reference.md)。
