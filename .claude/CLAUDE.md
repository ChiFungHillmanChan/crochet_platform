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
| i18n | `next-intl` with `messages/en.json` and `messages/zh-hk.json` |
| Deployment | Static export (`output: "export"`) → S3 + CloudFront |
| CI | `.github/workflows/ci.yml` (lint + typecheck + build on PRs) |
| CD | `.github/workflows/deploy.yml` (build + S3 sync + CloudFront invalidation on push to main) |

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
- `/products/[slug]` — Product detail page
- `/cart` — Shopping cart (Zustand persisted store)
- `/checkout` — Stripe checkout flow
- `/checkout/success` — Post-payment confirmation
- `/account` — User account/orders
- `/account/login` — Auth (email/password + Google)
- `/admin/**` — Admin dashboard (products CRUD, orders, stats)

### Component Organization

- `components/ui/` — shadcn/ui primitives (Button, Card, Dialog, etc.)
- `components/shop/` — Storefront components (ProductCard, CartContent, CheckoutContent, etc.)
- `components/admin/` — Admin dashboard (ProductForm, OrderTable, ImageUploader, etc.)
- `components/auth/` — Login/register forms, Google sign-in
- `components/layout/` — Navbar, Footer, AdminShell, AdminGuard, LocaleSwitcher
- `components/account/` — Account page content

### State & Data Flow

- **Auth**: `lib/auth-context.tsx` provides `AuthProvider` + `useAuth()` hook. Firebase Auth (email/password + Google). User profiles stored in Firestore `users` collection.
- **Cart**: `stores/cartStore.ts` — Zustand store with `persist` middleware (localStorage key: `cosy-loops-cart`). Prices in pence GBP.
- **Products/Categories**: `lib/products.ts` — Client-side Firestore queries. Products filtered by `isActive`.
- **API calls**: `lib/api.ts` — Single `apiPost()` function that POSTs to `NEXT_PUBLIC_API_URL` with Firebase ID token. All backend actions go through this one endpoint with an `action` field.
- **Image uploads**: `lib/r2.ts` — Gets presigned URL from backend, uploads directly to Cloudflare R2.
- **Stripe**: `lib/stripe.ts` — Lazy-loaded client-side Stripe.js.

### Backend (Lambda)

The `lambda/` directory contains AWS Lambda functions (plain `.mjs`, not part of the Next.js build — excluded in `tsconfig.json`):

- `lambda/admin/index.mjs` — Admin API (product CRUD, order management, R2 upload URLs)
- `lambda/webhook/index.mjs` — Stripe webhook handler (order creation on payment)
- `lambda/webhook/emails.mjs` — Transactional email templates
- `lambda/shared/` — Shared utilities (Firebase Admin SDK init, HTTP response helpers)

### Firebase / Firestore

Collections: `users`, `products`, `categories`, `orders`, `stripeEvents`
- Security rules in `firestore.rules` — products/categories are read-only from client; orders readable only by owner; writes only through Lambda backend.

### Environment Variables

Frontend (must be `NEXT_PUBLIC_`):
- `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_API_URL` — Lambda API Gateway endpoint

Backend (in Lambda environment):
- `S3_BUCKET`, `CF_DISTRIBUTION_ID`, AWS credentials

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
- YYYY-MM-DD: [correction description]
-->
