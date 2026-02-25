"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { getReviewsByProduct } from "@/lib/reviews";
import type { Review } from "@/lib/types";

interface ReviewSectionProps {
  productId: string;
}

export function ReviewSection({ productId }: ReviewSectionProps) {
  const t = useTranslations("reviews");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getReviewsByProduct(productId);
        setReviews(data);
      } catch {
        // Reviews are non-critical, fail silently
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [productId]);

  if (loading) {
    return null;
  }

  if (reviews.length === 0) {
    return (
      <section className="mt-12">
        <h2 className="mb-4 font-heading text-xl font-bold text-cocoa">
          {t("title")}
        </h2>
        <p className="text-warm-gray">{t("noReviews")}</p>
      </section>
    );
  }

  return (
    <section className="mt-12">
      <h2 className="mb-6 font-heading text-xl font-bold text-cocoa">
        {t("title")}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-2xl bg-blush/20 p-6"
          >
            <div
              className="text-lg text-amber-400"
              aria-label={t("starRating", { rating: review.rating })}
            >
              {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
            </div>
            <p className="mt-2 leading-relaxed text-warm-gray">
              {review.body}
            </p>
            <p className="mt-3 text-sm font-medium text-cocoa">
              — {review.authorName}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
