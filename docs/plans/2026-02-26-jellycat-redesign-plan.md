# Jellycat-Style Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Progressively redesign Cosy Loops with Jellycat-style format — storytelling homepage, enhanced product pages, dedicated shop page, SEO structured data, and AI-generated banner images.

**Architecture:** Build new components incrementally on the existing Next.js 15 + React 19 + Tailwind v4 + shadcn/ui stack. Each phase adds components without breaking existing functionality. Homepage sections are dynamically imported for code splitting.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4, shadcn/ui (new-york), Firebase Firestore, next-intl, Gemini API (image generation), pnpm

---

## Phase 1: Foundation

### Task 1: Add i18n keys for all new sections

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/zh-hk.json`

**Step 1: Add new keys to en.json**

Add these new keys to `messages/en.json`:

```json
"announcement": {
  "shipping": "Free UK shipping on orders over £50",
  "newArrivals": "New handmade creations just arrived!",
  "dismiss": "Dismiss"
},
"homepage": {
  "heroHeadline": "Every Stitch Tells a Story",
  "heroSubtitle": "Handmade crochet creations, lovingly crafted in the UK",
  "heroCta": "Shop Now",
  "newArrivals": "Fresh From The Hook",
  "bestSellers": "Loved By You",
  "reviewsTitle": "What Our Customers Say",
  "instagramTitle": "Follow Our Journey",
  "instagramHandle": "@cosyloops",
  "instagramCta": "Follow on Instagram",
  "newsletterTitle": "Stay in the Loop",
  "newsletterSubtitle": "Get updates on new creations, behind-the-scenes peeks, and exclusive offers.",
  "subscribe": "Subscribe",
  "emailPlaceholder": "Your email address",
  "collectionPlushies": "Plushies & Toys",
  "collectionCharms": "Charms & Keyrings",
  "collectionHome": "Home & Bags",
  "viewCollection": "View Collection"
},
"shopPage": {
  "seoTitle": "Shop All | Cosy Loops",
  "seoDescription": "Browse our collection of handcrafted crochet plushies, keyrings, bag charms, and home accessories.",
  "title": "Handcrafted with Love",
  "subtitle": "Browse our collection of unique crochet creations",
  "filterAll": "All",
  "sortNewest": "Newest",
  "sortPriceLow": "Price: Low to High",
  "sortPriceHigh": "Price: High to Low",
  "sortPopular": "Popular",
  "itemCount": "{count, plural, one {1 item} other {# items}}",
  "loadMore": "Load More",
  "sortBy": "Sort by"
},
"productPage": {
  "ourStory": "Our Story",
  "reviews": "Reviews",
  "productDetails": "Product Details",
  "careInstructions": "Care Instructions",
  "careText": "Gentle hand wash in cool water. Lay flat to dry. Avoid machine washing.",
  "shippingReturns": "Shipping & Returns",
  "shippingText": "Free UK shipping over £50. Standard delivery 3-5 working days. 14-day returns.",
  "youMightAlsoLove": "You Might Also Love",
  "addToWishlist": "Add to Wishlist"
},
"badges": {
  "new": "New",
  "bestSeller": "Best Seller",
  "lowStock": "Low Stock"
}
```

**Step 2: Add corresponding keys to zh-hk.json**

Add matching Chinese translations to `messages/zh-hk.json` with the same structure.

**Step 3: Verify**

Run: `pnpm typecheck && pnpm build`

**Step 4: Commit**

```bash
git add messages/en.json messages/zh-hk.json
git commit -m "feat(i18n): add translation keys for redesign sections"
```

---

### Task 2: Update PWA manifest and meta tags

**Files:**
- Modify: `public/manifest.json`
- Modify: `app/layout.tsx`

**Step 1: Update manifest.json**

Change `name` field to `"Cosy Loops | Handcrafted Crochet Creations"` and ensure `short_name` is `"Cosy Loops"`.

**Step 2: Add PWA meta tags to app/layout.tsx**

Inside `<head>`, add:
```html
<meta name="application-name" content="Cosy Loops" />
<meta name="apple-mobile-web-app-title" content="Cosy Loops" />
```

**Step 3: Verify**

Run: `pnpm typecheck && pnpm build`

**Step 4: Commit**

```bash
git add public/manifest.json app/layout.tsx
git commit -m "feat(pwa): ensure Add to Home Screen shows only Cosy Loops"
```

---

### Task 3: Create Gemini image generation script

**Files:**
- Create: `scripts/generate-banners.ts`

**Step 1: Write the generation script**

Create `scripts/generate-banners.ts` that:
- Reads `GEMINI_API_KEY` from `process.env`
- Uses model `gemini-2.0-flash-exp` (or the model specified by user: `gemini-3-pro-image-preview`)
- Generates 6 images with carefully crafted prompts matching brand colours:
  - `hero-banner-desktop.png` (1920x800) — Soft pastel crochet scene, yarn balls on wooden surface, soft pink #F8C8DC and blush #FFE4E1 tones, warm natural lighting, dreamy bokeh, generous negative space on right side for text overlay
  - `hero-banner-mobile.png` (768x600) — Same style, centered composition
  - `collection-plushies.png` (800x1000) — Soft pink #F8C8DC background, scattered yarn balls and crochet hooks, warm cosy feeling
  - `collection-charms.png` (800x1000) — Lavender #E6D5F5 background, delicate flowers and ribbons, feminine craft aesthetic
  - `collection-home.png` (800x1000) — Mint #D4F0E7 background, cosy home scene with wooden elements
  - `shop-hero.png` (1920x500) — Pastel gradient background with yarn balls arranged in a line, soft blush to lavender transition
- Saves output to `public/banners/`
- Each prompt MUST include exact hex colour codes and style keywords: "soft pastel, warm cosy handmade aesthetic, soft natural lighting, dreamy bokeh background, clean composition, generous negative space, photorealistic, high quality"

**Step 2: Run the script**

```bash
pnpm tsx scripts/generate-banners.ts
```

**Step 3: Verify images exist and look correct**

```bash
ls -la public/banners/
```

**Step 4: Commit**

```bash
git add scripts/generate-banners.ts public/banners/
git commit -m "feat(images): add Gemini banner generation script and generated images"
```

---

### Task 4: Create AnnouncementBar component

**Files:**
- Create: `components/layout/AnnouncementBar.tsx`
- Modify: `app/[locale]/layout.tsx` (add AnnouncementBar above Navbar)

**Step 1: Create AnnouncementBar**

Create `components/layout/AnnouncementBar.tsx`:
- `"use client"` component
- Reads announcement messages from `useTranslations("announcement")`
- Rotates between messages with 4-second interval using `useState` + `useEffect`
- Soft-pink background (`bg-soft-pink`), cocoa text, 36px height, 14px font
- X button to dismiss, saves `announcement-dismissed` to `localStorage`
- Fade transition between messages using CSS `transition-opacity`
- If dismissed, returns `null`

**Step 2: Add to locale layout**

In `app/[locale]/layout.tsx`, import and render `<AnnouncementBar />` above `<Navbar />`.

**Step 3: Verify**

Run: `pnpm lint && pnpm typecheck && pnpm build`

**Step 4: Commit**

```bash
git add components/layout/AnnouncementBar.tsx app/[locale]/layout.tsx
git commit -m "feat(layout): add AnnouncementBar with rotating messages"
```

---

### Task 5: Create ProductBadge component

**Files:**
- Create: `components/shop/ProductBadge.tsx`

**Step 1: Create ProductBadge**

Create `components/shop/ProductBadge.tsx`:
- Props: `type: "new" | "bestSeller" | "lowStock"`
- Uses `useTranslations("badges")`
- Renders a pill badge with colour based on type:
  - `new` → `bg-lavender text-cocoa`
  - `bestSeller` → `bg-soft-pink text-cocoa`
  - `lowStock` → `bg-butter text-cocoa`
- Positioned `absolute left-2 top-2` (parent must be `relative`)
- Small rounded pill: `rounded-full px-2.5 py-0.5 text-xs font-medium`

**Step 2: Verify**

Run: `pnpm lint && pnpm typecheck && pnpm build`

**Step 3: Commit**

```bash
git add components/shop/ProductBadge.tsx
git commit -m "feat(shop): add ProductBadge component (New/Best Seller/Low Stock)"
```

---

### Task 6: Create ProductCarousel component

**Files:**
- Create: `components/shop/ProductCarousel.tsx`

**Step 1: Create ProductCarousel**

Create `components/shop/ProductCarousel.tsx`:
- `"use client"` component
- Props: `title: string`, `products: Product[]`, `showRatings?: boolean`
- Uses CSS scroll-snap for touch-friendly swiping (no external carousel library for bundle size)
- Container: `overflow-x-auto scroll-snap-x-mandatory scrollbar-hide` with `scroll-snap-align: start` on each card
- Shows 4 cards on desktop (`min-w-[calc(25%-12px)]`), 2 on mobile (`min-w-[calc(50%-8px)]`)
- Left/right arrow buttons (ChevronLeft/ChevronRight from lucide) that scroll by card width
- Arrows hidden on mobile (swipe instead)
- Section heading in Quicksand font (H2)
- Each card renders `<ProductCard>` with optional rating display
- `content-visibility: auto` on the section wrapper

**Step 2: Verify**

Run: `pnpm lint && pnpm typecheck && pnpm build`

**Step 3: Commit**

```bash
git add components/shop/ProductCarousel.tsx
git commit -m "feat(shop): add reusable ProductCarousel with scroll-snap"
```

---

### Task 7: Update ProductCard with badges and ratings

**Files:**
- Modify: `components/shop/ProductCard.tsx`

**Step 1: Add badge and rating props**

Add optional props to ProductCard:
- `badge?: "new" | "bestSeller" | "lowStock"` — renders `<ProductBadge>` on the image
- `showRating?: boolean` — if true, shows star rating below price
- `averageRating?: number` — rating value (1-5)
- `reviewCount?: number` — number of reviews

Render badge inside the image container div (which is already `relative`).
Render rating as amber stars + review count below price when `showRating` is true.

**Step 2: Verify**

Run: `pnpm lint && pnpm typecheck && pnpm build`

**Step 3: Commit**

```bash
git add components/shop/ProductCard.tsx components/shop/ProductBadge.tsx
git commit -m "feat(shop): add badges and ratings to ProductCard"
```

---

## Phase 2: Homepage Redesign

### Task 8: Rewrite HeroBanner with split layout

**Files:**
- Modify: `components/shop/HeroBanner.tsx`

**Step 1: Rewrite HeroBanner**

Rewrite `components/shop/HeroBanner.tsx`:
- Full-width, `min-h-[70vh]` height
- Split layout: left 60% is the AI-generated banner image, right 40% has text content
- Uses `<picture>` element with `srcset` for responsive images:
  - Desktop: `/banners/hero-banner-desktop.png`
  - Mobile (`max-width: 768px`): `/banners/hero-banner-mobile.png`
- Right side content: logo, headline from `useTranslations("homepage").heroHeadline`, subtitle, CTA button
- Mobile: image full-width with text overlay on semi-transparent `bg-white/80` backdrop
- Hero image uses `priority` loading (above the fold)
- CTA links to `/shop`
- Uses existing brand colours and Quicksand heading font

**Step 2: Verify**

Run: `pnpm lint && pnpm typecheck && pnpm build`

**Step 3: Commit**

```bash
git add components/shop/HeroBanner.tsx
git commit -m "feat(homepage): rewrite HeroBanner with split layout and responsive images"
```

---

### Task 9: Create CollectionCard component

**Files:**
- Create: `components/shop/CollectionCard.tsx`

**Step 1: Create CollectionCard**

Create `components/shop/CollectionCard.tsx`:
- Props: `title: string`, `href: string`, `imageSrc: string`, `imageAlt: string`
- 4:5 aspect ratio (`aspect-[4/5]`)
- Image fills card with `object-cover`
- Category name as underlined link below image
- Hover: subtle scale (`scale-[1.02]`) + shadow transition
- Rounded corners (`rounded-2xl`), overflow hidden

**Step 2: Verify**

Run: `pnpm lint && pnpm typecheck && pnpm build`

**Step 3: Commit**

```bash
git add components/shop/CollectionCard.tsx
git commit -m "feat(shop): add CollectionCard component for category features"
```

---

### Task 10: Create ReviewCarousel component

**Files:**
- Create: `components/shop/ReviewCarousel.tsx`

**Step 1: Create ReviewCarousel**

Create `components/shop/ReviewCarousel.tsx`:
- `"use client"` component
- Fetches approved reviews from Firestore using a new `getRecentReviews()` function (add to `lib/reviews.ts`)
- 3-column grid on desktop, horizontal scroll on mobile
- Each review card: blush/20 background, rounded-2xl, star rating, quote excerpt (max 120 chars with ellipsis), author name
- Section heading: "What Our Customers Say" (H2, Quicksand)
- Blush background for entire section (`bg-blush/30`)
- If no reviews, don't render the section

**Step 2: Add getRecentReviews to lib/reviews.ts**

Add function to `lib/reviews.ts`:
```typescript
export async function getRecentReviews(limitCount = 6): Promise<Review[]> {
  const db = await getFirebaseDb();
  const { collection, getDocs, query, where, orderBy, limit } = await import("firebase/firestore");
  const q = query(
    collection(db, "reviews"),
    where("isApproved", "==", true),
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.() ?? new Date(),
  })) as Review[];
}
```

**Step 3: Verify**

Run: `pnpm lint && pnpm typecheck && pnpm build`

**Step 4: Commit**

```bash
git add components/shop/ReviewCarousel.tsx lib/reviews.ts
git commit -m "feat(shop): add ReviewCarousel with Firestore integration"
```

---

### Task 11: Create InstagramFeed and NewsletterSignup

**Files:**
- Create: `components/shop/InstagramFeed.tsx`
- Create: `components/shop/NewsletterSignup.tsx`

**Step 1: Create InstagramFeed**

Create `components/shop/InstagramFeed.tsx`:
- `"use client"` component
- Section heading: "Follow Our Journey @cosyloops" (H2)
- 6 placeholder squares in a row (desktop), 3 visible + scroll (mobile)
- Placeholder squares use pastel gradient backgrounds until real Instagram photos are added
- "Follow on Instagram" CTA button (outlined, links to Instagram URL)
- Each square: `aspect-square rounded-xl overflow-hidden`

**Step 2: Create NewsletterSignup**

Create `components/shop/NewsletterSignup.tsx`:
- `"use client"` component
- Split layout: text left, form right
- Blush background (`bg-blush/30`), rounded-2xl with padding
- Heading: "Stay in the Loop" (H2, Quicksand)
- Subtitle text from i18n
- Email input + Subscribe button (soft-pink)
- Form submits to `mailto:hello@cosyloops.com` as a simple start (no backend needed)
- ASSUMPTION: No email service integration yet. Change to API endpoint when ready.

**Step 3: Verify**

Run: `pnpm lint && pnpm typecheck && pnpm build`

**Step 4: Commit**

```bash
git add components/shop/InstagramFeed.tsx components/shop/NewsletterSignup.tsx
git commit -m "feat(shop): add InstagramFeed and NewsletterSignup sections"
```

---

### Task 12: Wire up new Homepage layout

**Files:**
- Modify: `app/[locale]/page.tsx`
- Modify (or keep): `components/shop/ShopSection.tsx`

**Step 1: Rewrite homepage page.tsx**

Rewrite `app/[locale]/page.tsx` to render sections in order:
1. `<HeroBanner />` (existing, rewritten in Task 8)
2. `dynamic(() => import("@/components/shop/NewArrivalsSection"))` — wraps `<ProductCarousel>` with products sorted by `createdAt` desc
3. Collection Feature Cards — 3 `<CollectionCard>` components in a responsive grid
4. `dynamic(() => import("@/components/shop/BestSellersSection"))` — wraps `<ProductCarousel>` with most-reviewed/popular products
5. `dynamic(() => import("@/components/shop/ReviewCarousel"))`
6. `dynamic(() => import("@/components/shop/InstagramFeed"))`
7. `<NewsletterSignup />`

Each dynamic section wrapped in `<Suspense>` with skeleton fallback.
Uniform `py-[60px]` spacing between sections using a wrapper div or section className.

**Step 2: Create NewArrivalsSection and BestSellersSection**

Create thin wrapper components:
- `components/shop/NewArrivalsSection.tsx` — fetches latest products, renders `<ProductCarousel title={t("newArrivals")} products={products} />`
- `components/shop/BestSellersSection.tsx` — fetches all products (sorted by review count or createdAt as fallback), renders `<ProductCarousel title={t("bestSellers")} products={products} showRatings />`

**Step 3: Verify**

Run: `pnpm lint && pnpm typecheck && pnpm build`

**Step 4: Commit**

```bash
git add app/[locale]/page.tsx components/shop/NewArrivalsSection.tsx components/shop/BestSellersSection.tsx
git commit -m "feat(homepage): wire up Jellycat-style section layout"
```

---

## Phase 3: Shop Page

### Task 13: Create Shop page route and components

**Files:**
- Create: `app/[locale]/shop/page.tsx`
- Create: `components/shop/ShopContent.tsx`

**Step 1: Create shop page**

Create `app/[locale]/shop/page.tsx`:
- Export `generateStaticParams` returning all locales
- Export metadata with `shopPage.seoTitle` and `shopPage.seoDescription`
- Render `<ShopContent />`

**Step 2: Create ShopContent component**

Create `components/shop/ShopContent.tsx`:
- `"use client"` component
- Shop Hero: 30vh section with `/banners/shop-hero.png` background, overlay text
- Filter Bar: pill-style buttons for categories (fetched from Firestore), horizontal scroll on mobile
  - Active filter: `bg-soft-pink text-cocoa`, inactive: `bg-white border border-blush text-warm-gray`
  - Sort dropdown using shadcn Select: Newest / Price Low-High / Price High-Low
  - Item count display
- Product Grid: reuse `<ProductGrid>` with `<ProductCard>` including badges
- Read `category` and `sort` from URL search params (`useSearchParams`)
- Update URL on filter/sort change (`router.push` with query params)
- Breadcrumbs at top: Home > Shop

**Step 3: Update Navbar**

In `components/layout/Navbar.tsx`, ensure the "Shop" nav link points to `/shop` instead of `/#collection`.

