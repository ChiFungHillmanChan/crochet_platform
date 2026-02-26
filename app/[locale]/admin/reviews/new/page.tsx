import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";

const NewReview = dynamic(
  () => import("@/components/admin/NewReview"),
  {
    loading: () => (
      <div className="space-y-6">
        <div className="h-8 w-40 animate-pulse rounded bg-blush/30" />
        <div className="h-96 animate-pulse rounded-2xl bg-blush/20" />
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: "New Review",
  robots: { index: false, follow: false },
};

export default async function NewReviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <NewReview />;
}
