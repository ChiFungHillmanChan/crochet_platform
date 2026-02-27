# 14 — 搜尋 + 篩選 + 產品變體

## 優先級：P2
## 預計時間：2 週
## 嚴重性：🟢 低危（功能增強）

---

## 問題描述

1. **冇全文搜尋**：用戶無法搜尋「粉紅兔子」或「聖誕禮物」
2. **冇價格/屬性篩選**：只有分類篩選，冇價格範圍、顏色等
3. **冇產品變體**：唔支援同一產品嘅唔同色彩/尺寸

---

## 修復步驟

### 搜尋 — 方案 A：Algolia（推薦）

```bash
pnpm add algoliasearch
```

1. Lambda 同步產品到 Algolia（建立/更新時）
2. 前端用 Algolia API 搜尋
3. 成本：免費層 10,000 記錄/月

### 搜尋 — 方案 B：客戶端篩選（快速實現）

喺 `ShopContent.tsx` 加入搜尋框，用 `product.name.toLowerCase().includes(query)` 過濾已載入嘅產品。
適合 < 100 個產品。

### 價格篩選

Firestore 複合索引 + 前端 UI 選擇器。

### 產品變體（P3）

喺 Product 模型加入 `variants` 陣列：
```typescript
interface ProductVariant {
  sku: string;
  color?: string;
  size?: string;
  stock: number;
  priceOverride?: number; // 如果唔同變體有唔同價格
}
```

---

## 相關檔案

- `lib/products.ts`
- `components/shop/ShopContent.tsx`
- `lib/types.ts`
- `lambda/admin/index.mjs`
