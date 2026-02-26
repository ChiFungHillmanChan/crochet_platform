"use client";

import { useTranslations } from "next-intl";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

const INSTAGRAM_URL = "https://www.instagram.com/littleyinshop_/";

const PLACEHOLDER_COLOURS = [
  "from-soft-pink/40 to-blush/60",
  "from-lavender/40 to-soft-pink/30",
  "from-butter/40 to-soft-pink/20",
  "from-blush/50 to-lavender/30",
  "from-soft-pink/30 to-butter/40",
  "from-lavender/30 to-blush/50",
];

export default function InstagramFeed() {
  const t = useTranslations("homepage");

  return (
    <section className="py-[60px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center font-heading text-2xl font-bold text-cocoa sm:text-3xl">
          {t("instagramTitle")} {t("instagramHandle")}
        </h2>

        <div className="relative">
          <div className="grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-4">
            {PLACEHOLDER_COLOURS.map((gradient, i) => (
              <div
                key={i}
                className={`aspect-square rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}
              >
                <Camera className="h-6 w-6 text-cocoa/15 sm:h-8 sm:w-8" />
              </div>
            ))}
          </div>

          <p className="mt-4 text-center text-sm text-warm-gray">
            {t("instagramComingSoon")}
          </p>
        </div>

        <div className="mt-6 text-center">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="rounded-full border-blush px-6 text-cocoa hover:bg-blush/20"
            >
              {t("instagramCta")}
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
