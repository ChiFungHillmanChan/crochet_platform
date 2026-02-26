"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { apiPost } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import type { PaymentLink } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Copy, ExternalLink, Loader2 } from "lucide-react";

const PRESET_PRICES = [1000, 1200, 2000, 2500, 3000]; // pence

export default function AdminPaymentLinks() {
  const t = useTranslations("admin");
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [productName, setProductName] = useState("");
  const [selectedPrice, setSelectedPrice] = useState<number | null>(2000);
  const [customPrice, setCustomPrice] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [pendingDeactivateId, setPendingDeactivateId] = useState<string | null>(null);

  const loadLinks = useCallback(async () => {
    try {
      const data = await apiPost<{ links: PaymentLink[] }>("get-payment-links", {});
      setLinks(data.links);
    } catch {
      toast.error(t("loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  async function handleCreate() {
    const amount = isCustom ? parseInt(customPrice) : selectedPrice;
    if (!productName.trim() || !amount || amount <= 0) {
      toast.error("Product name and valid price required");
      return;
    }

    setCreating(true);
    try {
      await apiPost("create-payment-link", { productName, amountPence: amount });
      setProductName("");
      setCustomPrice("");
      setIsCustom(false);
      setSelectedPrice(2000);
      await loadLinks();
      toast.success("Payment link created");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create link");
    } finally {
      setCreating(false);
    }
  }

  async function handleDeactivate() {
    if (!pendingDeactivateId) return;
    try {
      await apiPost("deactivate-payment-link", { id: pendingDeactivateId });
      setLinks((prev) =>
        prev.map((l) => (l.id === pendingDeactivateId ? { ...l, active: false } : l))
      );
      toast.success("Payment link deactivated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to deactivate");
    } finally {
      setPendingDeactivateId(null);
    }
  }

  function copyToClipboard(url: string) {
    navigator.clipboard.writeText(url);
    toast.success(t("copied"));
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-bold text-cocoa">
        {t("paymentLinks")}
      </h1>

      {/* Create form */}
      <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-heading font-semibold text-cocoa">
          {t("createPaymentLink")}
        </h2>
        <div className="space-y-2">
          <Label>{t("productNameLabel")}</Label>
          <Input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="rounded-xl"
            placeholder="e.g. Custom Amigurumi Bear"
          />
        </div>
        <div className="space-y-2">
          <Label>{t("price")}</Label>
          <div className="flex flex-wrap gap-2">
            {PRESET_PRICES.map((p) => (
              <Button
                key={p}
                variant={!isCustom && selectedPrice === p ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => {
                  setIsCustom(false);
                  setSelectedPrice(p);
                }}
              >
                {formatPrice(p)}
              </Button>
            ))}
            <Button
              variant={isCustom ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => {
                setIsCustom(true);
                setSelectedPrice(null);
              }}
            >
              {t("customPrice")}
            </Button>
          </div>
          {isCustom && (
            <Input
              type="number"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              placeholder={t("priceLabel")}
              className="mt-2 w-40 rounded-xl"
            />
          )}
        </div>
        <Button
          onClick={handleCreate}
          disabled={creating}
          className="rounded-full bg-soft-pink text-cocoa hover:bg-soft-pink/80"
        >
          {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("createPaymentLink")}
        </Button>
      </div>

      {/* Links list */}
      <div className="space-y-3">
        {links.length === 0 && (
          <p className="text-warm-gray">{t("noPaymentLinks")}</p>
        )}
        {links.map((link) => (
          <div
            key={link.id}
            className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-sm"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-cocoa">{link.productName}</p>
              <p className="truncate text-sm text-warm-gray">{link.url}</p>
            </div>
            <Badge variant="secondary" className="rounded-full">
              {formatPrice(link.amountPence)}
            </Badge>
            <Badge
              variant={link.active ? "default" : "outline"}
              className="rounded-full"
            >
              {link.active ? t("active") : t("inactive")}
            </Badge>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(link.url)}
                title={t("copyLink")}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(link.url, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              {link.active && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => setPendingDeactivateId(link.id)}
                >
                  {t("deactivate")}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <AlertDialog
        open={!!pendingDeactivateId}
        onOpenChange={(open) => !open && setPendingDeactivateId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deactivateConfirm")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deactivateDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeactivate}>
              {t("deactivate")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
