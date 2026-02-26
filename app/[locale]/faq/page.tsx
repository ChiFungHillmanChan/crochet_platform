import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { buildOpenGraph } from "@/lib/seo";
import { FaqContent } from "@/components/shop/FaqContent";

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
  const t = await getTranslations({ locale, namespace: "faq" });

  const title = t("seoTitle");
  const description = t("seoDescription");

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/faq/`,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE_URL}/${l}/faq/`])
        ),
        "x-default": `${SITE_URL}/en/faq/`,
      },
    },
    openGraph: buildOpenGraph(locale, "/faq/", title, description),
  };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <FaqContent />;
}
