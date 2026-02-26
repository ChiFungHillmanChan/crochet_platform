"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { getProductBySlug } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { generateProductJsonLd } from "@/lib/structured-data";
import type { Product } from "@/lib/types";
import { ImageGallery } from "@/components/shop/ImageGallery";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { QuantitySelector } from "@/components/shop/QuantitySelector";
import { RelatedProducts } from "@/components/shop/RelatedProducts";
import { ProductTabs } from "@/components/shop/ProductTabs";
import { ProductAccordion } from "@/components/shop/ProductAccordion";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

/** Extract product slug from the browser URL instead of useParams(),
 *  because the static placeholder page bakes "placeholder" into RSC params. */
function getSlugFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const match = window.location.pathname.match(
    /\/(?:en|zh-hk)\/products\/([^/]+)/
  );
  const slug = match?.[1] ?? null;
  return slug === "placeholder" ? null : slug;
}

function getLocaleFromUrl(): string {
  if (typeof window === "undefined") return "en";
  const match = window.location.pathname.match(/^\/(en|zh-hk)\//);
  return match?.[1] ?? "en";
}

export function ProductDetail() {
  const t = useTranslations("product");
  const ts = useTranslations("shop");
  const tc = useTranslations("common");
  const tn = useTranslations("nav");
  const pathname = usePathname();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setQuantity(1);
      const slug = getSlugFromUrl();
      if (!slug) {
        setLoading(false);
        return;
      }
      try {
        const p = await getProductBySlug(slug);
        setProduct(p);
      } catch {
        // Firestore unreachable
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [pathname]);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
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

  const locale = getLocaleFromUrl();
  // JSON-LD structured data generated from trusted internal product data,
  // not from user input, so dangerouslySetInnerHTML is safe here.
  const productJsonLd = JSON.stringify(generateProductJsonLd(product, locale));

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: productJsonLd }}
      />

      <Breadcrumbs
        items={[
          { label: tc("home"), href: "/" },
          { label: tn("shop"), href: "/shop" },
          {
            label: product.categorySlug,
            href: `/shop?category=${product.categorySlug}`,
          },
          { label: product.name },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
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

      <div className="mt-12">
        <ProductTabs
          description={product.description}
          productId={product.id}
        />
      </div>

      <div className="mt-8">
        <ProductAccordion description={product.description} />
      </div>

      <RelatedProducts
        categorySlug={product.categorySlug}
        excludeId={product.id}
      />
    </main>
  );
}
