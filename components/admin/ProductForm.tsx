"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { apiPost } from "@/lib/api";
import type { Product, MediaItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { toast } from "sonner";

interface ProductFormProps {
  product?: Product;
}

function legacyImagesToMedia(images: string[]): MediaItem[] {
  return images.map((url) => ({ type: "image" as const, url }));
}

function mediaToImages(media: MediaItem[]): string[] {
  return media.filter((m) => m.type === "image").map((m) => m.url);
}

export function ProductForm({ product }: ProductFormProps) {
  const t = useTranslations("admin");
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [stock, setStock] = useState(product?.stock?.toString() ?? "0");
  const [categorySlug, setCategorySlug] = useState(
    product?.categorySlug ?? ""
  );
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [media, setMedia] = useState<MediaItem[]>(
    product?.media?.length
      ? product.media
      : legacyImagesToMedia(product?.images ?? [])
  );
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const data = {
        name,
        slug,
        description,
        price: parseInt(price) || 0,
        stock: parseInt(stock) || 0,
        categorySlug,
        isActive,
        images: mediaToImages(media),
        media,
      };

      if (isEdit) {
        await apiPost("update-product", { id: product.id, ...data });
        toast.success(t("productUpdated"));
      } else {
        await apiPost("create-product", data);
        toast.success(t("productCreated"));
      }
      router.push("/admin/products/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failedToSave"));
    } finally {
      setSaving(false);
    }
  }

  function generateSlug() {
    setSlug(
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{t("productName")}</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => !isEdit && !slug && generateSlug()}
            required
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">{t("slug")}</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t("description")}</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="rounded-xl"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="price">{t("price")} {t("pence")}</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">{t("stock")}</Label>
          <Input
            id="stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">{t("category")}</Label>
          <Input
            id="category"
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="rounded"
        />
        <Label htmlFor="isActive">{t("active")}</Label>
      </div>

      <div className="space-y-2">
        <Label>{t("media")}</Label>
        <MediaUploader
          media={media}
          onMediaChange={setMedia}
          productSlug={slug}
        />
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
          onClick={() => router.push("/admin/products/")}
        >
          {t("cancel")}
        </Button>
      </div>
    </form>
  );
}
