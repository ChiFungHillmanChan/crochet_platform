"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import {
  getProductsPaginated,
  getProducts,
  getCategories,
} from "@/lib/products";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { generateCollectionPageJsonLd, safeJsonLd } from "@/lib/structured-data";
import type { DocumentSnapshot } from "firebase/firestore";
import type { Product, Category } from "@/lib/types";

const PAGE_SIZE = 20;
type SortOption = "newest" | "priceLow" | "priceHigh";

function getLocaleFromUrl(): string {
  if (typeof window === "undefined") return "en";
  const match = window.location.pathname.match(/^\/(en|zh-hk)\//);
  return match?.[1] ?? "en";
}

export default function ShopContent() {
  const tc = useTranslations("common");
  const t = useTranslations("shopPage");
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeCategory = searchParams.get("category") ?? "";
  const activeSort = (searchParams.get("sort") ?? "newest") as SortOption;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const cursorRef = useRef<DocumentSnapshot | null>(null);

  const locale = getLocaleFromUrl();
  const collectionJsonLd = safeJsonLd(generateCollectionPageJsonLd(locale));

  const loadInitial = useCallback(async () => {
    setLoading(true);
    setProducts([]);
    cursorRef.current = null;
    setHasMore(false);

    try {
      const [cats] = await Promise.all([getCategories()]);
      setCategories(cats);

      if (activeSort === "newest") {
        const result = await getProductsPaginated(
          PAGE_SIZE,
          null,
          activeCategory || undefined
        );
        setProducts(result.products);
        cursorRef.current = result.lastDoc;
        setHasMore(result.hasMore);
      } else {
        const allProducts = await getProducts();
        setProducts(allProducts);
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, activeSort]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const result = await getProductsPaginated(
        PAGE_SIZE,
        cursorRef.current,
        activeCategory || undefined
      );
      setProducts((prev) => [...prev, ...result.products]);
      cursorRef.current = result.lastDoc;
      setHasMore(result.hasMore);
    } catch (err) {
      console.error("Failed to load more products:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, activeCategory]);

  const displayProducts = useMemo(() => {
    let result = activeCategory
      ? products.filter((p) => p.categorySlug === activeCategory)
      : products;

    switch (activeSort) {
      case "priceLow":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        break;
    }

    return result;
  }, [products, activeCategory, activeSort]);

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/shop/?${params.toString()}`);
  }

  return (
    <>
      {/* Safe: content sanitized via safeJsonLd which escapes < to \u003c */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: collectionJsonLd }}
      />
      <main className="flex-1">
        {/* Shop Hero */}
        <section className="relative flex h-[30vh] items-center justify-center overflow-hidden">
          <Image
            src="/banners/shop-hero.png"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-white/60" />
          <div className="relative text-center">
            <h1 className="font-heading text-3xl font-bold text-cocoa sm:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-2 text-cocoa/70">{t("subtitle")}</p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-sm text-warm-gray">
            <Link href="/" className="hover:underline">
              {tc("home")}
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-cocoa">Shop</span>
          </nav>

          <ShopFilters
            categories={categories}
            selectedCategory={activeCategory}
            sortBy={activeSort}
            itemCount={displayProducts.length}
            onCategoryChange={(cat) => updateParams("category", cat)}
            onSortChange={(sort) => updateParams("sort", sort)}
          />

          <ProductGrid
            products={displayProducts}
            loading={loading}
            hasMore={hasMore}
            loadingMore={loadingMore}
            onLoadMore={handleLoadMore}
          />
        </div>
      </main>
    </>
  );
}
