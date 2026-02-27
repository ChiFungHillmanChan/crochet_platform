# Production Readiness 修復指南

## 總覽

Production Readiness 審查發現嘅問題。P0、P1、同大部分 P2 已全部完成。
剩餘未完成嘅修復檔案保留喺呢個目錄。

## 完成狀態

| Phase | 狀態 |
|-------|------|
| P0 — Blockers (Steps 1-5) | ✅ 全部完成 |
| P1 — 改善 (Steps 6-11) | ✅ 全部完成 |
| P2 — 長期 (Steps 12-16) | 🔶 大部分完成 |

## 剩餘未完成項目

| # | 檔案 | 問題 | 狀態 |
|---|------|------|------|
| 14 | [14-product-catalog-growth.md](./14-product-catalog-growth.md) | 搜尋 + 篩選 + 變體 | 🔲 未開始 |
| 15 | [15-monitoring-observability.md](./15-monitoring-observability.md) | 錯誤追蹤 + APM (Sentry) | ⏭️ 已跳過，待流量增長後再加 |

## 使用方法

每個檔案包含：
1. **問題描述** — 咩問題、點解嚴重
2. **影響範圍** — 涉及邊啲檔案
3. **具體修復步驟** — 逐步代碼示例
4. **驗證方法** — 點樣確認已修復
5. **相關檔案清單** — 需要改嘅檔案路徑

可以用 Claude Code 逐個修復：`請根據 docs/fixes/14-product-catalog-growth.md 進行修復`
