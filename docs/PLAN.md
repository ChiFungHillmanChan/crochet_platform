# Crochet E-Commerce Platform — Implementation Plan

## Context

Building a crochet e-commerce shop from scratch. The repo has developer tooling (`.claude/`, `.cursor/rules/`) and reference photos (`Crochet videos-photos/`) but **zero application code** — no `package.json`, no `app/`, nothing scaffolded yet. The previous session got stuck on skill file cleanup. This plan bootstraps and builds the full MVP.

**Goal**: A bilingual (EN/zh-TW) online shop where customers browse crochet products, add to cart, and pay via Stripe. An admin dashboard lets the owner manage products and orders.

---

## Phase 1 — Project Bootstrap & Core Setup

### Step 1.1 — Bootstrap Next.js 15
```bash
pnpm create next-app . --typescript --tailwind --eslint --app --src-dir no --import-alias "@/*"
```
- Accept: TypeScript, ESLint, Tailwind, App Router, Turbopack
- Verify `pnpm-lock.yaml` generated

### Step 1.2 — Install dependencies
```bash
pnpm add prisma @prisma/client zustand next-intl stripe @stripe/stripe-js @azure/storage-blob bcryptjs
pnpm add -D @types/bcryptjs tsx
```

### Step 1.3 — shadcn/ui
```bash
pnpm dlx shadcn init
pnpm dlx shadcn add button card badge input label select textarea dialog sheet dropdown-menu table toast separator skeleton
```

### Step 1.4 — Configure primary color `#174F7F`
- **File**: `tailwind.config.ts` — extend `colors.primary`
- **File**: `app/globals.css` — set `--primary` CSS variable

### Step 1.5 — Add scripts to `package.json`
- `db:dev:migrate`, `db:dev:generate`, `db:dev:studio`, `db:dev:seed`
- `db:prod:generate`, `db:prod:migrate`
- `typecheck`

### Step 1.6 — Update `.gitignore`
Add: `node_modules/`, `.next/`, `.env`, `.env.local`, `*.db`, `dist/`

### Step 1.7 — Create `.env.example`
Document all required env vars: `DATABASE_URL`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `AZURE_STORAGE_CONNECTION_STRING`, `AZURE_STORAGE_CONTAINER_NAME`, `NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING`, `ADMIN_PASSWORD_HASH`, `NEXT_PUBLIC_BASE_URL`

**Verify**: `pnpm dev` starts successfully

---

## Phase 2 — Database Schema & Prisma

### Step 2.1 — Create dual schemas
- **File**: `prisma/schema.dev.prisma` (SQLite)
- **File**: `prisma/schema.prod.prisma` (MS SQL Server)

Models: `Category`, `Product` (with `slug`), `ProductImage`, `Order`, `OrderItem`

### Step 2.2 — Prisma client singleton
- **File**: `lib/prisma.ts`

### Step 2.3 — Run migration & generate
```bash
pnpm db:dev:migrate  # name: "initial-schema"
pnpm db:dev:generate
```

### Step 2.4 — Seed data
- **File**: `prisma/seed.ts` — 4 categories + 6-8 sample products with placeholder image URLs

**Verify**: `pnpm db:dev:seed` populates DB, `pnpm db:dev:studio` shows data

---

## Phase 3 — Layout Shell & i18n

### Step 3.1 — next-intl setup
- **File**: `i18n/routing.ts` — locales: `['en', 'zh-TW']`, default: `'en'`
- **File**: `i18n/request.ts` — server config
- **File**: `middleware.ts` — locale routing middleware
- **File**: `next.config.ts` — wrap with `createNextIntlPlugin`

### Step 3.2 — App router structure
```
app/[locale]/
  layout.tsx
  ClientIntlProvider.tsx
  (shop)/              <- public shop routes
    page.tsx
    products/[slug]/page.tsx
    cart/page.tsx
    checkout/page.tsx
    checkout/success/page.tsx
  (admin)/             <- admin routes
    admin/layout.tsx
    admin/page.tsx
    admin/login/page.tsx
    admin/products/page.tsx
    admin/products/new/page.tsx
    admin/products/[id]/edit/page.tsx
    admin/orders/page.tsx
    admin/orders/[id]/page.tsx
```

### Step 3.3 — ClientIntlProvider
- **File**: `app/[locale]/ClientIntlProvider.tsx` — auto-loads feature namespaces: `shop`, `cart`, `checkout`, `admin`

### Step 3.4 — Translation files
```
messages/en.json, messages/zh-TW.json (nav, common, footer)
messages/en/{shop,cart,checkout,admin}.json
messages/zh-TW/{shop,cart,checkout,admin}.json
```

### Step 3.5 — Layout components
- **File**: `components/MainLayout.tsx` — fixed navbar + content area (shop)
- **File**: `components/AdminLayout.tsx` — fixed sidebar (`ml-72`/`ml-20`) + navbar (`pt-20`)
- **File**: `components/Navbar.tsx` — logo, nav links, locale switcher, cart icon
- **File**: `components/Footer.tsx`
- **File**: `components/LocaleSwitcher.tsx`

**Verify**: `pnpm dev`, navigate to `/en` and `/zh-TW`, layout renders correctly

---

## Phase 4 — Product Catalog

### Step 4.1 — Server actions
- **File**: `app/actions/products/read.ts` — `getActiveProducts()`, `getProductBySlug()`, `getCategories()`

### Step 4.2 — Shop components
- **File**: `components/shop/ProductCard.tsx` — uses `<img>` (not `<Image>`), locale-aware name
- **File**: `components/shop/ProductGrid.tsx` — responsive grid (2/3/4 cols)
- **File**: `components/shop/CategoryFilter.tsx` — filter pills
- **File**: `components/shop/ImageGallery.tsx` — multi-image viewer with dialog
- **File**: `components/shop/AddToCartButton.tsx`

