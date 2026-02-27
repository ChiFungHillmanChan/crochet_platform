"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { formatPrice } from "@/lib/utils";
import { apiPost } from "@/lib/api";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { Copy, ExternalLink } from "lucide-react";
import type { PaymentLink } from "@/lib/types";

interface PaymentLinkTableProps {
  links: PaymentLink[];
  onDeactivated: (id: string) => void;
}

export function PaymentLinkTable({ links, onDeactivated }: PaymentLinkTableProps) {
  const t = useTranslations("admin");
  const [pendingDeactivateId, setPendingDeactivateId] = useState<string | null>(null);

  async function handleDeactivate() {
    if (!pendingDeactivateId) return;
    try {
      await apiPost("deactivate-payment-link", { id: pendingDeactivateId });
      onDeactivated(pendingDeactivateId);
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

  return (
    <>
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
    </>
  );
}
