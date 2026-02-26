"use client";

import { Link } from "@/i18n/navigation";
import { generateBreadcrumbJsonLd, safeJsonLd } from "@/lib/structured-data";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  locale?: string;
}

const SITE_URL = "https://cosyloops.com";

export function Breadcrumbs({ items, locale }: BreadcrumbsProps) {
  const localePrefix = locale ? `/${locale}` : "";
  const jsonLdItems = items
    .filter((item) => item.href)
    .map((item) => ({
      name: item.label,
      url: `${SITE_URL}${localePrefix}${item.href}`,
    }));

  const jsonLd = safeJsonLd(generateBreadcrumbJsonLd(jsonLdItems));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <nav className="mb-6 flex items-center gap-2 text-sm text-warm-gray">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span>&gt;</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-cocoa hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="text-cocoa">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