### Step 4.3 — Pages
- **File**: `app/[locale]/(shop)/page.tsx` — hero + category filter + product grid
- **File**: `app/[locale]/(shop)/products/[slug]/page.tsx` — detail with gallery, description, add-to-cart

**Verify**: Products render from seed data, category filtering works

---

## Phase 5 — Shopping Cart (Zustand)

### Step 5.1 — Cart store
- **File**: `stores/cartStore.ts` — Zustand with `persist` middleware (localStorage)
- Methods: `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `totalItems`, `totalPrice`

### Step 5.2 — Cart UI
- **File**: `components/CartIcon.tsx` — badge with item count in navbar
- **File**: `components/shop/QuantitySelector.tsx`
- **File**: `app/[locale]/(shop)/cart/page.tsx` — cart items, quantities, totals, proceed to checkout

**Verify**: Add/remove items, refresh page (cart persists), quantities update

---

## Phase 6 — Checkout & Stripe

### Step 6.1 — Stripe service
- **File**: `app/services/stripe.ts` — `createStripeClient()` factory (runtime env var access)

### Step 6.2 — Checkout server action
- **File**: `app/actions/checkout/create.ts` — validates stock, creates Order in DB, creates Stripe Checkout Session, returns redirect URL

### Step 6.3 — Stripe webhook (only API route)
- **File**: `app/api/webhooks/stripe/route.ts` — handles `checkout.session.completed`, updates order status to PAID, decrements stock

### Step 6.4 — Checkout pages
- **File**: `app/[locale]/(shop)/checkout/page.tsx` — order summary + email input + pay button
- **File**: `app/[locale]/(shop)/checkout/success/page.tsx` — confirmation + cart clear

**Verify**: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`, complete test checkout

---

## Phase 7 — Azure Blob Image Upload

### Step 7.1 — Azure Blob service
- **File**: `app/services/azure-blob.ts` — `uploadProductImage()`, `deleteProductImage()` factory functions

### Step 7.2 — Image upload action
- **File**: `app/actions/products/upload.ts` — `addProductImage()`, `removeProductImage()` with file validation (type, size)

**Verify**: Upload test image, verify URL returned and accessible

---

## Phase 8 — Admin Dashboard

### Step 8.1 — Admin auth (simple password gate)
- **File**: `app/actions/admin/auth.ts` — `adminLogin()`, `requireAdmin()`, `adminLogout()` using bcrypt + httpOnly cookie
- **File**: `app/[locale]/(admin)/admin/login/page.tsx`

### Step 8.2 — Product CRUD actions
- **File**: `app/actions/products/create.ts`
- **File**: `app/actions/products/update.ts`
- **File**: `app/actions/products/delete.ts` (soft delete: `isActive: false`)

### Step 8.3 — Order actions
- **File**: `app/actions/orders/read.ts`
- **File**: `app/actions/orders/update.ts` — status transitions

### Step 8.4 — Admin components (keep under 300 lines each)
- **File**: `components/admin/ProductForm.tsx` — shared create/edit form
- **File**: `components/admin/ImageUploader.tsx` — drag-and-drop upload
- **File**: `components/admin/OrderStatusBadge.tsx`
- **File**: `components/admin/StatsGrid.tsx`

### Step 8.5 — Admin pages
- `admin/page.tsx` — stats dashboard (orders, revenue, products, pending)
- `admin/products/page.tsx` — product table with edit/delete
- `admin/products/new/page.tsx` — create form + image upload
- `admin/products/[id]/edit/page.tsx` — edit form
- `admin/orders/page.tsx` — order list with status filter
- `admin/orders/[id]/page.tsx` — order detail + status update

**Verify**: Login, create product with images, see it on shop, place order, see it in admin

---

## Phase 9 — Error Tracking & Docker

### Step 9.1 — Application Insights
- **File**: `app/services/app-insights.ts` — client-side init
- **File**: `components/AppInsightsProvider.tsx`

### Step 9.2 — Docker
- **File**: `Dockerfile` — multi-stage (deps → builder → runner), non-root user
- **File**: `.dockerignore`
- **File**: `next.config.ts` — add `output: 'standalone'`

**Verify**: `docker build -t crochet-shop .` && `docker run -p 3000:3000 crochet-shop`

---

## Key Rules to Follow

| Rule | What it means |
|------|---------------|
| Server actions over API routes | All data ops in `app/actions/`. Only exception: Stripe webhook |
| SDK factory functions | `app/services/*.ts` — env vars accessed at runtime only, never module-level |
| Prisma generated types | Never create manual interfaces for DB models |
| Regular `<img>` for external images | Azure Blob URLs use `<img>`, not Next.js `<Image>` |
| Files under 300 lines | Split proactively into components |
| Dual Prisma schema | Always edit both `schema.dev.prisma` and `schema.prod.prisma` |
| `pnpm db:dev:migrate` | Never use bare `prisma migrate` |
| Page structure | Root `<div className="space-y-6">` with `bg-white shadow rounded-lg p-6` cards |
| Primary color | `#174F7F` |

---

## Verification

After each phase:
1. `pnpm dev` — app starts without errors
2. `pnpm build` — production build succeeds
3. `pnpm lint` — no lint errors
4. `pnpm typecheck` — no type errors
5. Manual smoke test of new features

Full end-to-end test after Phase 8:
1. Browse products on homepage
2. Filter by category
3. View product detail
4. Add items to cart
5. Switch language (EN ↔ zh-TW)
6. Proceed to checkout, enter email, pay via Stripe test mode
7. Verify order appears in admin dashboard
8. Update order status in admin
