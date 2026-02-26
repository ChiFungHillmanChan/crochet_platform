# Jellycat-Style Redesign Design Document

**Date:** 2026-02-26
**Approach:** Progressive Enhancement (Option A)
**Brand Story:** Handmade process & warmth — "Every stitch tells a story"

---

## 1. Design Decisions Summary

| Decision | Choice |
|----------|--------|
| Brand narrative | Handcraft process & warmth |
| Homepage sections | Hero, New Arrivals, Best Sellers, Reviews, Instagram, Newsletter |
| Product page | Two-column + story tabs + accordion, mobile-friendly with innovation |
| Navigation | Collections on Homepage + dedicated Shop page with filters |
| AI images | Hero banners + Collection card backgrounds only. Products = real photos |
| SEO priority | Google ranking (structured data) + page speed (Core Web Vitals) |
| Navigation | Simple Nav + Announcement Bar, keep existing soft pink palette |
| PWA | Add to Home Screen shows "Cosy Loops" only |

## 2. Colour Palette (Existing — Preserved)

```
Primary:    Soft Pink   #F8C8DC
Secondary:  Blush       #FFE4E1
Accent 1:   Lavender    #E6D5F5
Accent 2:   Mint        #D4F0E7
Accent 3:   Butter      #FFF3CD
Foreground: Cocoa       #5D4037
Muted:      Warm Gray   #8D7B6A
```

## 3. Homepage Layout (Top to Bottom)

### 3.1 Announcement Bar (NEW)
- Soft-pink background with cocoa text
- Rotating messages: "Free UK shipping over £50", "New arrivals", etc.
- Dismissible with X button, saves preference to localStorage
- Height: 36px, font-size: 14px

### 3.2 Navbar (EXISTING — no changes)
- Sticky on scroll
- Simple navigation links

### 3.3 Hero Banner (REWRITE)
- Full-width, 70vh height
- Split layout: AI-generated image (left 60%) + text (right 40%)
- Text: brand headline + tagline + CTA button
- Mobile: image full-width, text overlay with semi-transparent bg
- AI image: soft pastel crochet scene matching brand colours
- Desktop image: 1920x800, Mobile image: 768x600

### 3.4 New Arrivals Carousel (NEW)
- Section heading: "Fresh From The Hook" (Quicksand font)
- 4 products visible (desktop), 2 (mobile), touch swipeable
- Standard ProductCard format with badges
- Left/right arrow navigation
- 60px gap above and below

### 3.5 Collection Feature Cards (NEW)
- 3-column grid (desktop), horizontal scroll (mobile)
- 4:5 aspect ratio images with AI-generated pastel backgrounds
- Cards link to Shop page with pre-set category filter
- Card 1: Plushies & Toys → Soft Pink bg
- Card 2: Charms & Keyrings → Lavender bg
- Card 3: Home & Bags → Mint bg
- Category name as underlined link below each card

### 3.6 Best Sellers Carousel (NEW)
- Section heading: "Loved By You"
- Same carousel component as New Arrivals
- Cards include star ratings + review count
- 60px gap above and below

### 3.7 Customer Reviews Section (NEW)
- Section heading: "What Our Customers Say"
- 3-column grid (desktop), carousel (mobile)
- Review card: star rating, quote excerpt, customer name
- Blush background for the section
- Pulls from Firestore approved reviews

### 3.8 Instagram Feed (NEW)
- Section heading: "Follow Our Journey @cosyloops"
- 6 square images in a row (desktop), 3 visible + scroll (mobile)
- "Follow on Instagram" CTA button
- Images loaded from Instagram embed or static placeholders

### 3.9 Newsletter Signup (NEW)
- Split layout: text (left) + form (right)
- Heading: "Stay in the Loop"
- Blush background
- Email input + Subscribe button (soft-pink)

### 3.10 Footer (EXISTING — no changes)

### Section Spacing
- Uniform 60px gap between all major sections
- Internal section padding: 40px vertical

## 4. Product Page

### 4.1 Layout
- Two-column: Image Gallery (60%) | Product Info (40%)
- Mobile: Full-width swipeable image carousel + info below

### 4.2 Image Gallery (LEFT)
- Main image: 1:1 aspect ratio
- Thumbnail strip below main image
- Thumbnails clickable to swap main image
- Mobile: swipeable carousel with dot indicators

