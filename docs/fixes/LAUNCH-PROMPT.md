# Production Readiness 修復啟動 Prompt

將以下 prompt 逐個複製貼到 Claude Code 執行。每個完成後先確認通過再進入下一個。

---

## Phase 1：P0 Blockers（預計 4 小時）

### Step 1/5 — CORS 修復 (30 min)

```
讀取 docs/fixes/05-cors-fix.md 並按照入面嘅步驟修復 CORS 配置。

具體要做：
1. 修改 lambda/shared/response.mjs — 加 .trim().filter(Boolean)、加 Vary: Origin、唔允許嘅 origin 唔返回 Access-Control-Allow-Origin
2. 修改後 zip 重新打包 admin + webhook Lambda（唔好 deploy，只係打包）
3. 跑 pnpm lint && pnpm typecheck && pnpm build 確認冇破壞前端
```

---

### Step 2/5 — 安全標頭 (1 hr)

```
讀取 docs/fixes/01-security-headers.md 並按照入面嘅步驟修復安全標頭。

具體要做：
1. 建立 cloudfront-security-headers.js 檔案喺項目根目錄（CloudFront Function 代碼）
2. 修改 lambda/shared/response.mjs — 喺 corsHeaders 返回值加入 X-Content-Type-Options、X-Frame-Options、Strict-Transport-Security、Referrer-Policy
3. 重新打包 admin + webhook Lambda zip
4. 跑 pnpm lint && pnpm typecheck && pnpm build
```

---

### Step 3/5 — GDPR 合規 (2 hr)

```
讀取 docs/fixes/02-gdpr-compliance.md 並按照入面嘅步驟實現 GDPR 合規。

具體要做：
1. 建立 components/layout/CookieConsent.tsx — Cookie 同意橫幅（localStorage 存 consent 狀態）
2. 喺 messages/en.json 加入 "cookie" namespace（message, accept, reject, learnMore）
3. 喺 messages/zh-hk.json 加入對應嘅繁體中文翻譯
4. 建立 app/[locale]/privacy/page.tsx — 隱私政策頁面（用 i18n 翻譯鍵）
5. 喺 messages/en.json 加入 "privacy" namespace（所有 sections）
6. 喺 messages/zh-hk.json 加入對應翻譯
7. 建立 app/[locale]/terms/page.tsx — 服務條款頁面
8. 建立 app/[locale]/returns/page.tsx — 返品政策頁面（14天冷靜期）
9. 修改 components/layout/Footer.tsx — 加入 Privacy、Terms、Returns 連結
10. 喺 app/[locale]/layout.tsx 加入 <CookieConsent /> 組件
11. 跑 pnpm lint && pnpm typecheck && pnpm build
```

---

### Step 4/5 — Google Analytics (1 hr)

```
讀取 docs/fixes/03-analytics-tracking.md 並按照入面嘅步驟加入 GA4 分析追蹤。

具體要做：
1. 建立 lib/analytics.ts — trackViewProduct, trackAddToCart, trackRemoveFromCart, trackBeginCheckout, trackPurchase 工具函數
2. 建立 components/analytics/GoogleAnalytics.tsx — GA4 Script 組件（用 next/script，檢查 cookie consent 狀態先載入）
3. 加入 window.gtag 類型聲明（globals.d.ts 或 analytics.ts 入面）
4. 修改 app/[locale]/layout.tsx — 加入 <GoogleAnalytics /> 組件
5. 修改 components/shop/ProductDetail.tsx — useEffect 入面加 trackViewProduct
6. 修改加入購物車嘅邏輯 — 加 trackAddToCart
7. 修改 components/shop/CheckoutContent.tsx — handleContinueToPayment 入面加 trackBeginCheckout
8. .env.local 加入 NEXT_PUBLIC_GA_MEASUREMENT_ID=G-PLACEHOLDER（之後替換真實 ID）
9. 跑 pnpm lint && pnpm typecheck && pnpm build
```

---

### Step 5/5 — Rate Limiting 文檔 (15 min)

```
讀取 docs/fixes/04-rate-limiting.md。

呢個係 AWS Console 操作，唔需要改代碼。請幫我生成一個 shell script 檔案 scripts/setup-rate-limiting.sh，入面包含所有 AWS CLI 命令（API Gateway throttling + WAF），加註解說明每步做咩。標記為 chmod +x。唔好實際執行，只係生成 script。
```

---

## Phase 2：P1 改善（預計 8 小時，可分多日做）

### Step 6 — SEO Sitemap + OG 標籤 (1 hr)

```
讀取 docs/fixes/06-seo-sitemap.md 並修復。

具體要做：
1. 修改 scripts/generate-seo.ts — 擴展 routes 陣列加入 /shop/, /about/, /faq/, /shipping/, /contact/, /privacy/, /terms/, /returns/
2. 修改 app/[locale]/shop/page.tsx — generateMetadata 加入完整 openGraph（title, description, url, type, images）
3. 修改 app/[locale]/products/[slug]/page.tsx — openGraph 加入 type: "product" 同 images
4. 修改 app/[locale]/faq/page.tsx, shipping/page.tsx, contact/page.tsx — 各自補全 openGraph images
5. 如果 shop namespace 缺少 seoTitle/seoDescription，加入 messages/en.json 同 zh-hk.json
6. 跑 pnpm generate:seo 重新生成 sitemap
7. 跑 pnpm lint && pnpm typecheck && pnpm build
```

