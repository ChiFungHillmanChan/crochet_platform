import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import ShopContent from "@/components/shop/ShopContent";

const SITE_URL = "https://cosyloops.com";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "shopPage" });

  const title = t("seoTitle");
  const description = t("seoDescription");

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/shop/`,
      ...buildAlternates("/shop/"),
    },
    openGraph: buildOpenGraph(locale, "/shop/", title, description),
  };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    return null;
  }

  setRequestLocale(locale);

  return <ShopContent />;
}
