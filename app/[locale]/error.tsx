"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center py-20">
      <div className="space-y-4 text-center">
        <h2 className="font-heading text-2xl font-bold text-cocoa">
          Something went wrong
        </h2>
        <p className="text-warm-gray">
          We&apos;re sorry, something unexpected happened.
        </p>
        <Button
          onClick={reset}
          className="rounded-full bg-soft-pink text-cocoa hover:bg-soft-pink/80"
        >
          Try again
        </Button>
      </div>
    </main>
  );
}
