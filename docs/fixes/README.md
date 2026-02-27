# Production Readiness 修復指南

## 總覽

呢個目錄包含所有 Production Readiness 審查發現嘅問題同修復方案。
每個檔案對應一個獨立嘅修復任務，可以並行處理。

## 優先級分類

### P0 — 上線前必須修復 (Blockers) ✅ 全部完成
| # | 檔案 | 問題 | 狀態 |
|---|------|------|------|
| 1 | [01-security-headers.md](./01-security-headers.md) | 安全標頭完全缺失 | ✅ 已完成 |
| 2 | [02-gdpr-compliance.md](./02-gdpr-compliance.md) | GDPR / UK 數據保護法未合規 | ✅ 已完成 |
| 3 | [03-analytics-tracking.md](./03-analytics-tracking.md) | Google Analytics 完全缺失 | ✅ 已完成 |
| 4 | [04-rate-limiting.md](./04-rate-limiting.md) | API 速率限制未實現 | ✅ 已完成 (script generated) |
| 5 | [05-cors-fix.md](./05-cors-fix.md) | CORS 配置有缺陷 | ✅ 已完成 |

### P1 — 上線後 1 個月內修復 ✅ 全部完成
| # | 檔案 | 問題 | 狀態 |
|---|------|------|------|
| 6 | [06-seo-sitemap.md](./06-seo-sitemap.md) | Sitemap 不完整 + OG 標籤缺失 | ✅ 已完成 |
| 7 | [07-hero-image-optimization.md](./07-hero-image-optimization.md) | Hero 圖片未優化 (600KB) | ✅ 已完成 |
| 8 | [08-backend-validation.md](./08-backend-validation.md) | 後端輸入驗證不足 | ✅ 已完成 |
| 9 | [09-webhook-improvements.md](./09-webhook-improvements.md) | Webhook 狀態碼 + 錯誤處理 | ✅ 已完成 |
| 10 | [10-email-improvements.md](./10-email-improvements.md) | 運送通知 + 郵件國際化 | ✅ 已完成 |
| 11 | [11-admin-enhancements.md](./11-admin-enhancements.md) | 庫存警告 + 客戶管理 | ✅ 已完成 |

### P2 — 3-6 個月內修復
| # | 檔案 | 問題 | 狀態 |
|---|------|------|------|
| 12 | [12-testing-infrastructure.md](./12-testing-infrastructure.md) | 零測試覆蓋 | ✅ 已完成 — Vitest + 11 tests |
| 13 | [13-performance-scaling.md](./13-performance-scaling.md) | 查詢分頁 + 快取策略 | ✅ 已完成 — cursor-based pagination |
| 14 | [14-product-catalog-growth.md](./14-product-catalog-growth.md) | 搜尋 + 篩選 + 變體 | 🔲 未開始 |
| 15 | [15-monitoring-observability.md](./15-monitoring-observability.md) | 錯誤追蹤 + APM | ⏭️ 已跳過 (Sentry deferred) |
| 16 | [16-code-quality-fixes.md](./16-code-quality-fixes.md) | 組件拆分 + console 清理 | ✅ 已完成 — split + memo + fix |

## 使用方法

每個檔案包含：
1. **問題描述** — 咩問題、點解嚴重
2. **影響範圍** — 涉及邊啲檔案
3. **具體修復步驟** — 逐步代碼示例
4. **驗證方法** — 點樣確認已修復
5. **相關檔案清單** — 需要改嘅檔案路徑

可以用 Claude Code 逐個修復：`請根據 docs/fixes/01-security-headers.md 進行修復`
