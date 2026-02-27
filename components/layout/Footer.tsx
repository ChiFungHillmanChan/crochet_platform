"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ShoppingBag } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");

  const footerLinks = [
    { href: "/" as const, label: t("shop") },
    { href: "/about/" as const, label: t("about") },
    { href: "/shipping/" as const, label: t("shipping") },
    { href: "/faq/" as const, label: t("faq") },
    { href: "/contact/" as const, label: t("contact") },
    { href: "/privacy/" as const, label: t("privacy") },
    { href: "/terms/" as const, label: t("terms") },
    { href: "/returns/" as const, label: t("returns") },
  ];

  return (
    <footer className="border-t bg-white py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-sm text-warm-gray sm:flex-row sm:justify-between">
        <p>{t("copyright")}</p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <nav className="flex gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-cocoa"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <a
            href="https://www.etsy.com/uk/shop/littleyinshop?ref=shop_profile&listing_id=4399333295"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-cocoa"
          >
            <ShoppingBag className="h-4 w-4" />
            {t("etsy")}
          </a>
        </div>
      </div>
    </footer>
  );
}
