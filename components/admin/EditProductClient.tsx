"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { getFirebaseDb } from "@/lib/firebase";
import type { Product } from "@/lib/types";
import { ProductForm } from "@/components/admin/ProductForm";
import { Skeleton } from "@/components/ui/skeleton";

export function EditProductClient() {
  const params = useParams<{ id: string }>();
  const t = useTranslations("admin");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!params.id || params.id === "placeholder") {
        setLoading(false);
        return;
      }
      try {
        const db = await getFirebaseDb();
        const { doc, getDoc } = await import("firebase/firestore");
        const snap = await getDoc(doc(db, "products", params.id));
        if (snap.exists()) {
          setProduct({
            id: snap.id,
            ...snap.data(),
            createdAt: snap.data().createdAt?.toDate?.() ?? new Date(),
          } as Product);
        }
      } catch {
        // Firestore unreachable
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full max-w-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-cocoa">
        {t("editProduct")}
      </h1>
      {product ? (
        <ProductForm product={product} />
      ) : (
        <p className="text-warm-gray">Product not found</p>
      )}
    </div>
  );
}
