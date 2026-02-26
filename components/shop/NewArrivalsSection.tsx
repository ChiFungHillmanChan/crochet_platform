"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ProductCarousel } from "@/components/shop/ProductCarousel";
import { getProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

export default function NewArrivalsSection() {
  const t = useTranslations("homepage");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts()
      .then((all) => all.slice(0, 8))
      .then(setProducts)
      .catch(console.error);
  }, []);

  if (products.length === 0) return null;

  return <ProductCarousel title={t("newArrivals")} products={products} />;
}
