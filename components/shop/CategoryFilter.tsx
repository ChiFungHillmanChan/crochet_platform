"use client";

import { useTranslations } from "next-intl";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: Category[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
}

export function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  const t = useTranslations("shop");

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "rounded-full px-4 py-2 text-sm font-medium transition-colors",
          selected === null
            ? "bg-soft-pink text-cocoa"
            : "bg-blush/50 text-warm-gray hover:bg-blush hover:text-cocoa"
        )}
      >
        {t("allCategories")}
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.slug)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            selected === category.slug
              ? "bg-soft-pink text-cocoa"
              : "bg-blush/50 text-warm-gray hover:bg-blush hover:text-cocoa"
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
