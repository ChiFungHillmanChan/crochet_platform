"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { apiPost } from "@/lib/api";
import type { Order } from "@/lib/types";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatsGrid } from "@/components/admin/StatsGrid";
import { OrderTable } from "@/components/admin/OrderTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
  totalUsers: number;
}

interface LowStockProduct {
  id: string;
  name: string;
  slug: string;
  stock: number;
}

function LowStockAlert({ products }: { products: LowStockProduct[] }) {
  if (products.length === 0) return null;
  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
      <h3 className="mb-3 flex items-center gap-2 font-heading font-semibold text-destructive">
        <AlertTriangle className="h-5 w-5" />
        Low Stock Alert ({products.length} products)
      </h3>
      <div className="space-y-2">
        {products.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-lg bg-white p-3">
            <div>
              <p className="font-medium text-cocoa">{p.name}</p>
              <p className="text-xs text-warm-gray">/{p.slug}</p>
            </div>
            <span className={cn(
              "rounded-full px-3 py-1 text-sm font-semibold",
              p.stock === 0 ? "bg-destructive/10 text-destructive" : "bg-amber-100 text-amber-800"
            )}>
              {p.stock === 0 ? "Out of Stock" : `${p.stock} left`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const t = useTranslations("admin");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(false);
      try {
        const [statsData, ordersData] = await Promise.all([
          apiPost<DashboardStats>("get-dashboard-stats"),
          apiPost<{ orders: Order[] }>("get-orders"),
        ]);
        setStats(statsData);
        setOrders(ordersData.orders.slice(0, 10));
        // Fetch low stock products
        try {
          const { collection, query, where, orderBy, getDocs } = await import("firebase/firestore");
          const { getFirebaseDb } = await import("@/lib/firebase");
          const fireDb = await getFirebaseDb();
          const q = query(
            collection(fireDb, "products"),
            where("isActive", "==", true),
            where("stock", "<=", 5),
            orderBy("stock", "asc")
          );
          const snap = await getDocs(q);
          setLowStockProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as LowStockProduct)));
        } catch (err) {
          console.error("Failed to fetch low stock:", err);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [retryKey]);

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="font-heading text-2xl font-bold text-cocoa">
          {t("dashboard")}
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <h1 className="font-heading text-2xl font-bold text-cocoa">
          {t("dashboard")}
        </h1>
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-warm-gray">{t("loadError")}</p>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => setRetryKey((k) => k + 1)}
          >
            {t("retry")}
          </Button>
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
          totalUsers={stats.totalUsers}
        />
      )}

      <LowStockAlert products={lowStockProducts} />

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
