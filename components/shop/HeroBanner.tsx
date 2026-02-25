"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function HeroBanner() {
  const t = useTranslations("home");

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blush/50 via-soft-pink/20 to-white px-4 py-16 text-center md:py-24">
      <Image
        src="/hero-bg.webp"
        alt=""
        fill
        className="object-cover opacity-40"
        priority
        sizes="100vw"
      />
      <div className="relative mx-auto max-w-3xl space-y-6">
        <div className="mx-auto mb-4 flex justify-center">
          <Image
            src="/icon.png"
            alt="Cosy Loops"
            width={80}
            height={80}
            className="drop-shadow-md"
            priority
          />
        </div>
        <h1 className="font-heading text-4xl font-bold text-cocoa md:text-5xl lg:text-6xl">
          {t("heroHeadline")}
        </h1>
        <p className="mx-auto max-w-xl text-lg text-warm-gray">
          {t("title")}
        </p>
        <Link href="#collection">
          <Button
            size="lg"
            className="rounded-full bg-soft-pink px-8 text-cocoa shadow-md transition-all hover:-translate-y-0.5 hover:bg-soft-pink/80 hover:shadow-lg"
          >
            {t("heroCta")}
          </Button>
        </Link>
      </div>
    </section>
  );
}
