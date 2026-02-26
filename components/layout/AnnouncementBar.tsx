"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

const STORAGE_KEY = "announcement-dismissed";
const ROTATE_INTERVAL = 4000;

export function AnnouncementBar() {
  const t = useTranslations("announcement");
  const [dismissed, setDismissed] = useState(true); // hidden by default to avoid flash
  const [activeIndex, setActiveIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);

  const messages = [t("shipping"), t("newArrivals")];

  useEffect(() => {
    const wasDismissed = localStorage.getItem(STORAGE_KEY) === "true";
    setDismissed(wasDismissed);
  }, []);

  useEffect(() => {
    if (dismissed || messages.length <= 1) return;

    const interval = setInterval(() => {
      setOpacity(0);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % messages.length);
        setOpacity(1);
      }, 300);
    }, ROTATE_INTERVAL);

    return () => clearInterval(interval);
  }, [dismissed, messages.length]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    localStorage.setItem(STORAGE_KEY, "true");
  }, []);

  if (dismissed) return null;

  return (
    <div className="relative flex h-9 items-center justify-center bg-soft-pink text-sm text-cocoa">
      <span
        className="transition-opacity duration-300"
        style={{ opacity }}
      >
        {messages[activeIndex]}
      </span>
      <button
        onClick={handleDismiss}
        className="absolute right-3 p-1 text-cocoa/60 transition-colors hover:text-cocoa"
        aria-label={t("dismiss")}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