### 4.3 Product Info (RIGHT)
- Category Badge (pill style)
- Product Name (H1, Quicksand)
- Star rating + review count link
- Price (£XX.00)
- Separator line
- Quantity selector
- Add to Cart button (soft-pink, full-width)
- Wishlist heart button (outlined, fill animation on click)

### 4.4 Mobile Innovation
- Images become full-width swipeable carousel
- Product info slides up with "peek" animation
- Name + price visible immediately, rest scrollable

### 4.5 Tabs Section
- Tab 1: "Our Story" — narrative description with decorative quotes
- Tab 2: "Reviews (N)" — customer reviews list with ratings

### 4.6 Accordion Section
- Product Details (expandable)
- Care Instructions (expandable)
- Shipping & Returns (expandable)

### 4.7 Related Products
- Heading: "You Might Also Love"
- Same carousel component as homepage
- Same-category products

## 5. Shop Page (NEW — /shop)

### 5.1 Shop Hero
- 30vh height with AI-generated background
- Heading: "Handcrafted with Love"
- Subtext: "Browse our collection of unique crochet creations"

### 5.2 Filter Bar
- Pill-style category buttons (horizontal scroll on mobile)
- Active state: soft-pink fill
- Sort dropdown: Newest / Price Low-High / Price High-Low / Popular
- Item count display
- URL query params for sharing/SEO

### 5.3 Product Grid
- 4-column (desktop), 2-column (mobile)
- Standard ProductCard with badges
- Hover: scale-105 + translate-y-1 + shadow-lg
- Mobile: persistent add-to-cart button

### 5.4 Product Badges
- "New" — lavender pill
- "Best Seller" — soft-pink pill
- "Low Stock" — butter pill

## 6. SEO Strategy

### 6.1 Structured Data (JSON-LD)

**Homepage:**
- WebSite schema (name, url, searchAction)
- Organization schema (name, logo, sameAs)
- ItemList schema (featured products)

**Shop Page:**
- BreadcrumbList (Home > Shop)
- CollectionPage schema
- ItemList schema (products)

**Product Page:**
- BreadcrumbList (Home > Shop > Category > Product)
- Product schema (name, description, image, offers, aggregateRating)
- Review schema (individual reviews)

**FAQ Page:**
- FAQPage schema (existing questions)

### 6.2 Meta Tags Template
```
Homepage:
  title: "Cosy Loops | Handcrafted Crochet Creations"
  description: "Discover unique handmade crochet plushies, bag charms,
    and accessories. Every stitch tells a story. Crafted with love in the UK."

Shop:
  title: "Shop All | Cosy Loops"
  description: "Browse our collection of handcrafted crochet plushies,
    keyrings, bag charms, and home accessories."

Product:
  title: "{productName} | Cosy Loops"
  description: "{productDescription} Handmade crochet {category}.
    £{price}. Free UK shipping over £50."
```

### 6.3 PWA / Add to Home Screen
- `manifest.json` → `short_name: "Cosy Loops"`, `name: "Cosy Loops | Handcrafted Crochet Creations"`
- `<meta name="application-name" content="Cosy Loops">`
- `<meta name="apple-mobile-web-app-title" content="Cosy Loops">`

### 6.4 Heading Hierarchy
- H1: one per page (product name, page title)
- H2: section headings ("Fresh From The Hook", "Loved By You", etc.)
- H3: product names in grids

## 7. Performance Optimisation

| Technique | Implementation |
|-----------|---------------|
| Responsive images | `<picture>` with srcset for Hero/Collection images |
| Lazy loading | All below-fold images use `loading="lazy"` |
| Priority loading | Hero image + first 4 product cards use `priority` |
| Code splitting | Each homepage section `dynamic()` imported with Suspense |
| Virtual carousel | Only render visible slides + 1 on each side |
| Font optimisation | `font-display: swap` + preload Quicksand 700 |
| CSS containment | `content-visibility: auto` on sections (already in place) |
| Link prefetch | Product cards prefetch product page on hover |
| Image formats | WebP primary, AVIF where supported via `<picture>` |

## 8. AI Image Generation (Gemini API)

### 8.1 Images to Generate

| Image | Dimensions | Purpose |
|-------|-----------|---------|
| hero-banner-desktop.webp | 1920x800 | Homepage hero (desktop) |
| hero-banner-mobile.webp | 768x600 | Homepage hero (mobile) |
| collection-plushies.webp | 800x1000 | Collection card — Plushies |
| collection-charms.webp | 800x1000 | Collection card — Charms |
| collection-home.webp | 800x1000 | Collection card — Home & Bags |
| shop-hero.webp | 1920x500 | Shop page hero banner |

