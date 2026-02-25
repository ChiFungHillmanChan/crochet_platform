"use client";

import { useTranslations } from "next-intl";
import { Package, Clock, RotateCcw, AlertTriangle } from "lucide-react";

export function ShippingContent() {
  const t = useTranslations("shipping");

  const sections = [
    { icon: Package, titleKey: "shippingTitle", textKey: "shippingText" },
    { icon: Clock, titleKey: "processingTitle", textKey: "processingText" },
    { icon: RotateCcw, titleKey: "returnsTitle", textKey: "returnsText" },
    { icon: AlertTriangle, titleKey: "damageTitle", textKey: "damageText" },
  ];

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 font-heading text-3xl font-bold text-cocoa">
        {t("heading")}
      </h1>
      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.titleKey} className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blush">
              <section.icon className="h-5 w-5 text-cocoa" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-cocoa">
                {t(section.titleKey)}
              </h2>
              <p className="mt-1 leading-relaxed text-warm-gray">
                {t(section.textKey)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
