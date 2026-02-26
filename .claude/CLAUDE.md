# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Self-Improving Instructions

When Claude makes a mistake or the user corrects a pattern, **update this file immediately**:
1. Add the correction to the Lessons Learned section at the bottom
2. This ensures the same mistake never happens twice

---

## Quick Reference

| Item | Location |
|------|----------|
| Tech stack | Next.js 15, React 19, Tailwind CSS v4, shadcn/ui (new-york), Firebase Auth + Firestore, Stripe, Zustand |
| Package manager | pnpm |
| Source directories | `app/`, `components/`, `lib/`, `stores/` |
| Backend | `lambda/` (AWS Lambda, plain ESM `.mjs` — separate from the Next.js app) |
| i18n | `next-intl` with `messages/en.json` and `messages/zh-hk.json` (namespaces: common, nav, footer, home, shop, product, cart, checkout, checkoutSuccess, account, auth, admin, about, notFound, orderStatus, locale, reviews, related, shipping, faq, contact) |
| Deployment | Static export (`output: "export"`) → S3 + CloudFront |
| CI | `.github/workflows/ci.yml` (lint + typecheck + build on PRs) |
| CD | `.github/workflows/deploy.yml` (build + S3 sync + CloudFront invalidation on push to main) |
| Deploy guide | `.claude/commands/deploy.md` (all URLs, resource IDs, costs) |

### Production URLs

| Service | URL |
|---------|-----|
| Frontend | https://d25l7it29vlqk3.cloudfront.net |
| API Gateway | https://2tqn1i1a3e.execute-api.eu-west-2.amazonaws.com |
| R2 Image CDN | https://pub-ae88baaaf33e44938f1264f28d62ec7c.r2.dev |
| Firebase Console | https://console.firebase.google.com/project/resume-system-470420 |

### Essential Commands
```bash
pnpm dev              # Start dev server
pnpm build            # Static export build (output: "export")
pnpm lint             # ESLint (next/core-web-vitals + next/typescript)
pnpm typecheck        # tsc --noEmit
pnpm generate:seo     # Generate sitemap/robots via scripts/generate-seo.ts
pnpm generate:images  # Generate product images via scripts/generate-images.ts
pnpm seed             # Seed Firestore with test data via scripts/seed-firestore.ts
```

No test runner is currently configured. When adding tests, use Vitest (preferred for Next.js).

---

## Architecture

### Static Export with Client-Side Data

This is a **statically exported** Next.js app (`output: "export"` in `next.config.ts`). There are no API routes or server-side rendering at runtime. All pages are pre-rendered at build time. Product data, auth, and orders are fetched client-side from Firebase/Firestore.

### Routing: `app/[locale]/...`

All routes are under `app/[locale]/` with `next-intl` handling i18n. Locales: `en`, `zh-hk` (defined in `i18n/routing.ts`).

Key routes:
- `/` — Home page with hero + product grid (ShopSection loaded dynamically)
- `/products/[slug]` — Product detail page (with reviews + related products)
- `/cart` — Shopping cart (Zustand persisted store)
- `/checkout` — Stripe checkout flow
- `/checkout/success` — Post-payment confirmation
- `/account` — User account/orders (merges orders by UID + email)
- `/account/login` — Auth (email/password + Google)
- `/shipping` — Shipping & returns info page
- `/faq` — Frequently asked questions
- `/contact` — Contact page with email link
- `/admin/**` — Admin dashboard (products CRUD, orders, reviews, stats)

### Component Organization

- `components/ui/` — shadcn/ui primitives (Button, Card, Dialog, etc.)
- `components/shop/` — Storefront components (ProductCard, CartContent, CheckoutContent, ReviewSection, RelatedProducts, ShippingContent, FaqContent, ContactContent, etc.)
- `components/admin/` — Admin dashboard (ProductForm, OrderTable, ImageUploader, ReviewForm, ReviewTable, etc.)
- `components/auth/` — Login/register forms, Google sign-in
- `components/layout/` — Navbar, Footer, AdminShell, AdminGuard, LocaleSwitcher
- `components/account/` — Account page content

### State & Data Flow

