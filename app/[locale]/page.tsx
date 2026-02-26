import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";
import { HeroBanner } from "@/components/shop/HeroBanner";
import { CollectionCard } from "@/components/shop/CollectionCard";
import { NewsletterSignup } from "@/components/shop/NewsletterSignup";

const NewArrivalsSection = dynamic(
  () => import("@/components/shop/NewArrivalsSection"),
  { loading: () => <SectionSkeleton /> }
);

const BestSellersSection = dynamic(
  () => import("@/components/shop/BestSellersSection"),
  { loading: () => <SectionSkeleton /> }
);

const ReviewCarousel = dynamic(
  () => import("@/components/shop/ReviewCarousel"),
  { loading: () => <SectionSkeleton /> }
);

const InstagramFeed = dynamic(
  () => import("@/components/shop/InstagramFeed"),
  { loading: () => <SectionSkeleton /> }
);

function SectionSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-[60px]">
      <div className="mb-8 h-8 w-48 animate-pulse rounded bg-blush/50" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm"
          >
            <div className="aspect-[3/4] bg-blush/30" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-16 rounded bg-blush/50" />
              <div className="h-5 w-3/4 rounded bg-blush/50" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "homepage" });

  return (
    <main className="flex-1">
      <HeroBanner />

      <Suspense fallback={<SectionSkeleton />}>
        <NewArrivalsSection />
      </Suspense>

      {/* Collection Feature Cards */}
      <section className="py-[60px]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          <CollectionCard
            title={t("collectionPlushies")}
            href="/shop?category=plushies"
            imageSrc="/banners/collection-plushies.png"
            imageAlt={t("collectionPlushies")}
          />
          <CollectionCard
            title={t("collectionCharms")}
            href="/shop?category=charms"
            imageSrc="/banners/collection-charms.png"
            imageAlt={t("collectionCharms")}
          />
          <CollectionCard
            title={t("collectionHome")}
            href="/shop?category=home"
            imageSrc="/banners/collection-home.png"
            imageAlt={t("collectionHome")}
          />
        </div>
      </section>

      <Suspense fallback={<SectionSkeleton />}>
        <BestSellersSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <ReviewCarousel />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <InstagramFeed />
      </Suspense>

      <NewsletterSignup />
    </main>
  );
}
