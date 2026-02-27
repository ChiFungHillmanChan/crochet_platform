# 15 — 錯誤追蹤 + APM

## 優先級：P2
## 預計時間：3 日
## 嚴重性：🟡 中危

---

## 問題描述

1. **冇客戶端錯誤追蹤**：JS 錯誤完全睇唔到
2. **冇 APM（應用性能監測）**：唔知道邊個 API 端點慢
3. **冇告警**：Firestore 成本暴增、Lambda 超時都冇通知
4. **11 個 `console.error` 喺生產代碼中**：應該用結構化日誌

---

## 修復步驟

### 步驟 1：Sentry 錯誤追蹤（免費層 5k events/月）

```bash
pnpm add @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

配置 `sentry.client.config.ts`：
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1, // 10% 性能追蹤
  environment: process.env.NODE_ENV,
});
```

### 步驟 2：CloudWatch 告警

```bash
# Firestore 成本告警
aws cloudwatch put-metric-alarm \
  --alarm-name "FirestoreCostHigh" \
  --metric-name EstimatedCharges \
  --namespace AWS/Billing \
  --threshold 50 \
  --comparison-operator GreaterThanThreshold

# Lambda 錯誤告警
aws cloudwatch put-metric-alarm \
  --alarm-name "LambdaErrors" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --threshold 10 \
  --period 300
```

### 步驟 3：移除 console.error

用 Sentry 取代所有 `console.error`：
```javascript
// 之前
console.error("Cart sync failed:", err);

// 之後
Sentry.captureException(err, { tags: { component: "cart-sync" } });
```

---

## 相關檔案

- `package.json`
- `sentry.client.config.ts` (新建)
- 所有含 `console.error` 嘅檔案（11 個）
- AWS CloudWatch Console
