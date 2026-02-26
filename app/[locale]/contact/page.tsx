import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { buildOpenGraph } from "@/lib/seo";
import { ContactContent } from "@/components/shop/ContactContent";

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
  const t = await getTranslations({ locale, namespace: "contact" });

  const title = t("seoTitle");
  const description = t("seoDescription");

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/contact/`,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE_URL}/${l}/contact/`])
        ),
        "x-default": `${SITE_URL}/en/contact/`,
      },
    },
    openGraph: buildOpenGraph(locale, "/contact/", title, description),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ContactContent />;
}
