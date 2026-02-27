"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  const [sheetOpen, setSheetOpen] = useState(false);

  const activeName =
    categories.find((c) => c.slug === selectedCategory)?.name ??
    t("filterAll");

  function selectCategory(slug: string) {
    onCategoryChange(slug);
    setSheetOpen(false);
  }

  return (
    <div className="mb-8 flex flex-wrap items-center gap-3">
      {/* Mobile: hamburger button that opens category sheet */}
      <div className="sm:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 rounded-full border-blush"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>{activeName}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl">
            <SheetHeader>
              <SheetTitle className="font-heading text-cocoa">
                {t("filterCategories")}
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-1 py-4">
              <button
                onClick={() => selectCategory("")}
                className={`rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? "bg-soft-pink text-cocoa"
                    : "text-warm-gray hover:bg-blush/30"
                }`}
              >
                {t("filterAll")}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => selectCategory(cat.slug)}
                  className={`rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                    selectedCategory === cat.slug
                      ? "bg-soft-pink text-cocoa"
                      : "text-warm-gray hover:bg-blush/30"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: pill buttons */}
      <div className="hidden gap-2 sm:flex">
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
