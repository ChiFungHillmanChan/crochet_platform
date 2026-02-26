"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ShoppingBag, LogIn, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/utils";
import { getOptimizedImageUrl, getBlurDataUrl } from "@/lib/image-utils";
import type { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  /** Cards with index < 3 load eagerly (above the fold). */
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const t = useTranslations("shop");
  const { user, loading: authLoading } = useAuth();
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const thumbSrc = product.images[0]
    ? getOptimizedImageUrl(product.images[0], "thumb")
    : "";
  const blurUrl = product.images[0]
    ? getBlurDataUrl(product.images[0])
    : undefined;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0] ?? "",
    });
    setAdded(true);
    toast.success(t("added"));
    setTimeout(() => setAdded(false), 2000);
  }

  const isOutOfStock = product.stock === 0;
  const isSignedIn = !authLoading && !!user;

  return (
    <Link
      href={`/products/${product.slug}/`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-blush/30">
        {thumbSrc ? (
          <Image
            src={thumbSrc}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            loading={priority ? undefined : "lazy"}
            placeholder={blurUrl ? "blur" : "empty"}
            blurDataURL={blurUrl}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-4xl sm:text-5xl">🧶</span>
          </div>
        )}

        {/* Out of stock badge */}
        {isOutOfStock && (
          <Badge
            variant="secondary"
            className="absolute right-2 top-2 bg-warm-gray text-xs text-white sm:right-3 sm:top-3"
          >
            {t("outOfStock")}
          </Badge>
        )}

        {/* Desktop hover overlay (hidden on touch devices) */}
        <div className="pointer-events-none absolute inset-0 hidden items-end justify-center bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:flex">
          {!isOutOfStock && (
            <div className="pointer-events-auto w-full px-4 pb-4">
              {isSignedIn ? (
                <button
                  onClick={handleAddToCart}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-white/95 px-6 py-3 font-semibold text-cocoa shadow-md backdrop-blur-sm transition-all hover:bg-white"
                >
                  {added ? (
                    <>
                      <Check className="h-4 w-4" />
                      {t("added")}
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      {t("addToCart")}
                    </>
                  )}
                </button>
              ) : (
                <span className="flex w-full items-center justify-center gap-2 rounded-full bg-white/95 px-6 py-3 font-semibold text-cocoa shadow-md backdrop-blur-sm">
                  <LogIn className="h-4 w-4" />
                  {t("signInToAdd")}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Product info */}
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <Badge
          variant="outline"
          className="mb-1.5 w-fit text-[10px] text-warm-gray sm:mb-2 sm:text-xs"
        >
          {product.categorySlug}
        </Badge>
        <h3 className="font-heading text-sm font-semibold leading-tight text-cocoa sm:text-xl">
          {product.name}
        </h3>
        <p className="mt-auto pt-2 text-sm font-semibold text-soft-pink sm:pt-3 sm:text-lg">
          {formatPrice(product.price)}
        </p>

        {/* Mobile action button (always visible, no hover needed) */}
        {!isOutOfStock && (
          <div className="mt-2 md:hidden">
            {isSignedIn ? (
              <button
                onClick={handleAddToCart}
                className="flex w-full items-center justify-center gap-1.5 rounded-full bg-soft-pink/90 px-3 py-2 text-xs font-semibold text-cocoa transition-colors active:bg-soft-pink"
              >
                {added ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    {t("added")}
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-3.5 w-3.5" />
                    {t("addToCart")}
                  </>
                )}
              </button>
            ) : (
              <span className="flex w-full items-center justify-center gap-1.5 rounded-full bg-soft-pink/90 px-3 py-2 text-xs font-semibold text-cocoa">
                <LogIn className="h-3.5 w-3.5" />
                {t("signInToAdd")}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
