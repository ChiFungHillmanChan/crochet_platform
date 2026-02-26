"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

const INSTAGRAM_URL = "https://www.instagram.com/cosyloops";

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

        {/* Desktop: 6 squares, Mobile: 3 visible + scroll */}
        <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto md:grid md:grid-cols-6 md:gap-4">
          {PLACEHOLDER_COLOURS.map((gradient, i) => (
            <div
              key={i}
              className="w-[30%] flex-shrink-0 snap-start md:w-auto"
            >
              <div
                className={`aspect-square rounded-xl bg-gradient-to-br ${gradient}`}
              />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
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
