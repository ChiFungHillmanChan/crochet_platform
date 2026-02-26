"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Order } from "@/lib/types";

const statusStyles: Record<Order["status"], string> = {
  pending: "bg-butter text-cocoa",
  paid: "bg-mint text-cocoa",
  shipped: "bg-lavender text-cocoa",
  delivered: "bg-soft-pink text-cocoa",
  cancelled: "bg-warm-gray/20 text-warm-gray",
};

interface OrderStatusBadgeProps {
  status: Order["status"];
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const t = useTranslations("orderStatus");

  return (
    <Badge className={cn("rounded-full", statusStyles[status])}>
      {t(status)}
    </Badge>
  );
}
