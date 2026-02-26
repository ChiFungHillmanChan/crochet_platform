"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ProductCarousel } from "@/components/shop/ProductCarousel";
import { getProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

export default function BestSellersSection() {
  const t = useTranslations("homepage");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // ASSUMPTION: Using createdAt as fallback since there's no review count field on Product.
    // Change to sort by review count when that data is available.
    getProducts()
      .then((all) => all.slice(0, 8))
      .then(setProducts)
      .catch(console.error);
  }, []);

  if (products.length === 0) return null;

  return (
    <ProductCarousel
      title={t("bestSellers")}
      products={products}
      showRatings
    />
  );
}
