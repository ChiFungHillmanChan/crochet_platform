"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function HeroBanner() {
  const t = useTranslations("homepage");

  return (
    <section className="relative min-h-[70vh] overflow-hidden bg-gradient-to-b from-blush/30 to-white">
      {/* Desktop: split layout */}
      <div className="hidden md:flex md:min-h-[70vh]">
        {/* Left — banner image (60%) */}
        <div className="relative w-[60%]">
          <picture>
            <source
              media="(max-width: 768px)"
              srcSet="/banners/hero-banner-mobile.png"
            />
            <Image
              src="/banners/hero-banner-desktop.png"
              alt=""
              fill
              className="object-cover"
              priority
              sizes="60vw"
            />
          </picture>
        </div>

        {/* Right — text content (40%) */}
        <div className="flex w-[40%] flex-col items-center justify-center px-8 lg:px-16">
          <div className="max-w-md space-y-6 text-center">
            <Image
              src="/generated/icon-removebg-preview.png"
              alt="Cosy Loops"
              width={72}
              height={72}
              className="mx-auto drop-shadow-md"
              priority
            />
            <h1 className="font-heading text-4xl font-bold text-cocoa lg:text-5xl">
              {t("heroHeadline")}
            </h1>
            <p className="text-lg text-warm-gray">{t("heroSubtitle")}</p>
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

      {/* Mobile: full-width image + text overlay */}
      <div className="relative min-h-[70vh] md:hidden">
        <picture>
          <source
            media="(max-width: 768px)"
            srcSet="/banners/hero-banner-mobile.png"
          />
          <Image
            src="/banners/hero-banner-desktop.png"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </picture>
        <div className="absolute inset-0 flex items-end">
          <div className="w-full rounded-t-3xl bg-white/80 px-6 py-8 text-center backdrop-blur-sm">
            <Image
              src="/generated/icon-removebg-preview.png"
              alt="Cosy Loops"
              width={56}
              height={56}
              className="mx-auto mb-4 drop-shadow-md"
              priority
            />
            <h1 className="font-heading text-3xl font-bold text-cocoa">
              {t("heroHeadline")}
            </h1>
            <p className="mt-2 text-base text-warm-gray">
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
      </div>
    </section>
  );
}
