"use client";

import { useTranslations } from "next-intl";
import { generateFaqPageJsonLd, safeJsonLd } from "@/lib/structured-data";

const FAQ_KEYS = ["1", "2", "3", "4", "5", "6"] as const;

export function FaqContent() {
  const t = useTranslations("faq");

  const faqs = FAQ_KEYS.map((key) => ({
    question: t(`q${key}`),
    answer: t(`a${key}`),
  }));
  // JSON-LD from trusted i18n strings, sanitized via safeJsonLd (escapes <)
  const faqJsonLd = safeJsonLd(generateFaqPageJsonLd(faqs));

  return (
    <>
      {/* Safe: safeJsonLd escapes < to prevent script injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqJsonLd }}
      />
      <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 font-heading text-3xl font-bold text-cocoa">
        {t("heading")}
      </h1>
      <div className="space-y-6">
        {FAQ_KEYS.map((key) => (
          <div key={key} className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-cocoa">
              {t(`q${key}`)}
            </h2>
            <p className="mt-2 leading-relaxed text-warm-gray">
              {t(`a${key}`)}
            </p>
          </div>
        ))}
      </div>
    </main>
    </>
  );
}
