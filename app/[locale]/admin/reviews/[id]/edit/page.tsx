import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { routing } from "@/i18n/routing";

const EditReview = dynamic(
  () => import("@/components/admin/EditReviewClient"),
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
  title: "Edit Review",
  robots: { index: false, follow: false },
};

export default async function EditReviewPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <EditReview />;
}
