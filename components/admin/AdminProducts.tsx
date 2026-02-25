"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getProducts } from "@/lib/products";
import { apiPost } from "@/lib/api";
import type { Product } from "@/lib/types";
import { ProductTable } from "@/components/admin/ProductTable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function AdminProducts() {
  const t = useTranslations("admin");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch {
        // Firestore unreachable
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    try {
      await apiPost("delete-product", { id });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-cocoa">
          {t("products")}
        </h1>
        <Link href="/admin/products/new/">
          <Button className="rounded-full bg-soft-pink text-cocoa hover:bg-soft-pink/80">
            <Plus className="mr-2 h-4 w-4" />
            {t("newProduct")}
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-xl" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <ProductTable products={products} onDelete={handleDelete} />
      ) : (
        <p className="py-8 text-center text-warm-gray">
          {t("productsComingSoon")}
        </p>
      )}
    </div>
  );
}
