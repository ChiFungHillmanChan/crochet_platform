"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

const CONSENT_KEY = "cosy-loops-cookie-consent";

export default function CookieConsent() {
  const t = useTranslations("cookie");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  }

  function handleReject() {
    localStorage.setItem(CONSENT_KEY, "rejected");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white p-4 shadow-lg">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-warm-gray">
          {t("message")}{" "}
          <Link href="/privacy/" className="underline hover:text-cocoa">
            {t("learnMore")}
          </Link>
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReject}
            className="rounded-full"
          >
            {t("reject")}
          </Button>
          <Button
            size="sm"
            onClick={handleAccept}
            className="rounded-full bg-soft-pink text-cocoa hover:bg-soft-pink/80"
          >
            {t("accept")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function getCookieConsent(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CONSENT_KEY);
}
