"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/utils";
import { getOptimizedImageUrl, getBlurDataUrl } from "@/lib/image-utils";
import type { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  /** Cards with index < 4 load eagerly (above the fold). */
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const t = useTranslations("shop");
  const thumbSrc = product.images[0]
    ? getOptimizedImageUrl(product.images[0], "thumb")
    : "";
  const blurUrl = product.images[0]
    ? getBlurDataUrl(product.images[0])
    : undefined;

  return (
    <Link
      href={`/products/${product.slug}/`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-blush/30">
        {thumbSrc ? (
          <Image
            src={thumbSrc}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            loading={priority ? undefined : "lazy"}
            placeholder={blurUrl ? "blur" : "empty"}
            blurDataURL={blurUrl}
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
      <div className="flex flex-1 flex-col p-4">
        <Badge variant="outline" className="mb-2 w-fit text-xs text-warm-gray">
          {product.categorySlug}
        </Badge>
        <h3 className="font-heading text-lg font-semibold text-cocoa">
          {product.name}
        </h3>
        <p className="mt-auto pt-2 font-semibold text-soft-pink">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
