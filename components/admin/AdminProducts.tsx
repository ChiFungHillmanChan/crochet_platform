"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getAllProducts } from "@/lib/products";
import { apiPost } from "@/lib/api";
import type { Product } from "@/lib/types";
import { ProductTable } from "@/components/admin/ProductTable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

type PendingAction = { type: "delete" | "archive"; id: string } | null;

export default function AdminProducts() {
  const t = useTranslations("admin");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch {
        // Firestore unreachable
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const activeProducts = products.filter((p) => !p.isArchived);
  const archivedProducts = products.filter((p) => p.isArchived);

  function handleDelete(id: string) {
    setPendingAction({ type: "delete", id });
  }

  function handleArchive(id: string) {
    setPendingAction({ type: "archive", id });
  }

  async function confirmAction() {
    if (!pendingAction) return;
    const { type, id } = pendingAction;
    setPendingAction(null);

    try {
      if (type === "delete") {
        await apiPost("delete-product", { id });
        setProducts((prev) => prev.filter((p) => p.id !== id));
        toast.success("Product deleted");
      } else {
        await apiPost("archive-product", { id });
        setProducts((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, isArchived: true, isActive: false } : p
          )
        );
        toast.success(t("productArchived"));
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    }
  }

  async function handleRestore(id: string) {
    try {
      await apiPost("restore-product", { id });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isArchived: false } : p))
      );
      toast.success(t("productRestored"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Restore failed");
    }
  }

  const dialogTitle =
    pendingAction?.type === "archive" ? t("archiveConfirm") : `${t("delete")} product?`;
  const dialogDesc =
    pendingAction?.type === "archive"
      ? t("archiveDescription")
      : "This action cannot be undone. This will permanently delete the product.";

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
      ) : (
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">
              {t("active")} ({activeProducts.length})
            </TabsTrigger>
            <TabsTrigger value="archived">
              {t("archived")} ({archivedProducts.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            {activeProducts.length > 0 ? (
              <ProductTable
                products={activeProducts}
                onDelete={handleDelete}
                onArchive={handleArchive}
              />
            ) : (
              <p className="py-8 text-center text-warm-gray">
                {t("productsComingSoon")}
              </p>
            )}
          </TabsContent>
          <TabsContent value="archived">
            {archivedProducts.length > 0 ? (
              <ProductTable
                products={archivedProducts}
                onDelete={handleDelete}
                onRestore={handleRestore}
                showRestore
              />
            ) : (
              <p className="py-8 text-center text-warm-gray">
                {t("productsComingSoon")}
              </p>
            )}
          </TabsContent>
        </Tabs>
      )}

      <AlertDialog
        open={pendingAction !== null}
        onOpenChange={(open) => {
          if (!open) setPendingAction(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>{dialogDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>
              {pendingAction?.type === "archive" ? t("archive") : t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
