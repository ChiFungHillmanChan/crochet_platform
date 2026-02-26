"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function HeroBanner() {
  const t = useTranslations("homepage");

  return (
    <section className="relative min-h-[70vh] overflow-hidden">
      {/* Full-width background image */}
      <div className="absolute inset-0">
        <picture>
          <source
            media="(max-width: 768px)"
            srcSet="/banners/hero-banner-mobile.png"
          />
          <img
            src="/banners/hero-banner-desktop.png"
            alt=""
            className="h-full w-full object-cover"
          />
        </picture>
      </div>

      {/* Gradient overlay for text readability — right side */}
      <div className="absolute inset-0 bg-gradient-to-l from-white/80 via-white/60 to-transparent md:from-white/70 md:via-white/40" />

      {/* Text content overlay — right-aligned */}
      <div className="relative flex min-h-[70vh] items-center">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="ml-auto max-w-lg space-y-6 text-right">
            <Image
              src="/generated/icon-removebg-preview.png"
              alt="Cosy Loops"
              width={72}
              height={72}
              className="ml-auto drop-shadow-md"
              priority
            />
            <h1 className="font-heading text-4xl font-bold text-cocoa md:text-5xl lg:text-6xl">
              {t("heroHeadline")}
            </h1>
            <p className="text-lg text-cocoa/70 md:text-xl">
              {t("heroSubtitle")}
            </p>
            <Link href="/shop">
              <Button
                size="lg"
                className="rounded-full bg-soft-pink px-8 text-cocoa shadow-md transition-all hover:-translate-y-0.5 hover:bg-soft-pink/80 hover:shadow-lg"
              >
                {t("heroCta")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
