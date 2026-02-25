"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");

  const footerLinks = [
    { href: "/" as const, label: t("shop") },
    { href: "/about/" as const, label: t("about") },
    { href: "/shipping/" as const, label: t("shipping") },
    { href: "/faq/" as const, label: t("faq") },
    { href: "/contact/" as const, label: t("contact") },
  ];

  return (
    <footer className="border-t bg-white py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-sm text-warm-gray sm:flex-row sm:justify-between">
        <p>{t("copyright")}</p>
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
      </div>
    </footer>
  );
}
