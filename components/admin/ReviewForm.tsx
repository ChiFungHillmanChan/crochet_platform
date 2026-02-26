"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { apiPost } from "@/lib/api";
import type { Review } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ReviewFormProps {
  review?: Review;
}

export function ReviewForm({ review }: ReviewFormProps) {
  const t = useTranslations("admin");
  const router = useRouter();
  const isEdit = !!review;

  const [productId, setProductId] = useState(review?.productId ?? "");
  const [authorName, setAuthorName] = useState(review?.authorName ?? "");
  const [rating, setRating] = useState(review?.rating?.toString() ?? "5");
  const [body, setBody] = useState(review?.body ?? "");
  const [isApproved, setIsApproved] = useState(review?.isApproved ?? false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const data = {
        productId,
        authorName,
        rating: Math.min(5, Math.max(1, parseInt(rating) || 1)),
        body,
        isApproved,
      };

      if (isEdit) {
        await apiPost("update-review", { id: review.id, ...data });
        toast.success(t("reviewUpdated"));
      } else {
        await apiPost("create-review", data);
        toast.success(t("reviewCreated"));
      }
      router.push("/admin/reviews/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failedToSave"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="productId">{t("productId")}</Label>
          <Input
            id="productId"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="authorName">{t("reviewer")}</Label>
          <Input
            id="authorName"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="rating">{t("rating")}</Label>
        <Input
          id="rating"
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
          className="rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">{t("reviewBody")}</Label>
        <Textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          className="rounded-xl"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isApproved"
          checked={isApproved}
          onChange={(e) => setIsApproved(e.target.checked)}
          className="rounded"
        />
        <Label htmlFor="isApproved">{t("approved")}</Label>
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={saving}
          className="rounded-full bg-soft-pink text-cocoa hover:bg-soft-pink/80"
        >
          {saving
            ? t("saving")
            : isEdit
              ? t("save")
              : t("create")}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          onClick={() => router.push("/admin/reviews/")}
        >
          {t("cancel")}
        </Button>
      </div>
    </form>
  );
}
