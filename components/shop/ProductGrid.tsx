"use client";

import { useTranslations } from "next-intl";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { Product } from "@/lib/types";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
}

export function ProductGrid({
  products,
  loading,
  hasMore,
  loadingMore,
  onLoadMore,
}: ProductGridProps) {
  const tc = useTranslations("common");
  const t = useTranslations("shopPage");

  if (loading) {
    return (
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
    );
  }

  if (products.length === 0) {
    return (
      <p className="py-20 text-center text-warm-gray">{tc("noResults")}</p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} priority={i < 4} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <Button
            variant="outline"
            className="rounded-full border-blush px-8"
            onClick={onLoadMore}
            disabled={loadingMore}
          >
            {loadingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("loadMore")}
          </Button>
        </div>
      )}
    </>
  );
}
