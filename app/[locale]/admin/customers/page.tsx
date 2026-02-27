import { setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";

const CustomerTable = dynamic(() => import("@/components/admin/CustomerTable"));

export const metadata: Metadata = {
  title: "Customers",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function CustomersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CustomerTable />;
}
