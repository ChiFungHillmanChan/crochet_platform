import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { buildOpenGraph } from "@/lib/seo";
import { AboutContent } from "@/components/about/AboutContent";

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
  const t = await getTranslations({ locale, namespace: "about" });

  const title = t("seoTitle");
  const description = t("seoDescription");

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/about/`,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE_URL}/${l}/about/`])
        ),
        "x-default": `${SITE_URL}/en/about/`,
      },
    },
    openGraph: buildOpenGraph(locale, "/about/", title, description),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutContent />;
}