**Step 4: Verify**

Run: `pnpm lint && pnpm typecheck && pnpm build`

**Step 5: Commit**

```bash
git add app/[locale]/shop/ components/shop/ShopContent.tsx components/layout/Navbar.tsx
git commit -m "feat(shop): add dedicated Shop page with filters and sort"
```

---

## Phase 4: Product Page Enhancement

### Task 14: Create ProductTabs component

**Files:**
- Create: `components/shop/ProductTabs.tsx`

**Step 1: Create ProductTabs**

Create `components/shop/ProductTabs.tsx`:
- Uses shadcn `<Tabs>` component (already installed)
- Props: `description: string`, `productId: string`
- Tab 1 "Our Story": decorative large quotes (❝ ❞) wrapping the product description in Quicksand font, centered text
- Tab 2 "Reviews (N)": embeds `<ReviewSection>` component, tab label shows review count
- Fetches review count on mount to display in tab label
- Cocoa text, blush/20 background on active tab content area

**Step 2: Verify**

Run: `pnpm lint && pnpm typecheck && pnpm build`

**Step 3: Commit**

```bash
git add components/shop/ProductTabs.tsx
git commit -m "feat(product): add ProductTabs with Our Story and Reviews"
```

---

### Task 15: Create ProductAccordion component

**Files:**
- Create: `components/shop/ProductAccordion.tsx`

