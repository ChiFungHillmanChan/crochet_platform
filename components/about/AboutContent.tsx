"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Heart, Leaf, Sparkles, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const values = [
  { key: "valueHandmade" as const, icon: Heart },
  { key: "valueSustainable" as const, icon: Leaf },
  { key: "valueUnique" as const, icon: Sparkles },
  { key: "valueLocal" as const, icon: MapPin },
];

export function AboutContent() {
  const t = useTranslations("about");

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blush/50 via-soft-pink/20 to-white px-4 py-16 text-center md:py-24">
        <div className="relative mx-auto max-w-3xl space-y-6">
          <Image
            src="/icon.png"
            alt="Cosy Loops"
            width={64}
            height={64}
            className="mx-auto drop-shadow-md"
          />
          <h1 className="font-heading text-4xl font-bold text-cocoa md:text-5xl">
            {t("heading")}
          </h1>
          <p className="mx-auto max-w-xl text-lg text-warm-gray">
            {t("intro")}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <h2 className="mb-4 font-heading text-2xl font-bold text-cocoa">
          {t("storyTitle")}
        </h2>
        <p className="leading-relaxed text-warm-gray">{t("storyText")}</p>
      </section>

      {/* What we make */}
      <section className="bg-blush/20 px-4 py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 font-heading text-2xl font-bold text-cocoa">
            {t("whatWeDoTitle")}
          </h2>
          <p className="leading-relaxed text-warm-gray">
            {t("whatWeDoText")}
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <h2 className="mb-8 text-center font-heading text-2xl font-bold text-cocoa">
          {t("valuesTitle")}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {values.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-soft-pink/20">
                <Icon className="h-5 w-5 text-soft-pink" />
              </div>
              <p className="text-sm font-medium leading-relaxed text-cocoa">
                {t(key)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-t from-blush/50 to-white px-4 py-12 text-center md:py-16">
        <h2 className="mb-6 font-heading text-2xl font-bold text-cocoa">
          {t("ctaTitle")}
        </h2>
        <Link href="/">
          <Button
            size="lg"
            className="rounded-full bg-soft-pink px-8 text-cocoa shadow-md transition-all hover:-translate-y-0.5 hover:bg-soft-pink/80 hover:shadow-lg"
          >
            {t("ctaButton")}
          </Button>
        </Link>
      </section>
    </main>
  );
}
