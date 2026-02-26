import { setRequestLocale, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { ClientProviders } from "@/lib/client-providers";
import { Footer } from "@/components/layout/Footer";
import {
  generateWebsiteJsonLd,
  generateOrganizationJsonLd,
} from "@/lib/structured-data";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";

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
  const t = await getTranslations({ locale, namespace: "home" });

  return {
    title: t("seoTitle"),
    description: t("seoDescription"),
    alternates: {
      canonical: `${SITE_URL}/${locale}/`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${SITE_URL}/${l}/`])
      ),
    },
    openGraph: {
      locale: locale === "en" ? "en_GB" : "zh_HK",
      url: `${SITE_URL}/${locale}/`,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = (await import(`../../messages/${locale}.json`)).default;

  // JSON-LD structured data is generated from trusted internal functions,
  // not from user input, so dangerouslySetInnerHTML is safe here.
  const websiteJsonLd = JSON.stringify(generateWebsiteJsonLd());
  const organizationJsonLd = JSON.stringify(generateOrganizationJsonLd());

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ClientProviders>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: websiteJsonLd }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: organizationJsonLd }}
        />
        <AnnouncementBar />
        <div className="flex-1">{children}</div>
        <Footer />
      </ClientProviders>
    </NextIntlClientProvider>
  );
}