**Step 1: Install shadcn Accordion if not present**

Run: `pnpm dlx shadcn@latest add accordion`

**Step 2: Create ProductAccordion**

Create `components/shop/ProductAccordion.tsx`:
- Uses shadcn `<Accordion>` component
- Props: `description: string` (for product details)
- Three sections:
  1. "Product Details" — shows full product description
  2. "Care Instructions" — i18n text about hand washing
  3. "Shipping & Returns" — i18n text about shipping policy
- Each section has a ChevronDown icon that rotates on open
- Clean spacing, cocoa text, warm-gray secondary text

**Step 3: Verify**

Run: `pnpm lint && pnpm typecheck && pnpm build`

**Step 4: Commit**

```bash
git add components/shop/ProductAccordion.tsx components/ui/accordion.tsx
git commit -m "feat(product): add ProductAccordion for details/care/shipping"
```

---

### Task 16: Create Breadcrumbs component

**Files:**
- Create: `components/layout/Breadcrumbs.tsx`

**Step 1: Create Breadcrumbs**

Create `components/layout/Breadcrumbs.tsx`:
- Props: `items: { label: string; href?: string }[]`
- Renders breadcrumb trail with `>` separator
- Last item is plain text (current page), others are links
- Small text (14px), warm-gray colour, links have hover underline
- Generates `BreadcrumbList` JSON-LD script tag inline using `generateBreadcrumbJsonLd()` from `lib/structured-data.ts`

