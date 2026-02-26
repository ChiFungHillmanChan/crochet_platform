"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

// ASSUMPTION: No email service integration yet. Change to API endpoint when ready.
export function NewsletterSignup() {
  const t = useTranslations("homepage");
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    window.location.href = `mailto:hello@cosyloops.com?subject=Newsletter Signup&body=Please add ${encodeURIComponent(email)} to your newsletter.`;
    setEmail("");
  }

  return (
    <section className="py-[60px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-blush/30 px-6 py-10 sm:px-12 sm:py-14 md:flex md:items-center md:justify-between md:gap-12">
          <div className="mb-6 md:mb-0 md:flex-1">
            <h2 className="font-heading text-2xl font-bold text-cocoa sm:text-3xl">
              {t("newsletterTitle")}
            </h2>
            <p className="mt-2 text-warm-gray">{t("newsletterSubtitle")}</p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex gap-3 md:flex-1 md:max-w-md"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              required
              className="flex-1 rounded-full border border-blush bg-white px-5 py-3 text-sm text-cocoa placeholder:text-warm-gray/60 focus:border-soft-pink focus:outline-none focus:ring-2 focus:ring-soft-pink/30"
            />
            <Button
              type="submit"
              className="rounded-full bg-soft-pink px-6 text-cocoa hover:bg-soft-pink/80"
            >
              {t("subscribe")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
