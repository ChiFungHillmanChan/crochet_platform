"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth-context";
import { getOrdersByUser } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/lib/types";
import { OrderStatusBadge } from "@/components/shop/OrderStatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function AccountContent() {
  const t = useTranslations("account");
  const tc = useTranslations("common");
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/account/login/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function load() {
      if (!user) return;
      try {
        const data = await getOrdersByUser(user.uid);
        setOrders(data);
      } catch {
        // Firestore unreachable
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (authLoading || !user) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-warm-gray">{tc("loading")}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 font-heading text-2xl font-bold text-cocoa">
        {t("title")}
      </h1>

      <h2 className="mb-4 font-heading text-lg font-semibold text-cocoa">
        {t("orders")}
      </h2>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="space-y-4 py-12 text-center">
          <div className="text-4xl">📦</div>
          <p className="font-heading text-lg text-cocoa">{t("noOrders")}</p>
          <p className="text-sm text-warm-gray">{t("noOrdersDescription")}</p>
          <Link href="/">
            <Button className="rounded-full bg-soft-pink text-cocoa hover:bg-soft-pink/80">
              {tc("backToShop")}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm"
            >
              <div className="space-y-1">
                <p className="font-heading font-semibold text-cocoa">
                  #{order.orderNumber}
                </p>
                <p className="text-xs text-warm-gray">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-warm-gray">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-semibold text-cocoa">
                  {formatPrice(order.totalAmount)}
                </p>
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