**Step 2: Verify**

Run: `pnpm lint && pnpm typecheck && pnpm build`

**Step 3: Commit**

```bash
git add components/layout/Breadcrumbs.tsx
git commit -m "feat(layout): add Breadcrumbs with JSON-LD structured data"
```

---

### Task 17: Enhance ProductDetail with tabs, accordion, breadcrumbs

**Files:**
- Modify: `components/shop/ProductDetail.tsx`

**Step 1: Update ProductDetail layout**

Modify `components/shop/ProductDetail.tsx`:
- Replace the back arrow link with `<Breadcrumbs items={[{label: "Home", href: "/"}, {label: "Shop", href: "/shop"}, {label: product.categorySlug, href: `/shop?category=${product.categorySlug}`}, {label: product.name}]} />`
- Change grid from `md:grid-cols-2` to `lg:grid-cols-[3fr_2fr]` (60/40 split)
- Below the two-column section, add `<ProductTabs description={product.description} productId={product.id} />`
- Below tabs, add `<ProductAccordion description={product.description} />`
- Change `<RelatedProducts>` heading to use i18n key `productPage.youMightAlsoLove`
- Add Product JSON-LD `<script>` tag using `generateProductJsonLd()`
- Mobile: swipeable ImageGallery with dot indicators (modify ImageGallery to use scroll-snap on mobile)

