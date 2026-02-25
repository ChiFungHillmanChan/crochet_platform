import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";

const AccountContent = dynamic(
  () => import("@/components/account/AccountContent"),
  {
    loading: () => (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="h-8 w-40 animate-pulse rounded bg-blush/30" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-2xl bg-blush/20"
            />
          ))}
        </div>
      </main>
    ),
  }
);

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false, follow: false },
};

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AccountContent />;
}
