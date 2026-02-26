import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";

const AdminDashboard = dynamic(
  () => import("@/components/admin/AdminDashboard"),
  {
    loading: () => (
      <div className="space-y-8">
        <div className="h-8 w-48 animate-pulse rounded bg-blush/30" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl bg-blush/20"
            />
          ))}
        </div>
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AdminDashboard />;
}
