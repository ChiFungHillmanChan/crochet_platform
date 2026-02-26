"use client";

import { useTranslations } from "next-intl";
import { Pencil, Trash2, Archive, ArchiveRestore } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
  onArchive?: (id: string) => void;
  onRestore?: (id: string) => void;
  showRestore?: boolean;
}

export function ProductTable({
  products,
  onDelete,
  onArchive,
  onRestore,
  showRestore,
}: ProductTableProps) {
  const t = useTranslations("admin");

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("productName")}</TableHead>
          <TableHead>{t("price")}</TableHead>
          <TableHead>{t("stock")}</TableHead>
          <TableHead>{t("category")}</TableHead>
          <TableHead>{t("status")}</TableHead>
          <TableHead className="text-right">{t("actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>{formatPrice(product.price)}</TableCell>
            <TableCell>{product.stock}</TableCell>
            <TableCell>
              <Badge variant="outline">{product.categorySlug}</Badge>
            </TableCell>
            <TableCell>
              {product.isArchived ? (
                <Badge className="bg-warm-gray/20 text-warm-gray">
                  {t("archived")}
                </Badge>
              ) : (
                <Badge
                  className={
                    product.isActive
                      ? "bg-mint text-cocoa"
                      : "bg-warm-gray/20 text-warm-gray"
                  }
                >
                  {product.isActive ? t("active") : t("inactive")}
                </Badge>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Link href={`/admin/products/${product.id}/edit/`}>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                {showRestore && onRestore ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRestore(product.id)}
                    title={t("restore")}
                  >
                    <ArchiveRestore className="h-4 w-4" />
                  </Button>
                ) : (
                  onArchive && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onArchive(product.id)}
                      title={t("archive")}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  )
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(product.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
