"use client";

import Image from "next/image";
import { Trash2, LogIn } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/stores/cartStore";
import { useAuth } from "@/lib/auth-context";
import { formatPrice } from "@/lib/utils";
import { getOptimizedImageUrl } from "@/lib/image-utils";
import { QuantitySelector } from "@/components/shop/QuantitySelector";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function CartContent() {
  const t = useTranslations("cart");
  const ta = useTranslations("auth");
  const { user, loading: authLoading } = useAuth();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalPrice = useCartStore((s) => s.totalPrice);

  if (!authLoading && !user) {
    return (
      <main className="flex flex-1 items-center justify-center py-20">
        <div className="space-y-4 text-center">
          <div className="text-6xl">🧶</div>
          <h1 className="font-heading text-2xl font-bold text-cocoa">
            {t("title")}
          </h1>
          <p className="text-warm-gray">{t("signInToView")}</p>
          <Link href="/account/login/">
            <Button className="rounded-full bg-soft-pink text-cocoa hover:bg-soft-pink/80">
              <LogIn className="mr-2 h-4 w-4" />
              {ta("signIn")}
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="flex flex-1 items-center justify-center py-20">
        <div className="space-y-4 text-center">
          <div className="text-6xl">🧶</div>
          <h1 className="font-heading text-2xl font-bold text-cocoa">
            {t("empty")}
          </h1>
          <p className="text-warm-gray">{t("emptyDescription")}</p>
          <Link href="/">
            <Button className="rounded-full bg-soft-pink text-cocoa hover:bg-soft-pink/80">
              {t("continueShopping")}
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 font-heading text-2xl font-bold text-cocoa">
        {t("title")}
      </h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-blush/30">
              {item.image ? (
                <Image
                  src={getOptimizedImageUrl(item.image, "thumb")}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="text-2xl">🧶</span>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-1">
              <h3 className="font-heading font-semibold text-cocoa">
                {item.name}
              </h3>
              <p className="text-sm font-medium text-soft-pink">
                {formatPrice(item.price)}
              </p>
            </div>

            <QuantitySelector
              quantity={item.quantity}
              onQuantityChange={(q) => updateQuantity(item.productId, q)}
            />

            <p className="w-20 text-right font-semibold text-cocoa">
              {formatPrice(item.price * item.quantity)}
            </p>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(item.productId)}
              className="shrink-0 text-warm-gray hover:text-destructive"
              aria-label={t("remove")}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Separator className="my-6" />

      <div className="flex items-center justify-between">
        <span className="font-heading text-lg font-semibold text-cocoa">
          {t("total")}
        </span>
        <span className="text-xl font-bold text-cocoa">
          {formatPrice(totalPrice())}
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Link href="/">
          <Button variant="outline" className="w-full rounded-full sm:w-auto">
            {t("continueShopping")}
          </Button>
        </Link>
        <Link href="/checkout/">
          <Button
            className="w-full rounded-full bg-soft-pink text-cocoa hover:bg-soft-pink/80 sm:w-auto"
            size="lg"
          >
            {t("checkout")}
          </Button>
        </Link>
      </div>
    </main>
  );
}
