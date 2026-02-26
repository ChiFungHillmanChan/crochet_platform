"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center py-20">
      <div className="space-y-4 text-center">
        <h2 className="font-heading text-2xl font-bold text-cocoa">
          {t("somethingWentWrong")}
        </h2>
        <p className="text-warm-gray">
          {t("unexpectedError")}
        </p>
        <Button
          onClick={reset}
          className="rounded-full bg-soft-pink text-cocoa hover:bg-soft-pink/80"
        >
          {t("tryAgain")}
        </Button>
      </div>
    </main>
  );
}
