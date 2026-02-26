"use client";

import { useTranslations } from "next-intl";
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Review } from "@/lib/types";
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

interface ReviewTableProps {
  reviews: Review[];
  onDelete: (id: string) => void;
}

export function ReviewTable({ reviews, onDelete }: ReviewTableProps) {
  const t = useTranslations("admin");

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("reviewer")}</TableHead>
          <TableHead>{t("rating")}</TableHead>
          <TableHead>{t("productId")}</TableHead>
          <TableHead>{t("status")}</TableHead>
          <TableHead className="text-right">{t("actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reviews.map((review) => (
          <TableRow key={review.id}>
            <TableCell className="font-medium">
              {review.authorName}
            </TableCell>
            <TableCell>
              <span className="text-yellow-500">
                {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
              </span>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{review.productId}</Badge>
            </TableCell>
            <TableCell>
              <Badge
                className={
                  review.isApproved
                    ? "bg-mint text-cocoa"
                    : "bg-warm-gray/20 text-warm-gray"
                }
              >
                {review.isApproved ? t("approved") : t("notApproved")}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Link href={`/admin/reviews/${review.id}/edit/`}>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(review.id)}
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
