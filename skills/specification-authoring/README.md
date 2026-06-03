# specification-authoring

用來撰寫、重整與審查技術規格說明書（Spec）相關文件的 Skill。

## 什麼時候使用

- 撰寫新的 Spec
- 依既有程式碼反推規格
- 檢查章節結構、front matter、版本紀錄是否完整
- 審查功能規格或技術詳細設計內容

## 主要檔案

- `SKILL.md`: Skill 入口與核心規則
- `references/front-matter-and-structure.md`: 章節與 front matter 結構
- `references/section-content-guidelines.md`: 各章節內容指引
- `references/code-to-spec-workflow.md`: 從程式碼產出 Spec 的流程
- `references/code-to-spec-java.md`: Java / JVM 專用檢查表
- `references/code-to-spec-python.md`: Python 專用檢查表
- `references/diagrams-and-conventions.md`: 圖表與撰寫慣例

## 使用方式

將整個 `specification-authoring/` 資料夾放到對應的 skills 目錄，讓 Agent 依 `SKILL.md` 自動載入。
