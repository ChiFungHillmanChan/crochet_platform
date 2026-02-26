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

      {/* Gradient overlay — bottom on mobile, right on desktop */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent md:bg-gradient-to-l md:from-white/80 md:via-white/50 md:to-transparent" />

      {/* Desktop: text right-aligned, vertically centered */}
      <div className="relative hidden min-h-[70vh] items-center md:flex">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="ml-auto max-w-lg space-y-6 text-right">
            <Image
              src="/icons/icon-removebg-preview.png"
              alt="Cosy Loops"
              width={72}
              height={72}
              className="ml-auto drop-shadow-md"
              loading="eager"
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

      {/* Mobile: text at bottom, centered */}
      <div className="relative flex min-h-[70vh] items-end md:hidden">
        <div className="w-full px-6 pb-10 pt-4 text-center">
          <Image
            src="/icons/icon-removebg-preview.png"
            alt="Cosy Loops"
            width={56}
            height={56}
            className="mx-auto mb-4 drop-shadow-md"
            loading="eager"
          />
          <h1 className="font-heading text-3xl font-bold text-cocoa">
            {t("heroHeadline")}
          </h1>
          <p className="mt-2 text-base text-cocoa/70">
            {t("heroSubtitle")}
          </p>
          <Link href="/shop">
            <Button
              size="lg"
              className="mt-4 rounded-full bg-soft-pink px-8 text-cocoa shadow-md"
            >
              {t("heroCta")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
