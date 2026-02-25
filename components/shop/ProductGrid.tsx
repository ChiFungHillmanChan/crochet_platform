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
      <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm"
          >
            <div className="aspect-[3/4] bg-blush/30" />
            <div className="space-y-2 p-3 sm:space-y-3 sm:p-5">
              <div className="h-3 w-14 rounded bg-blush/50 sm:h-4 sm:w-20" />
              <div className="h-4 w-3/4 rounded bg-blush/50 sm:h-6" />
              <div className="h-4 w-1/3 rounded bg-blush/50 sm:h-6" />
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
    <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 lg:gap-8">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} priority={i < 3} />
      ))}
    </div>
  );
}
