import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";

const CheckoutContent = dynamic(
  () => import("@/components/shop/CheckoutContent"),
  {
    loading: () => (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="h-8 w-48 animate-pulse rounded bg-blush/30" />
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div className="h-6 w-32 animate-pulse rounded bg-blush/30" />
            <div className="h-10 animate-pulse rounded-xl bg-blush/20" />
            <div className="h-10 animate-pulse rounded-xl bg-blush/20" />
          </div>
          <div className="h-64 animate-pulse rounded-2xl bg-blush/20" />
        </div>
      </main>
    ),
  }
);

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CheckoutContent />;
}
