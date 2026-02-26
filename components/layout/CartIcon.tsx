"use client";

import { ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/stores/cartStore";

export function CartIcon() {
  const totalItems = useCartStore((s) => s.totalItems);
  const count = totalItems();
  const t = useTranslations("nav");

  return (
    <Link href="/cart/" className="relative p-2" aria-label={t("cart")}>
      <ShoppingBag className="h-5 w-5 text-cocoa" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-soft-pink text-[10px] font-semibold text-cocoa">
          {count}
        </span>
      )}
    </Link>
  );
}
