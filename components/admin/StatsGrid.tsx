"use client";

import { useTranslations } from "next-intl";
import { Package, ShoppingCart, DollarSign, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

interface StatsGridProps {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
}

export function StatsGrid({
  totalOrders,
  totalRevenue,
  totalProducts,
  pendingOrders,
}: StatsGridProps) {
  const t = useTranslations("admin");

  const stats = [
    {
      label: t("totalOrders"),
      value: totalOrders.toString(),
      icon: ShoppingCart,
      color: "bg-soft-pink",
    },
    {
      label: t("totalRevenue"),
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      color: "bg-mint",
    },
    {
      label: t("totalProducts"),
      value: totalProducts.toString(),
      icon: Package,
      color: "bg-lavender",
    },
    {
      label: t("pendingOrders"),
      value: pendingOrders.toString(),
      icon: Clock,
      color: "bg-butter",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="rounded-2xl">
          <CardContent className="flex items-center gap-4 p-6">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
            >
              <stat.icon className="h-5 w-5 text-cocoa" />
            </div>
            <div>
              <p className="text-sm text-warm-gray">{stat.label}</p>
              <p className="font-heading text-2xl font-bold text-cocoa">
                {stat.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