**Step 2: Verify**

Run: `pnpm lint && pnpm typecheck && pnpm build`

**Step 3: Commit**

```bash
git add components/shop/ProductDetail.tsx
git commit -m "feat(product): enhance product page with tabs, accordion, breadcrumbs"
```

---

## Phase 5: SEO & Performance

### Task 18: Complete structured data for all pages

**Files:**
- Modify: `lib/structured-data.ts`
- Modify: `app/[locale]/layout.tsx`
- Modify: `app/[locale]/page.tsx`

**Step 1: Add new schema generators to structured-data.ts**

Add to `lib/structured-data.ts`:
- `generateItemListJsonLd(products: Product[], locale: string)` — for homepage and shop
- `generateFaqPageJsonLd(faqs: {question: string; answer: string}[])` — for FAQ page
- Update `generateProductJsonLd()` to include `aggregateRating` when rating data is available
- Update `generateOrganizationJsonLd()` to include `sameAs` with Instagram URL

**Step 2: Inject schemas into pages**

- Homepage `page.tsx`: add ItemList schema for featured products
- FAQ page: add FAQPage schema
- Shop page: add CollectionPage + ItemList schemas

**Step 3: Verify**

Run: `pnpm lint && pnpm typecheck && pnpm build`

**Step 4: Commit**

