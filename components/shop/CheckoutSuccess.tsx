"use client";

import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccess() {
  const t = useTranslations("checkoutSuccess");
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main className="flex flex-1 items-center justify-center py-20">
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mint">
          <CheckCircle className="h-8 w-8 text-cocoa" />
        </div>
        <h1 className="font-heading text-3xl font-bold text-cocoa">
          {t("title")}
        </h1>
        <p className="text-warm-gray">{t("message")}</p>
        <Link href="/">
          <Button className="rounded-full bg-soft-pink text-cocoa hover:bg-soft-pink/80">
            {t("backToShop")}
          </Button>
        </Link>
      </div>
    </main>
  );
}
