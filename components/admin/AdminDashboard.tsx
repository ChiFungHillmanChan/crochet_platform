"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { apiPost } from "@/lib/api";
import type { Order } from "@/lib/types";
import { StatsGrid } from "@/components/admin/StatsGrid";
import { OrderTable } from "@/components/admin/OrderTable";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
}

export default function AdminDashboard() {
  const t = useTranslations("admin");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsData, ordersData] = await Promise.all([
          apiPost<DashboardStats>("get-dashboard-stats"),
          apiPost<{ orders: Order[] }>("get-orders"),
        ]);
        setStats(statsData);
        setOrders(ordersData.orders.slice(0, 10));
      } catch {
        // API unreachable
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="font-heading text-2xl font-bold text-cocoa">
          {t("dashboard")}
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-bold text-cocoa">
        {t("dashboard")}
      </h1>

      {stats && (
        <StatsGrid
          totalOrders={stats.totalOrders}
          totalRevenue={stats.totalRevenue}
          totalProducts={stats.totalProducts}
          pendingOrders={stats.pendingOrders}
        />
      )}

      <div>
        <h2 className="mb-4 font-heading text-lg font-semibold text-cocoa">
          {t("recentOrders")}
        </h2>
        {orders.length > 0 ? (
          <OrderTable orders={orders} />
        ) : (
          <p className="text-warm-gray">{t("ordersComingSoon")}</p>
        )}
      </div>
    </div>
  );
}
