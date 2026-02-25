"use client";

import { useTranslations } from "next-intl";
import { ReviewForm } from "@/components/admin/ReviewForm";

export default function NewReview() {
  const t = useTranslations("admin");

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-cocoa">
        {t("newReview")}
      </h1>
      <ReviewForm />
    </div>
  );
}
