"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LayoutDashboard, Package, ShoppingCart, Menu } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const adminLinks = [
  { href: "/admin/" as const, labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/admin/products/" as const, labelKey: "products", icon: Package },
  { href: "/admin/orders/" as const, labelKey: "orders", icon: ShoppingCart },
];

function AdminNavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const t = useTranslations("admin");

  return (
    <nav className="flex flex-col gap-1 px-3">
      {adminLinks.map((link) => {
        const active =
          pathname === link.href ||
          (link.href !== "/admin/" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-blush text-cocoa"
                : "text-warm-gray hover:bg-blush/50 hover:text-cocoa"
            )}
          >
            <link.icon className="h-4 w-4" />
            {t(link.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  const t = useTranslations("admin");

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-white md:flex md:flex-col">
      <div className="p-6">
        <h2 className="font-heading text-lg font-bold text-cocoa">
          {t("title")}
        </h2>
      </div>
      <AdminNavLinks />
    </aside>
  );
}

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("admin");

  return (
    <div className="mb-4 flex items-center gap-3 md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open admin menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader className="border-b border-border pb-4">
            <SheetTitle className="font-heading text-lg text-cocoa">
              {t("title")}
            </SheetTitle>
          </SheetHeader>
          <AdminNavLinks onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <h2 className="font-heading text-lg font-bold text-cocoa">
        {t("title")}
      </h2>
    </div>
  );
}
