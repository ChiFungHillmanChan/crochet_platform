"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { getRecentReviews } from "@/lib/reviews";
import type { Review } from "@/lib/types";

export default function ReviewCarousel() {
  const t = useTranslations("homepage");
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    getRecentReviews(6).then(setReviews).catch(console.error);
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="bg-blush/30 py-[60px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center font-heading text-2xl font-bold text-cocoa sm:text-3xl">
          {t("reviewsTitle")}
        </h2>

        {/* Desktop: 3-column grid, Mobile: horizontal scroll */}
        <div className="hidden gap-6 md:grid md:grid-cols-3">
          {reviews.slice(0, 3).map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
        <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto md:hidden">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="w-[80%] flex-shrink-0 snap-start"
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const excerpt =
    review.body.length > 120
      ? review.body.slice(0, 120) + "..."
      : review.body;

  return (
    <div className="rounded-2xl bg-blush/20 p-6">
      <div className="mb-3 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < review.rating
                ? "fill-amber-400 text-amber-400"
                : "fill-none text-warm-gray/40"
            }`}
          />
        ))}
      </div>
      <p className="mb-4 text-sm leading-relaxed text-cocoa/80">
        &ldquo;{excerpt}&rdquo;
      </p>
      <p className="text-sm font-semibold text-cocoa">{review.authorName}</p>
    </div>
  );
}
