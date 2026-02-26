import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";

const SuccessContent = dynamic(
  () => import("@/components/shop/CheckoutSuccess"),
  {
    loading: () => (
      <main className="flex flex-1 items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-soft-pink border-t-transparent" />
      </main>
    ),
  }
);

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false, follow: false },
};

export default async function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SuccessContent />;
}
