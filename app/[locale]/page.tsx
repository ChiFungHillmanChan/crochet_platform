import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { HeroBanner } from "@/components/shop/HeroBanner";

const ShopSection = dynamic(() => import("@/components/shop/ShopSection"), {
  loading: () => (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm"
          >
            <div className="aspect-square bg-blush/30" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-16 rounded bg-blush/50" />
              <div className="h-5 w-3/4 rounded bg-blush/50" />
            </div>
          </div>
        ))}
      </div>
    </section>
  ),
});

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="flex-1">
      <HeroBanner />
      <Suspense>
        <ShopSection />
      </Suspense>
    </main>
  );
}
