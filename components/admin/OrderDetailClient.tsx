"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getFirebaseDb } from "@/lib/firebase";
import { apiPost } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/lib/types";
import { OrderStatusBadge } from "@/components/shop/OrderStatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export function OrderDetailClient() {
  const params = useParams<{ id: string }>();
  const t = useTranslations("admin");
  const [order, setOrder] = useState<Order | null>(null);
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
        const snap = await getDoc(doc(db, "orders", params.id));
        if (snap.exists()) {
          setOrder({
            id: snap.id,
            ...snap.data(),
            createdAt: snap.data().createdAt?.toDate?.() ?? new Date(),
          } as Order);
        }
      } catch {
        // Firestore unreachable
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  async function handleStatusChange(status: string) {
    if (!order) return;
    try {
      await apiPost("update-order-status", { id: order.id, status });
      setOrder({ ...order, status: status as Order["status"] });
      toast.success("Status updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order) {
    return <p className="text-warm-gray">Order not found</p>;
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/orders/"
        className="inline-flex items-center gap-2 text-sm text-warm-gray hover:text-cocoa"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("orders")}
      </Link>

      <div className="flex items-center gap-4">
        <h1 className="font-heading text-2xl font-bold text-cocoa">
          #{order.orderNumber}
        </h1>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-heading font-semibold text-cocoa">Customer</h2>
          <p className="text-cocoa">{order.customerName}</p>
          <p className="text-sm text-warm-gray">{order.customerEmail}</p>
          <p className="text-xs text-warm-gray">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-heading font-semibold text-cocoa">
            Update {t("status")}
          </h2>
          <Select
            defaultValue={order.status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-48 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["pending", "paid", "shipped", "delivered", "cancelled"].map(
                (s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-heading font-semibold text-cocoa">Items</h2>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-blush/30 pb-3 last:border-0"
            >
              <div>
                <p className="font-medium text-cocoa">{item.name}</p>
                <p className="text-sm text-warm-gray">x{item.quantity}</p>
              </div>
              <p className="font-semibold text-cocoa">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t pt-4">
          <span className="font-heading font-bold text-cocoa">
            {t("price")}
          </span>
          <span className="text-lg font-bold text-cocoa">
            {formatPrice(order.totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
