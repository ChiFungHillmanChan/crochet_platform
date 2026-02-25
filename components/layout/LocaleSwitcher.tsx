"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { type Locale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("locale");

  function handleSwitch() {
    const nextLocale = locale === "en" ? "zh-hk" : "en";
    router.replace(pathname, { locale: nextLocale as Locale });
  }

  const nextLocale = locale === "en" ? "zh-hk" : "en";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSwitch}
      className="rounded-full px-3 text-sm font-medium text-cocoa"
      aria-label={`Switch to ${nextLocale === "en" ? "English" : "Cantonese"}`}
    >
      {t(nextLocale)}
    </Button>
  );
}