```bash
git add lib/structured-data.ts app/[locale]/layout.tsx app/[locale]/page.tsx
git commit -m "feat(seo): add comprehensive JSON-LD structured data"
```

---

### Task 19: Performance optimisation pass

**Files:**
- Modify: `app/[locale]/page.tsx` (ensure all sections use dynamic imports)
- Modify: `components/shop/HeroBanner.tsx` (add `<picture>` srcset)
- Modify: `app/layout.tsx` (add font preload hints)

**Step 1: Verify all homepage sections are code-split**

Ensure every section below HeroBanner uses `dynamic()` + `<Suspense>`.

**Step 2: Add responsive image srcset to HeroBanner**

Use `<picture>` with `<source>` elements:
```html
<picture>
  <source media="(max-width: 768px)" srcSet="/banners/hero-banner-mobile.png" />
  <img src="/banners/hero-banner-desktop.png" alt="" ... />
</picture>
```

**Step 3: Add preconnect hints**

Already have Firebase/Stripe preconnects. Add R2 CDN preconnect:
```html
<link rel="preconnect" href="https://pub-ae88baaaf33e44938f1264f28d62ec7c.r2.dev" />
```

**Step 4: Verify**

Run: `pnpm lint && pnpm typecheck && pnpm build`

**Step 5: Commit**

