"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import { toast } from "sonner";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
}

export function AddToCartButton({
  product,
  quantity = 1,
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const t = useTranslations("shop");

  function handleAdd() {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0] ?? "",
    });
    setAdded(true);
    toast.success(t("added"));
    setTimeout(() => setAdded(false), 2000);
  }

  if (product.stock === 0) {
    return (
      <Button disabled className="w-full rounded-full" size="lg">
        {t("outOfStock")}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAdd}
      className="w-full rounded-full bg-soft-pink text-cocoa hover:bg-soft-pink/80"
      size="lg"
    >
      {added ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          {t("added")}
        </>
      ) : (
        <>
          <ShoppingBag className="mr-2 h-4 w-4" />
          {t("addToCart")}
        </>
      )}
    </Button>
  );
}
