"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Heart, ShoppingBag, Instagram, Mail } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t bg-gradient-to-b from-white to-blush/30">
      {/* Main footer content */}
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-heading text-lg font-bold text-cocoa">
              Cosy Loops
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-warm-gray">
              {t("tagline")}
            </p>
          </div>

          {/* Shop column */}
          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-cocoa">
              {t("shopHeading")}
            </h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href={"/" as const}
                  className="text-sm text-warm-gray transition-colors hover:text-cocoa"
                >
                  {t("shop")}
                </Link>
              </li>
              <li>
                <Link
                  href={"/about/" as const}
                  className="text-sm text-warm-gray transition-colors hover:text-cocoa"
                >
                  {t("about")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Info column */}
          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-cocoa">
              {t("infoHeading")}
            </h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href={"/shipping/" as const}
                  className="text-sm text-warm-gray transition-colors hover:text-cocoa"
                >
                  {t("shipping")}
                </Link>
              </li>
              <li>
                <Link
                  href={"/faq/" as const}
                  className="text-sm text-warm-gray transition-colors hover:text-cocoa"
                >
                  {t("faq")}
                </Link>
              </li>
              <li>
                <Link
                  href={"/returns/" as const}
                  className="text-sm text-warm-gray transition-colors hover:text-cocoa"
                >
                  {t("returns")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect column */}
          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-cocoa">
              {t("connectHeading")}
            </h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href={"/contact/" as const}
                  className="inline-flex items-center gap-1.5 text-sm text-warm-gray transition-colors hover:text-cocoa"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {t("contact")}
                </Link>
              </li>
              <li>
                <a
                  href="https://www.etsy.com/uk/shop/littleyinshop?ref=shop_profile&listing_id=4399333295"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-warm-gray transition-colors hover:text-cocoa"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  {t("etsy")}
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-warm-gray transition-colors hover:text-cocoa"
                >
                  <Instagram className="h-3.5 w-3.5" />
                  {t("instagram")}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-soft-pink/50">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-5 sm:flex-row sm:justify-between">
          <p className="text-xs text-warm-gray">{t("copyright")}</p>
          <div className="flex items-center gap-4">
            <Link
              href={"/privacy/" as const}
              className="text-xs text-warm-gray transition-colors hover:text-cocoa"
            >
              {t("privacy")}
            </Link>
            <span className="text-warm-gray/40">|</span>
            <Link
              href={"/terms/" as const}
              className="text-xs text-warm-gray transition-colors hover:text-cocoa"
            >
              {t("terms")}
            </Link>
          </div>
          <p className="flex items-center gap-1 text-xs text-warm-gray">
            {t("madeWith")}
            <Heart className="h-3 w-3 fill-soft-pink text-soft-pink" />
            {t("inUK")}
          </p>
        </div>
      </div>
    </footer>
  );
}
