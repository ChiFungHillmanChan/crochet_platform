import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";

const CartContent = dynamic(
  () => import("@/components/shop/CartContent"),
  {
    loading: () => (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="h-8 w-32 animate-pulse rounded bg-blush/30" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-2xl bg-blush/20"
            />
          ))}
        </div>
      </main>
    ),
  }
);

export const metadata: Metadata = {
  title: "Shopping Cart",
  robots: { index: false, follow: false },
};

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CartContent />;
}
