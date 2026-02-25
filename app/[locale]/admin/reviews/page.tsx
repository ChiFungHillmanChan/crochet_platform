import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";

const AdminReviews = dynamic(
  () => import("@/components/admin/AdminReviews"),
  {
    loading: () => (
      <div className="space-y-6">
        <div className="h-8 w-32 animate-pulse rounded bg-blush/30" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-xl bg-blush/20"
            />
          ))}
        </div>
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: "Reviews Management",
  robots: { index: false, follow: false },
};

export default async function AdminReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AdminReviews />;
}
