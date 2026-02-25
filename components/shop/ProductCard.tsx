"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations("shop");

  return (
    <Link
      href={`/products/${product.slug}/`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-blush/30">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-4xl">🧶</span>
          </div>
        )}
        {product.stock === 0 && (
          <Badge
            variant="secondary"
            className="absolute right-2 top-2 bg-warm-gray text-white"
          >
            {t("outOfStock")}
          </Badge>
        )}
      </div>
      <div className="p-4">
        <Badge variant="outline" className="mb-2 text-xs text-warm-gray">
          {product.categorySlug}
        </Badge>
        <h3 className="font-heading text-lg font-semibold text-cocoa">
          {product.name}
        </h3>
        <p className="mt-1 font-semibold text-soft-pink">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
