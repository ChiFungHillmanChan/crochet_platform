import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

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
  const t = await getTranslations({ locale, namespace: "terms" });
  return {
    title: t("seoTitle"),
    description: t("seoDescription"),
    alternates: {
      canonical: `${SITE_URL}/${locale}/terms/`,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE_URL}/${l}/terms/`])
        ),
        "x-default": `${SITE_URL}/en/terms/`,
      },
    },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TermsContent />;
}

function TermsContent() {
  const t = useTranslations("terms");
  const sections = [
    "general",
    "products",
    "pricing",
    "orders",
    "shipping",
    "returns",
    "liability",
    "privacy",
    "changes",
    "contact",
  ] as const;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 font-heading text-3xl font-bold text-cocoa">
        {t("title")}
      </h1>
      <p className="mb-8 text-sm text-warm-gray">
        {t("lastUpdated", { date: "26 February 2026" })}
      </p>
      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section}>
            <h2 className="mb-2 font-heading text-xl font-semibold text-cocoa">
              {t(`sections.${section}`)}
            </h2>
            <p className="leading-relaxed text-warm-gray">
              {t(`sections.${section}Body`, { email: "hello@cosyloops.com" })}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}