---

### Step 7 — Hero 圖片優化 (30 min)

```
讀取 docs/fixes/07-hero-image-optimization.md 並修復。

具體要做：
1. 修改 components/shop/HeroBanner.tsx — 將 hero 背景圖改用 <picture> 元素，<source srcSet="/hero-bg.webp" type="image/webp">，fallback 到 PNG
2. 確保 img 標籤有 loading="eager" fetchPriority="high" width height 屬性
3. 跑 pnpm lint && pnpm typecheck && pnpm build
```

---

### Step 8 — 後端驗證加強 (2 hr)

```
讀取 docs/fixes/08-backend-validation.md 並修復。

具體要做：
1. 建立 lambda/shared/validate.mjs — validateProduct(), validateCheckoutDetails(), validateUpload() 函數
2. 修改 lambda/admin/index.mjs — createProduct 同 updateProduct 入面調用 validateProduct()
3. 修改 lambda/admin/checkout.mjs — 開頭調用 validateCheckoutDetails()，返回 400 如果有 errors
4. 修改 lambda/admin/index.mjs 嘅 get-upload-url — 加 10MB 檔案大小限制
5. 重新打包 admin Lambda zip
6. 跑 pnpm lint && pnpm typecheck && pnpm build（前端唔受影響）
```

---

### Step 9 — Webhook 改善 (30 min)

```
讀取 docs/fixes/09-webhook-improvements.md 並修復。

具體要做：
1. 修改 lambda/webhook/index.mjs — 無效簽名嘅 statusCode 從 400 改為 403
2. 修改 catch 塊 — 處理失敗嘅 statusCode 從 500 改為 202
3. 重新打包 webhook Lambda zip
```

---

### Step 10 — 運送通知郵件 (2 hr)

```
讀取 docs/fixes/10-email-improvements.md 並修復。

具體要做：
1. 喺 lambda/webhook/emails.mjs 加入 buildShippingNotificationEmail() 函數（含 Royal Mail/DPD/Evri tracking URL）
2. 喺 lambda/admin/index.mjs 加入 "mark-shipped" action — 更新訂單狀態 + 發送運送通知郵件
3. 修改 components/admin/OrderDetailClient.tsx — 當訂單狀態係 "paid" 時顯示「Mark as Shipped」表單（tracking number + carrier select）
4. 喺 messages/en.json admin namespace 加入相關翻譯
5. 重新打包 admin Lambda zip
6. 跑 pnpm lint && pnpm typecheck && pnpm build
```

---

### Step 11 — 管理員功能增強 (2 hr)

```
讀取 docs/fixes/11-admin-enhancements.md 並修復。

具體要做：
1. 修改 components/admin/DashboardContent.tsx — 加入 LowStockAlert 組件（查詢 stock <= 5 嘅產品）
2. 喺 lambda/admin/index.mjs 加入 "get-customers" action — 從訂單聚合客戶資料
3. 建立 app/[locale]/admin/customers/page.tsx — 客戶管理頁面
4. 建立 components/admin/CustomerTable.tsx — 客戶列表（email, name, orderCount, totalSpent, lastOrder）
5. 修改 components/layout/AdminSidebar.tsx — 加入 Customers 導航連結
6. 喺 firestore.indexes.json 加入 products (isActive + stock) 複合索引
7. 重新打包 admin Lambda zip
8. 跑 pnpm lint && pnpm typecheck && pnpm build
```

---

## Phase 3：P2 改善 ✅ 已完成（Step 12, 13, 15）

### Step 12 — 測試基礎設施 ✅ 已完成

已完成內容：
- 安裝 vitest, @testing-library/react, @testing-library/jest-dom, jsdom, @vitejs/plugin-react
- 建立 vitest.config.ts (jsdom env, globals, @ alias)
- 建立 __tests__/setup.ts
- 建立 __tests__/stores/cartStore.test.ts — 7 個測試全部通過
- 建立 __tests__/lib/utils.test.ts — 4 個測試全部通過
- package.json 已加入 "test" 同 "test:run" scripts

---

### Step 13 — 性能優化 ✅ 已完成

已完成內容：
- lib/products.ts 加入 getProductsPaginated() — cursor-based Firestore 分頁
- ShopContent.tsx 已用分頁 API + 「Load More」按鈕
- 按價格排序時回退到載入全部產品（Firestore cursor 只支持 orderBy 欄位）

---

### Step 14 — 監控 ⏭️ 已跳過

Sentry 整合延後到流量增長後再加。目前保留 console.error/warn。

---

### Step 15 — 代碼質量 ✅ 已完成

已完成內容：
- ShopContent.tsx (264行) 拆分為 ShopFilters.tsx (78行) + ProductGrid.tsx (75行) + ShopContent.tsx (140行)
- AdminPaymentLinks.tsx (252行) 拆分為 PaymentLinkForm.tsx (100行) + PaymentLinkTable.tsx (113行) + AdminPaymentLinks.tsx (56行)
- 修復 lib/api.ts 空 catch 塊 — 保留伺服器錯誤訊息
- ProductCard 已加 React.memo
- 所有新檔案 < 300 行

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
