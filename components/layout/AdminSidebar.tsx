"use client";

import { useTranslations } from "next-intl";
import { LayoutDashboard, Package, ShoppingCart } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();
  const t = useTranslations("admin");

  const adminLinks = [
    { href: "/admin/" as const, label: t("dashboard"), icon: LayoutDashboard },
    { href: "/admin/products/" as const, label: t("products"), icon: Package },
    { href: "/admin/orders/" as const, label: t("orders"), icon: ShoppingCart },
  ];

  return (
    <aside className="w-64 shrink-0 border-r bg-white">
      <div className="p-6">
        <h2 className="font-heading text-lg font-bold text-cocoa">
          {t("title")}
        </h2>
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {adminLinks.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/admin/" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-blush text-cocoa"
                  : "text-warm-gray hover:bg-blush/50 hover:text-cocoa"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
