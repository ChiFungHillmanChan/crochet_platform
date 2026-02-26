"use client";

import { useTranslations } from "next-intl";

interface ProductBadgeProps {
  type: "new" | "bestSeller" | "lowStock";
}

const BADGE_STYLES: Record<ProductBadgeProps["type"], string> = {
  new: "bg-lavender text-cocoa",
  bestSeller: "bg-soft-pink text-cocoa",
  lowStock: "bg-butter text-cocoa",
};

export function ProductBadge({ type }: ProductBadgeProps) {
  const t = useTranslations("badges");

  return (
    <span
      className={`absolute left-2 top-2 rounded-full px-2.5 py-0.5 text-xs font-medium ${BADGE_STYLES[type]}`}
    >
      {t(type)}
    </span>
  );
}
