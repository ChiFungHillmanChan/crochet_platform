"use client";

import { useTranslations } from "next-intl";
import { Mail, MessageCircle } from "lucide-react";

export function ContactContent() {
  const t = useTranslations("contact");

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 font-heading text-3xl font-bold text-cocoa">
        {t("heading")}
      </h1>
      <p className="mb-8 leading-relaxed text-warm-gray">{t("intro")}</p>

      <div className="space-y-8">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blush">
            <Mail className="h-5 w-5 text-cocoa" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-semibold text-cocoa">
              {t("emailTitle")}
            </h2>
            <a
              href={`mailto:${t("emailAddress")}`}
              className="mt-1 inline-block text-soft-pink hover:underline"
            >
              {t("emailAddress")}
            </a>
            <p className="mt-1 text-sm text-warm-gray">{t("responseTime")}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blush">
            <MessageCircle className="h-5 w-5 text-cocoa" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-semibold text-cocoa">
              {t("socialTitle")}
            </h2>
            <p className="mt-1 leading-relaxed text-warm-gray">
              {t("socialText")}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
