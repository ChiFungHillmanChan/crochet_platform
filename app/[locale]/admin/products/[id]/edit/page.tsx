import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { routing } from "@/i18n/routing";

const EditProduct = dynamic(
  () => import("@/components/admin/EditProductClientWrapper"),
  {
    loading: () => (
      <div className="space-y-6">
        <div className="h-8 w-40 animate-pulse rounded bg-blush/30" />
        <div className="h-96 animate-pulse rounded-2xl bg-blush/20" />
      </div>
    ),
  }
);

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => [
    { locale, id: "placeholder" },
  ]);
}

export const metadata: Metadata = {
  title: "Edit Product",
  robots: { index: false, follow: false },
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <EditProduct />;
}
