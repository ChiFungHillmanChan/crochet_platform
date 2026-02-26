import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { routing } from "@/i18n/routing";

const ProductDetail = dynamic(
  () => import("@/components/shop/ProductDetailClient"),
  {
    loading: () => (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-2xl bg-blush/30" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-blush/30" />
            <div className="h-6 w-1/4 animate-pulse rounded bg-blush/30" />
            <div className="h-24 w-full animate-pulse rounded bg-blush/30" />
          </div>
        </div>
      </main>
    ),
  }
);

const SITE_URL = "https://cosyloops.com";

// Allow dynamic params in dev; in production the static export only builds
// the placeholder page and CloudFront rewrites unknown slugs to it.
export const dynamicParams = true;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => [
    { locale, slug: "placeholder" },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "product" });

  return {
    title: t("seoTitle"),
    description: t("seoDescription"),
    alternates: {
      canonical: `${SITE_URL}/${locale}/products/${slug}/`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          `${SITE_URL}/${l}/products/${slug}/`,
        ])
      ),
    },
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_GB" : "zh_HK",
      url: `${SITE_URL}/${locale}/products/${slug}/`,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ProductDetail />;
}
