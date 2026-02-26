"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { getProducts, getCategories } from "@/lib/products";
import type { Product, Category } from "@/lib/types";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { CategoryFilter } from "@/components/shop/CategoryFilter";
import { Button } from "@/components/ui/button";

export default function ShopSection() {
  const t = useTranslations("home");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(false);
      try {
        const [prods, cats] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(prods);
        setCategories(cats);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [retryKey]);

  const filtered = selectedCategory
    ? products.filter((p) => p.categorySlug === selectedCategory)
    : products;

  if (error) {
    return (
      <section id="collection" className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-warm-gray">{t("loadError")}</p>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => setRetryKey((k) => k + 1)}
          >
            {t("retry")}
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="collection" className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="mb-8 font-heading text-2xl font-bold text-cocoa">
        {t("featuredTitle")}
      </h2>
      <div className="mb-8">
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>
      <ProductGrid products={filtered} loading={loading} />
    </section>
  );
}