```bash
git add app/[locale]/page.tsx components/shop/HeroBanner.tsx app/layout.tsx
git commit -m "perf: code splitting, responsive images, preconnect hints"
```

---

### Task 20: Final verification and cleanup

**Step 1: Run full verification pipeline**

```bash
pnpm lint
pnpm typecheck
pnpm build
```

**Step 2: Check all new files are under 300 lines**

Verify no new file exceeds 300 lines. Split if needed.

**Step 3: Verify all new pages generate static params**

Ensure `app/[locale]/shop/page.tsx` exports `generateStaticParams`.

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup and verification for Jellycat-style redesign"
```

---

## File Reference

### New Files (13)
| File | Purpose |
|------|---------|
| `scripts/generate-banners.ts` | Gemini API image generation |
| `components/layout/AnnouncementBar.tsx` | Top notification bar |
| `components/layout/Breadcrumbs.tsx` | Breadcrumb navigation + JSON-LD |
| `components/shop/ProductBadge.tsx` | New/Best Seller/Low Stock pills |
| `components/shop/ProductCarousel.tsx` | Reusable product carousel |
| `components/shop/CollectionCard.tsx` | Category feature card (4:5) |
| `components/shop/ReviewCarousel.tsx` | Customer testimonials section |
| `components/shop/InstagramFeed.tsx` | Instagram grid section |
| `components/shop/NewsletterSignup.tsx` | Email subscription form |
| `components/shop/NewArrivalsSection.tsx` | Homepage new arrivals wrapper |
| `components/shop/BestSellersSection.tsx` | Homepage best sellers wrapper |
| `components/shop/ProductTabs.tsx` | Our Story / Reviews tabs |
| `components/shop/ProductAccordion.tsx` | Details/Care/Shipping accordion |
| `components/shop/ShopContent.tsx` | Shop page with filters |
| `app/[locale]/shop/page.tsx` | Shop page route |

### Modified Files (9)
| File | Changes |
|------|---------|
| `messages/en.json` | New i18n keys |
| `messages/zh-hk.json` | New i18n keys |
| `public/manifest.json` | PWA short_name |
| `app/layout.tsx` | PWA meta tags, preconnect |
| `app/[locale]/layout.tsx` | Add AnnouncementBar |
| `app/[locale]/page.tsx` | New homepage section layout |
| `components/shop/HeroBanner.tsx` | Split layout rewrite |
| `components/shop/ProductCard.tsx` | Add badges + ratings |
| `components/shop/ProductDetail.tsx` | Tabs + accordion + breadcrumbs |
| `lib/structured-data.ts` | New schema generators |
| `lib/reviews.ts` | Add getRecentReviews() |
