import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";

const AdminPaymentLinks = dynamic(
  () => import("@/components/admin/AdminPaymentLinks"),
  {
    loading: () => (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-blush/30" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl bg-blush/20"
            />
          ))}
        </div>
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: "Payment Links",
  robots: { index: false, follow: false },
};

export default async function AdminPaymentLinksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AdminPaymentLinks />;
}
