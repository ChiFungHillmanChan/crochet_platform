"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/lib/types";
import { OrderStatusBadge } from "@/components/shop/OrderStatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OrderTableProps {
  orders: Order[];
}

export function OrderTable({ orders }: OrderTableProps) {
  const t = useTranslations("admin");

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("orderNumber")}</TableHead>
          <TableHead>{t("customer")}</TableHead>
          <TableHead>{t("status")}</TableHead>
          <TableHead className="text-right">{t("price")}</TableHead>
          <TableHead>{t("date")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              <Link
                href={`/admin/orders/${order.id}/`}
                className="font-medium text-cocoa hover:underline"
              >
                #{order.orderNumber}
              </Link>
            </TableCell>
            <TableCell>{order.customerName || order.customerEmail}</TableCell>
            <TableCell>
              <OrderStatusBadge status={order.status} />
            </TableCell>
            <TableCell className="text-right">
              {formatPrice(order.totalAmount)}
            </TableCell>
            <TableCell className="text-warm-gray">
              {new Date(order.createdAt).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
