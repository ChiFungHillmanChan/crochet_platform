"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { getProducts, getCategories } from "@/lib/products";
import type { Product, Category } from "@/lib/types";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { CategoryFilter } from "@/components/shop/CategoryFilter";

export default function ShopSection() {
  const t = useTranslations("home");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [prods, cats] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(prods);
        setCategories(cats);
      } catch {
        // ASSUMPTION: If Firestore is unreachable, show empty state. Change if offline fallback needed.
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = selectedCategory
    ? products.filter((p) => p.categorySlug === selectedCategory)
    : products;

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