- **Auth**: `lib/auth-context.tsx` provides `AuthProvider` + `useAuth()` hook. Firebase Auth (email/password + Google). User profiles stored in Firestore `users` collection.
- **Cart**: `stores/cartStore.ts` — Zustand store with `persist` middleware (localStorage key: `cosy-loops-cart`). Prices in pence GBP.
- **Products/Categories**: `lib/products.ts` — Client-side Firestore queries. Products filtered by `isActive`. Includes `getRelatedProducts()` for same-category recommendations. Requires composite index on `isActive` + `createdAt`.
- **Reviews**: `lib/reviews.ts` — Client-side Firestore queries for approved reviews by product. Admin CRUD via Lambda (`lambda/admin/reviews.mjs`).
- **Orders**: `lib/orders.ts` — Queries by userId and by customerEmail (for guest checkout recovery).
- **API calls**: `lib/api.ts` — Single `apiPost()` function that POSTs to `NEXT_PUBLIC_API_URL` with Firebase ID token. All backend actions go through this one endpoint with an `action` field.
- **Image uploads**: `lib/r2.ts` — Gets presigned URL from backend, uploads directly to Cloudflare R2.
- **Stripe**: `lib/stripe.ts` — Lazy-loaded client-side Stripe.js.

### Backend (Lambda)

The `lambda/` directory contains AWS Lambda functions (plain `.mjs`, not part of the Next.js build — excluded in `tsconfig.json`):

- `lambda/admin/index.mjs` — Admin API (product CRUD, order management, R2 upload URLs, Stripe checkout, review CRUD)
- `lambda/admin/reviews.mjs` — Review CRUD functions (extracted to keep index.mjs under 300 lines)
- `lambda/webhook/index.mjs` — Stripe webhook handler (order creation on payment)
- `lambda/webhook/emails.mjs` — Transactional email templates
- `lambda/shared/` — Shared utilities (Firebase Admin SDK init, HTTP response helpers)

**Lambda packaging**: Files must be zipped preserving the `admin/` or `webhook/` + `shared/` directory structure. Handler is `admin/index.handler` or `webhook/index.handler`.

### Firebase / Firestore

Project: `resume-system-470420`
Collections: `users`, `products`, `categories`, `orders`, `stripeEvents`, `reviews`
- Security rules in `firestore.rules` — products/categories are read-only from client; orders readable by owner (UID or email match); reviews readable if approved; all writes only through Lambda backend.
- Composite indexes in `firestore.indexes.json` — required for product queries with `isActive` filter + `createdAt` sort, reviews by `productId` + `isApproved` + `createdAt`, orders by `customerEmail` + `createdAt`.

### Environment Variables

Frontend (must be `NEXT_PUBLIC_`):
- `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_API_URL` — Lambda API Gateway endpoint (`https://2tqn1i1a3e.execute-api.eu-west-2.amazonaws.com/admin`)

Backend (in Lambda environment):
- `FIREBASE_SERVICE_ACCOUNT` (base64), `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `ADMIN_EMAILS`, `FRONTEND_URL`, `ALLOWED_ORIGINS`
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`

---

## Key Patterns

- **Lazy Firebase imports**: `lib/firebase.ts` uses dynamic `import()` for Firebase modules to minimize bundle size. Follow this pattern when adding Firebase features.
- **Path alias**: `@/*` maps to project root (e.g., `@/lib/utils`, `@/components/ui/button`).
- **Tailwind v4**: Uses `@tailwindcss/postcss` plugin (not the classic `tailwind.config.js`). Config is in `app/globals.css`.
- **shadcn/ui**: New York style, Slate base color, CSS variables enabled. Add components with `pnpm dlx shadcn@latest add <component>`.
- **Static params**: Pages using `[locale]` must export `generateStaticParams` returning all locales.
- **Admin guard**: Admin pages use `AdminGuard` component that checks `userDoc.role === "admin"`.

---

## Engineering Behaviour

### You are a senior engineer, not a code assistant.
You think before you act. You verify your own work. You own the outcome.

### You NEVER ask permission for:
- Choosing implementation approaches — pick the better one, comment why
- Writing tests — always write them
- File/folder naming — follow existing conventions
- Minor refactors while fixing bugs — do it, note in summary
- Adding types to untyped code — just do it
- Fixing lint/format errors — always fix
- Running tests/builds/type checks — always run without asking

