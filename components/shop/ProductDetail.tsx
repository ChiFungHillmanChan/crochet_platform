"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getProductBySlug } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { ImageGallery } from "@/components/shop/ImageGallery";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { QuantitySelector } from "@/components/shop/QuantitySelector";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetail() {
  const params = useParams<{ slug: string }>();
  const t = useTranslations("product");
  const ts = useTranslations("shop");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function load() {
      if (!params.slug || params.slug === "placeholder") {
        setLoading(false);
        return;
      }
      try {
        const p = await getProductBySlug(params.slug);
        setProduct(p);
      } catch {
        // Firestore unreachable
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.slug]);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex flex-1 items-center justify-center py-20">
        <div className="space-y-4 text-center">
          <p className="text-lg text-warm-gray">{ts("noProducts")}</p>
          <Link
            href="/"
            className="inline-block rounded-full bg-soft-pink px-6 py-2 font-medium text-cocoa"
          >
            {t("backToShop")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-warm-gray hover:text-cocoa"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToShop")}
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <ImageGallery images={product.images} productName={product.name} />

        <div className="space-y-6">
          <div>
            <Badge variant="outline" className="mb-2 text-warm-gray">
              {product.categorySlug}
            </Badge>
            <h1 className="font-heading text-3xl font-bold text-cocoa">
              {product.name}
            </h1>
            <p className="mt-2 text-2xl font-semibold text-soft-pink">
              {formatPrice(product.price)}
            </p>
          </div>

          {product.stock > 0 && (
            <p className="text-sm text-mint">{ts("stock")}</p>
          )}

          <p className="leading-relaxed text-warm-gray">
            {product.description}
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-cocoa">
                {t("quantity")}
              </span>
              <QuantitySelector
                quantity={quantity}
                onQuantityChange={setQuantity}
                max={product.stock}
              />
            </div>
            <AddToCartButton product={product} quantity={quantity} />
          </div>
        </div>
      </div>
    </main>
  );
}
