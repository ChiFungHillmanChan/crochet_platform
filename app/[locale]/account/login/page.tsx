import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";

const LoginContent = dynamic(
  () => import("@/components/auth/LoginContent"),
  {
    loading: () => (
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="h-96 w-full max-w-md animate-pulse rounded-3xl bg-blush/20" />
      </main>
    ),
  }
);

export const metadata: Metadata = {
  title: "Sign In",
};

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LoginContent />;
}
