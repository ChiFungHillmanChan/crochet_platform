"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { apiPost } from "@/lib/api";
import type { Order } from "@/lib/types";
import { OrderTable } from "@/components/admin/OrderTable";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminOrders() {
  const t = useTranslations("admin");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiPost<{ orders: Order[] }>("get-orders");
        setOrders(data.orders);
      } catch {
        // API unreachable
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = filter
    ? orders.filter((o) => o.status === filter)
    : orders;

  const statuses = ["pending", "paid", "shipped", "delivered", "cancelled"];

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-cocoa">
        {t("orders")}
      </h1>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter(null)}
          className={`rounded-full px-3 py-1 text-sm ${
            filter === null
              ? "bg-soft-pink text-cocoa"
              : "bg-blush/50 text-warm-gray"
          }`}
        >
          All
        </button>
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-full px-3 py-1 text-sm capitalize ${
              filter === status
                ? "bg-soft-pink text-cocoa"
                : "bg-blush/50 text-warm-gray"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-xl" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <OrderTable orders={filtered} />
      ) : (
        <p className="py-8 text-center text-warm-gray">
          {t("ordersComingSoon")}
        </p>
      )}
    </div>
  );
}
