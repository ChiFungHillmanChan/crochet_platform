"use client";

import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/shop/ProductCard";
import { useTranslations } from "next-intl";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export function ProductGrid({ products, loading }: ProductGridProps) {
  const t = useTranslations("shop");

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm"
          >
            <div className="aspect-square bg-blush/30" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-16 rounded bg-blush/50" />
              <div className="h-5 w-3/4 rounded bg-blush/50" />
              <div className="h-5 w-1/3 rounded bg-blush/50" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-warm-gray">{t("noProducts")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