### You ALWAYS escalate to the human for:
- Deleting production data or database tables
- Changing `.env` / secrets / credentials
- Architectural changes affecting more than 3 major systems
- Deploying to production
- If you have failed the SAME task 3+ times in a row

### Assumption Protocol
When requirements are ambiguous, **never stop and ask**. Instead:
1. Make the most reasonable assumption
2. Add a comment: `// ASSUMPTION: [your assumption]. Change X if different behaviour needed.`
3. Continue working
4. Include assumption in your final summary

---

## Verification Pipeline

### After EVERY code change you must:
1. Run `pnpm lint` — fix until clean
2. Run `pnpm typecheck` — fix until clean
3. Run `pnpm build` — fix until it succeeds
4. Only stop when all pass
5. If stuck after 3 attempts, write `DEBUG_LOG.md`

---

## Coding Standards

- Every file under 300 lines. No exceptions.
- No code duplication. Extract shared functions.
- Self-documenting names: `isVisible`, `fetchData`, `API_BASE_URL`
- No type-safety bypasses without justification (e.g., `any`, `@ts-ignore`).
- No hardcoded secrets. Use env vars.
- No empty catch blocks. Handle errors meaningfully or let them propagate.

---

## Git Conventions

**Commits:** `<type>(<scope>): <description>` (feat, fix, refactor, test, chore, docs, perf)
**Branches:** `<type>/<ticket>-<description>` (feature/, fix/, hotfix/, release/, chore/, refactor/)
**Attribution:** `Co-Authored-By: Claude <noreply@anthropic.com>`

---

## Summary Format

When you finish a task:
```
Done: [what you did]
Tests: [X unit passed, Y e2e passed]
Coverage: [X%]
Assumptions: [any, or "none"]
Escalations: [any, or "none"]
```

<!-- Lessons Learned (append new entries here)
- 2026-02-25: Lambda packaging must preserve directory structure (admin/ + shared/) — flat copy breaks relative imports like `../shared/firebase-admin.mjs`
- 2026-02-25: Firestore composite indexes are required for queries combining where() + orderBy() on different fields — deploy via `firestore.indexes.json`
- 2026-02-25: CloudFront Functions must be created from file (`fileb://`) not inline string — test with `aws cloudfront test-function` before publishing
- 2026-02-25: Firebase Auth providers (Email/Password, Google) cannot be enabled via CLI — must be done in Firebase Console
- 2026-02-25: CloudFront + S3 needs a URL rewrite function to map `/path/` to `/path/index.html` for Next.js trailingSlash
- 2026-02-25: Static export with `dynamicParams = false` only generates pages for slugs in `generateStaticParams`. For SPA-style client-rendered pages, use CloudFront Function to rewrite dynamic slugs to the placeholder page (e.g., `/en/products/[slug]/` → `/en/products/placeholder/index.html`)
- 2026-02-25: Files in `public/generated/` are gitignored — copy assets needed in production to `public/` root (icon.png, hero-bg.png, favicon.png) so they're tracked in git and included in CI/CD builds
- 2026-02-25: When Lambda files exceed 300 lines, extract domain logic to separate `.mjs` files (e.g., `reviews.mjs`) and import into `index.mjs` — keeps handler clean and preserves directory structure for packaging
- 2026-02-25: Admin pages with dynamic `[id]` params need `dynamicParams = false` + `generateStaticParams` returning `{ locale, id: "placeholder" }` — the client component extracts the real ID from `window.location.pathname`
- 2026-02-25: Use AlertDialog (shadcn) instead of `window.confirm()` for delete confirmations — use `pendingDeleteId` state pattern: set ID on click, confirm in dialog, reset to null after
- 2026-02-25: Guest checkout orders may not have a `userId` — query orders by both `userId` AND `customerEmail` to ensure users see all their orders on the account page
- 2026-02-25: Info pages (shipping, faq, contact) use i18n-driven content — no hardcoded text, admin edits JSON files to update content
- 2026-02-25: After adding new Firestore collections (e.g., `reviews`), remember to deploy indexes AND rules: `firebase deploy --only firestore:indexes,firestore:rules`
- 2026-02-25: After adding review Lambda CRUD, repackage and redeploy the admin Lambda (zip with `admin/` + `shared/` directory structure)
-->
