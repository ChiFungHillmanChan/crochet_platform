# Production Readiness — 剩餘修復 Prompt

P0 (Steps 1-5)、P1 (Steps 6-11)、同 P2 (Steps 12, 13, 15) 已全部完成。
以下係仲未完成嘅項目。

---

## 剩餘 P2 項目

### Step 14 — 產品目錄增長（搜尋 + 篩選 + 變體）🔲 未開始

```
讀取 docs/fixes/14-product-catalog-growth.md 並實現。

呢個係長期功能，適合喺產品數量增長到 50+ 時實現。
```

---

### Step 15 (原 14) — 監控 (Sentry) ⏭️ 已跳過

Sentry 整合延後到流量增長後再加。目前保留 console.error/warn。
如需實現，參考 docs/fixes/15-monitoring-observability.md。

---

## 部署 Prompt

全部修復完成後，用呢個 prompt 部署：

```
所有 P0 + P1 修復已完成。請幫我準備部署：

1. 確認 pnpm lint && pnpm typecheck && pnpm build 全部通過
2. 列出所有需要部署嘅 Lambda zip（admin + webhook）
3. 列出所有需要喺 AWS Console 手動操作嘅步驟（CloudFront Function、API Gateway throttling、WAF）
4. 列出所有需要加入嘅環境變數（GitHub Secrets、Lambda env）
5. 生成部署 checklist
```
