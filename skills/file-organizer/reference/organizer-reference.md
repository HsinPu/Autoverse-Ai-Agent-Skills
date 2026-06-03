# 檔案整理 Skill — 參考與範例（File Organizer Reference）

本文件提供完整輸出範例、進階 PowerShell 指令與情境說明，供需要時查閱。

---

## 整理計畫完整範本（Full Plan Template）

```markdown
# Organization Plan for [目錄名稱]

## Current State（現況）
- X files across Y folders
- Total size: [Z] GB
- File types: [breakdown]
- Issues: [list problems]

## Proposed Structure（建議結構）

[目錄]/
├── Work/
│   ├── Projects/
│   ├── Documents/
│   └── Archive/
├── Personal/
│   ├── Photos/
│   ├── Documents/
│   └── Media/
└── Downloads/
    ├── To-Sort/
    └── Archive/

## Changes I'll Make（將執行的變更）

1. **Create new folders**: [list]
2. **Move files**:
   - X PDFs → Work/Documents/
   - Y images → Personal/Photos/
   - Z old files → Archive/
3. **Rename files**: [any renaming patterns]
4. **Delete**: [only after explicit approval, list files]

## Files Needing Your Decision（需您決定的項目）

- [List any files you're unsure about]

Ready to proceed? (yes / no / modify)
```

---

## 範例 1：整理下載資料夾（Organizing Downloads）

**使用者**：「Downloads 有 500 多個檔案很亂，幫我整理。」

**流程摘要**：

1. 分析 Downloads：統計類型（工作文件、個人照片、安裝檔、PDF 等）。
2. 提出結構，例如：
   - Downloads/Work/
   - Downloads/Personal/
   - Downloads/Installers/（DMG、PKG、MSI、EXE）
   - Downloads/Archive/
   - Downloads/ToSort/（需人工決定）
3. 取得確認後依檔名與副檔名搬移。
4. 結果：500 檔案 → 數個有邏輯的子資料夾。

---

## 範例 2：重複檔報告輸出（Duplicate Report Output）

**使用者**：「在 Documents 找重複檔，幫我決定留哪一個。」

**輸出範例**：

```markdown
# 發現 23 組重複（共約 156 MB）

## Duplicate Set 1: "proposal.pdf"
- `C:\Users\...\Documents\proposal.pdf` (2.3 MB, 修改: 2024-03-15)
- `C:\Users\...\Documents\old\proposal.pdf` (2.3 MB, 修改: 2024-03-15)
- `C:\Users\...\Desktop\proposal.pdf` (2.3 MB, 修改: 2024-03-10)

**建議**：保留 `Documents\proposal.pdf`（最新且在正確位置）。是否刪除另外 2 份？

[其餘重複組依此格式列出...]
```

---

## 範例 3：專案目錄重構建議（Restructuring Projects）

**使用者**：「檢視我的 ~/Projects 並建議改進。」

**輸出範例**：

```markdown
# ~/Projects 分析

## 現有結構問題
- 進行中與多年未動的專案混在一起
- 命名不一致
- 部分在根目錄、部分在隨機子資料夾
- 存在重複資料夾（project-name、project-name-old、project-name-v2）

## 建議結構

Projects/
├── Active/
│   ├── client-work/
│   ├── side-projects/
│   └── learning/
├── Archive/
│   ├── 2022/
│   ├── 2023/
│   └── 2024/
└── Templates/

## 具體變更
1. 將 12 個自 2022 年起未修改的專案 → Archive/
2. 合併 4 組重複專案資料夾
3. 統一命名：例如 "client-name-project-name"
4. 建立 Archive 存放舊專案

是否要執行？
```

---

## 範例 4：照片依日期整理（Photos by Date）

**使用者**：「把照片依年/月整理。」

**建議結構**：

```
Photos/
├── 2023/
│   ├── 01-January/
│   ├── 02-February/
│   └── ...
├── 2024/
│   ├── 01-January/
│   └── ...
└── Unsorted/
```

搬移時可依 EXIF 拍攝日期或檔案修改日期分類；無日期的放 Unsorted。

---

## 完成後摘要範本（Post-Completion Summary）

```markdown
# 整理完成

## 變更摘要
- 新增 [X] 個資料夾
- 整理 [Y] 個檔案
- 移除重複釋出 [Z] GB
- 歸檔 [W] 個舊檔案

## 新結構
[Show the new folder tree]

## 維護建議
1. **每週**：整理新下載
2. **每月**：檢視並歸檔已完成專案
3. **每季**：檢查是否產生新重複
4. **每年**：歸檔舊檔案

## 常用指令（PowerShell）
# 最近 7 天修改的檔案
Get-ChildItem -Path "路徑" -Recurse -File | Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-7) }

# 依副檔名分組
Get-ChildItem -Path "路徑" -Recurse -File | Group-Object Extension
```

---

## 進階 PowerShell 指令（Windows）

| 目的 | 指令 |
|------|------|
| 依副檔名統計 | `Get-ChildItem -Recurse -File \| Group-Object Extension \| Sort-Object Count -Descending` |
| 前 N 大檔案 | `Get-ChildItem -Recurse -File \| Sort-Object Length -Descending \| Select-Object -First N` |
| 同檔名重複 | `Get-ChildItem -Recurse -File \| Group-Object Name \| Where-Object { $_.Count -gt 1 }` |
| 內容重複（MD5） | `Get-ChildItem -Recurse -File \| Get-FileHash -Algorithm MD5 \| Group-Object Hash \| Where-Object { $_.Count -gt 1 }` |
| 最近 N 天未修改 | `Get-ChildItem -Recurse -File \| Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-180) }` |

---

## 相關情境（Related Use Cases）

- 新電腦的檔案與資料夾結構規劃
- 備份／歸檔前的整理
- 儲存空間不足前的清理
- 共用團隊資料夾的結構建議
- 新專案目錄結構規劃
