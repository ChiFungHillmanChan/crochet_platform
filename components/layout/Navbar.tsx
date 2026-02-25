"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X, User, LogOut, Package } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth-context";
import { CartIcon } from "@/components/layout/CartIcon";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const { user, userDoc, signOut, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations("nav");

  const navLinks = [
    { href: "/" as const, label: t("shop") },
    { href: "/about/" as const, label: t("about") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-xl font-bold text-cocoa"
        >
          <Image
            src="/generated/icon.png"
            alt="Cosy Loops logo"
            width={32}
            height={32}
            className="rounded-full"
            priority
          />
          Cosy Loops
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-warm-gray transition-colors hover:text-cocoa"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <CartIcon />

          {!loading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  aria-label={t("userMenu")}
                >
                  <User className="h-5 w-5 text-cocoa" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/account/" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    {t("myOrders")}
                  </Link>
                </DropdownMenuItem>
                {userDoc?.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {t("admin")}
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  {t("signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : !loading ? (
            <Link href="/account/login/">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-sm text-cocoa"
              >
                {t("signIn")}
              </Button>
            </Link>
          ) : null}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label={t("openMenu")}
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="mt-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-lg font-medium text-cocoa"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
