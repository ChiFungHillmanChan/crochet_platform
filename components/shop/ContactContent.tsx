"use client";

import { useTranslations } from "next-intl";
import { Mail, Phone, Instagram } from "lucide-react";

export function ContactContent() {
  const t = useTranslations("contact");

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-4 font-heading text-3xl font-bold text-cocoa">
        {t("heading")}
      </h1>
      <p className="mb-10 leading-relaxed text-warm-gray">{t("intro")}</p>

      <div className="grid gap-6 sm:grid-cols-3">
        {/* Email */}
        <div className="rounded-2xl border border-blush bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blush">
            <Mail className="h-5 w-5 text-cocoa" />
          </div>
          <h2 className="font-heading text-sm font-semibold text-cocoa">
            {t("emailTitle")}
          </h2>
          <a
            href={`mailto:${t("emailAddress")}`}
            className="mt-1 block text-soft-pink hover:underline"
          >
            {t("emailAddress")}
          </a>
          <p className="mt-1 text-xs text-warm-gray">{t("responseTime")}</p>
        </div>

        {/* Phone / WhatsApp */}
        <div className="rounded-2xl border border-blush bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blush">
            <Phone className="h-5 w-5 text-cocoa" />
          </div>
          <h2 className="font-heading text-sm font-semibold text-cocoa">
            {t("phoneTitle")}
          </h2>
          <a
            href={`tel:${t("phoneNumber").replace(/\s/g, "")}`}
            className="mt-1 block text-soft-pink hover:underline"
          >
            {t("phoneNumber")}
          </a>
          <p className="mt-1 text-xs text-warm-gray">{t("phoneNote")}</p>
        </div>

        {/* Instagram */}
        <div className="rounded-2xl border border-blush bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blush">
            <Instagram className="h-5 w-5 text-cocoa" />
          </div>
          <h2 className="font-heading text-sm font-semibold text-cocoa">
            {t("instagramTitle")}
          </h2>
          <a
            href={t("instagramUrl")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block text-soft-pink hover:underline"
          >
            {t("instagramHandle")}
          </a>
        </div>
      </div>

      {/* Social blurb */}
      <div className="mt-10 rounded-2xl bg-blush/30 p-6 text-center">
        <h2 className="font-heading text-lg font-semibold text-cocoa">
          {t("socialTitle")}
        </h2>
        <p className="mt-2 leading-relaxed text-warm-gray">
          {t("socialText")}
        </p>
      </div>
    </main>
  );
}
