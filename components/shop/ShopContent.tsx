"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { getProducts, getCategories } from "@/lib/products";
import { ProductCard } from "@/components/shop/ProductCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product, Category } from "@/lib/types";

const PAGE_SIZE = 20;
type SortOption = "newest" | "priceLow" | "priceHigh";

export default function ShopContent() {
  const t = useTranslations("shopPage");
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeCategory = searchParams.get("category") ?? "";
  const activeSort = (searchParams.get("sort") ?? "newest") as SortOption;
  const currentPage = Math.max(1, Number(searchParams.get("page") ?? "1"));

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts(), getCategories()])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
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

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset to page 1 when changing filter/sort
    if (key !== "page") {
      params.delete("page");
    }
    router.push(`/shop/?${params.toString()}`);
  }

  return (
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
            Home
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-cocoa">Shop</span>
        </nav>

        {/* Filter Bar */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <div className="scrollbar-hide flex gap-2 overflow-x-auto">
            <button
              onClick={() => updateParams("category", "")}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                !activeCategory
                  ? "bg-soft-pink text-cocoa"
                  : "border border-blush bg-white text-warm-gray hover:bg-blush/20"
              }`}
            >
              {t("filterAll")}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateParams("category", cat.slug)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === cat.slug
                    ? "bg-soft-pink text-cocoa"
                    : "border border-blush bg-white text-warm-gray hover:bg-blush/20"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-warm-gray">
              {t("itemCount", { count: filtered.length })}
            </span>
            <Select
              value={activeSort}
              onValueChange={(v) => updateParams("sort", v)}
            >
              <SelectTrigger className="w-44 rounded-full border-blush">
                <SelectValue placeholder={t("sortBy")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t("sortNewest")}</SelectItem>
                <SelectItem value="priceLow">{t("sortPriceLow")}</SelectItem>
                <SelectItem value="priceHigh">{t("sortPriceHigh")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="aspect-[3/4] bg-blush/30" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-16 rounded bg-blush/50" />
                  <div className="h-5 w-3/4 rounded bg-blush/50" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {paginated.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 4} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="py-20 text-center text-warm-gray">
            No products found.
          </p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-blush"
              disabled={currentPage <= 1}
              onClick={() => updateParams("page", String(currentPage - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="icon"
                className={`rounded-full ${
                  currentPage === i + 1
                    ? "bg-soft-pink text-cocoa hover:bg-soft-pink/80"
                    : "border-blush text-warm-gray hover:bg-blush/20"
                }`}
                onClick={() => updateParams("page", String(i + 1))}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-blush"
              disabled={currentPage >= totalPages}
              onClick={() => updateParams("page", String(currentPage + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
