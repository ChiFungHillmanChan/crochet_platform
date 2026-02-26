"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth-context";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, userDoc, loading } = useAuth();
  const router = useRouter();
  const t = useTranslations("common");

  useEffect(() => {
    if (!loading && (!user || userDoc?.role !== "admin")) {
      router.push("/");
    }
  }, [user, userDoc, loading, router]);

  if (loading || !user || userDoc?.role !== "admin") {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-warm-gray">{t("loading")}</p>
      </main>
    );
  }

  return <>{children}</>;
}
