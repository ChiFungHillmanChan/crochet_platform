"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { apiPost } from "@/lib/api";
import type { Review } from "@/lib/types";
import { ReviewForm } from "@/components/admin/ReviewForm";
import { Skeleton } from "@/components/ui/skeleton";

function getIdFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const match = window.location.pathname.match(
    /\/admin\/reviews\/([^/]+)\/edit/
  );
  return match?.[1] === "placeholder" ? null : match?.[1] ?? null;
}

export function EditReviewClient() {
  const t = useTranslations("admin");
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const id = getIdFromUrl();
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const res = await apiPost<{ reviews: Review[] }>("get-reviews");
        const found = res.reviews.find((r) => r.id === id) ?? null;
        setReview(found);
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
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full max-w-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-cocoa">
        {t("editReview")}
      </h1>
      {review ? (
        <ReviewForm review={review} />
      ) : (
        <p className="text-warm-gray">Review not found</p>
      )}
    </div>
  );
}

export default EditReviewClient;
