"use client";

import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/lib/types";

type SortOption = "newest" | "priceLow" | "priceHigh";

interface ShopFiltersProps {
  categories: Category[];
  selectedCategory: string;
  sortBy: SortOption;
  itemCount: number;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
}

export function ShopFilters({
  categories,
  selectedCategory,
  sortBy,
  itemCount,
  onCategoryChange,
  onSortChange,
}: ShopFiltersProps) {
  const t = useTranslations("shopPage");

  return (
    <div className="mb-8 flex flex-wrap items-center gap-3">
      <div className="scrollbar-hide flex gap-2 overflow-x-auto">
        <button
          onClick={() => onCategoryChange("")}
          aria-pressed={!selectedCategory}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            !selectedCategory
              ? "bg-soft-pink text-cocoa"
              : "border border-blush bg-white text-warm-gray hover:bg-blush/20"
          }`}
        >
          {t("filterAll")}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.slug)}
            aria-pressed={selectedCategory === cat.slug}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === cat.slug
                ? "bg-soft-pink text-cocoa"
                : "border border-blush bg-white text-warm-gray hover:bg-blush/20"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-3">
        <span className="text-sm text-warm-gray">
          {t("itemCount", { count: itemCount })}
        </span>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-44 rounded-full border-blush">
            <SelectValue placeholder={t("sortBy")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t("sortNewest")}</SelectItem>
            <SelectItem value="priceLow">{t("sortPriceLow")}</SelectItem>
            <SelectItem value="priceHigh">{t("sortPriceHigh")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
