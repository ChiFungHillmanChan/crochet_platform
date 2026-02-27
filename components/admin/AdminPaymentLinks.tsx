"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { apiPost } from "@/lib/api";
import { PaymentLinkForm } from "@/components/admin/PaymentLinkForm";
import { PaymentLinkTable } from "@/components/admin/PaymentLinkTable";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { PaymentLink } from "@/lib/types";

export default function AdminPaymentLinks() {
  const t = useTranslations("admin");
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLinks = useCallback(async () => {
    try {
      const data = await apiPost<{ links: PaymentLink[] }>("get-payment-links", {});
      setLinks(data.links);
    } catch (err) {
      console.error("Failed to load payment links:", err);
      toast.error(t("loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  function handleDeactivated(id: string) {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, active: false } : l))
    );
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
      <PaymentLinkForm onCreated={loadLinks} />
      <PaymentLinkTable links={links} onDeactivated={handleDeactivated} />
    </div>
  );
}
