"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { getRelatedProducts } from "@/lib/products";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/shop/ProductCard";

interface RelatedProductsProps {
  categorySlug: string;
  excludeId: string;
}

export function RelatedProducts({ categorySlug, excludeId }: RelatedProductsProps) {
  const t = useTranslations("related");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getRelatedProducts(categorySlug, excludeId);
        setProducts(data);
      } catch {
        // Related products are non-critical
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [categorySlug, excludeId]);

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="mb-6 font-heading text-xl font-bold text-cocoa">
        {t("title")}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
