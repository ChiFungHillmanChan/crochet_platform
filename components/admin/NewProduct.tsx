"use client";

import { useTranslations } from "next-intl";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProduct() {
  const t = useTranslations("admin");

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-cocoa">
        {t("newProduct")}
      </h1>
      <ProductForm />
    </div>
  );
}