### 8.2 Style Requirements (CRITICAL)

All AI-generated images MUST match the brand palette exactly:
```
- Primary colours: Soft Pink #F8C8DC, Blush #FFE4E1
- Accent colours: Lavender #E6D5F5, Mint #D4F0E7, Butter #FFF3CD
- Warm, cosy, handmade aesthetic
- Soft natural lighting, dreamy bokeh backgrounds
- Props: yarn balls, crochet hooks, cotton threads, wooden surfaces
- Clean composition with generous negative space
- NO actual product photos — only atmospheric/scene imagery
- Pastel colour harmony, no saturated or neon colours
- High quality, photorealistic rendering
```

### 8.3 Generation Script
- File: `scripts/generate-banners.ts`
- Model: `gemini-2.0-flash-exp` (image generation capable)
- Reads `GEMINI_API_KEY` from environment
- Outputs to `public/banners/`
- Generates WebP format
- Includes quality validation prompts for colour accuracy

## 9. New Components List

| Component | Location | Purpose |
|-----------|----------|---------|
| AnnouncementBar | `components/layout/` | Top notification bar |
| HeroBanner | `components/shop/` | Rewrite of existing hero |
| ProductCarousel | `components/shop/` | Reusable product carousel |
| CollectionCard | `components/shop/` | 4:5 category feature card |
| ReviewCarousel | `components/shop/` | Customer testimonials |
| InstagramFeed | `components/shop/` | Instagram grid section |
| NewsletterSignup | `components/shop/` | Email subscription form |
| ProductBadge | `components/shop/` | New/Best Seller/Low Stock |
| ProductTabs | `components/shop/` | Our Story / Reviews tabs |
| ProductAccordion | `components/shop/` | Details/Care/Shipping |

## 10. Modified Files

| File | Changes |
|------|---------|
| `app/[locale]/page.tsx` | New homepage section layout |
| `app/[locale]/shop/page.tsx` | NEW — Shop page with filters |
| `components/shop/ProductDetail.tsx` | Add tabs + accordion + badges |
| `components/shop/ProductCard.tsx` | Add badges + rating display |
| `app/layout.tsx` | Add PWA meta tags |
| `public/manifest.json` | Update short_name |
| `lib/structured-data.ts` | Add Product/Breadcrumb/FAQ schemas |
| `messages/en.json` | New i18n keys for all sections |
| `messages/zh-hk.json` | New i18n keys for all sections |
| `scripts/generate-banners.ts` | NEW — Gemini image generation |

## 11. i18n New Namespaces/Keys

```
announcement: { messages: [...], dismiss }
homepage: { newArrivals, bestSellers, reviewsTitle, instagramTitle,
            newsletterTitle, newsletterSubtitle, subscribe,
            collectionPlushies, collectionCharms, collectionHome }
shopPage: { title, subtitle, filterAll, sortNewest, sortPriceLow,
            sortPriceHigh, sortPopular, itemCount, loadMore }
productPage: { ourStory, reviews, productDetails, careInstructions,
               shippingReturns, youMightAlsoLove, addToWishlist }
badges: { new, bestSeller, lowStock }
```

## 12. Implementation Phases

### Phase 1: Foundation
- AnnouncementBar component
- ProductCarousel component (reusable)
- ProductBadge component
- PWA manifest + meta tags update
- Gemini image generation script + generate images

### Phase 2: Homepage Redesign
- Rewrite HeroBanner with split layout
- Add New Arrivals section
- Add Collection Feature Cards
- Add Best Sellers section
- Add Customer Reviews section
- Add Instagram Feed section
- Add Newsletter Signup section
- Wire up all sections in homepage

### Phase 3: Shop Page
- Create /shop route
- Shop Hero banner
- Filter bar with pill buttons
- Product grid with badges + ratings
- Sort functionality
- URL query params

### Phase 4: Product Page Enhancement
- ProductTabs (Our Story / Reviews)
- ProductAccordion (Details / Care / Shipping)
- Breadcrumbs component
- Related products as "You Might Also Love"
- Mobile swipe carousel + peek animation

### Phase 5: SEO & Performance
- All JSON-LD structured data
- Meta tags per page
- Responsive images with srcset
- Code splitting for homepage sections
- Lighthouse audit + fixes
