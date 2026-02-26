"use client";

import { useState } from "react";
import Image from "next/image";
import { LogOut, Package, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth-context";
import { CartIcon } from "@/components/layout/CartIcon";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { MobileNav } from "@/components/layout/MobileNav";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user, userDoc, signOut, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("nav");

  const navLinks = [
    { href: "/shop/" as const, label: t("shop") },
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
            src="/icon.png"
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
          <div className="hidden md:block">
            <LocaleSwitcher />
          </div>
          <CartIcon />

          {/* Desktop user menu */}
          <div className="hidden md:block">
            {!loading && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 rounded-full"
                    aria-label={t("userMenu")}
                  >
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt=""
                        width={24}
                        height={24}
                        className="rounded-full"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-soft-pink text-xs font-bold text-white">
                        {(user.displayName ?? user.email ?? "?")[0].toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-medium text-cocoa">
                      {user.displayName ?? user.email?.split("@")[0] ?? ""}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 text-xs text-warm-gray">
                    {user.email}
                    {userDoc?.role === "admin" && (
                      <span className="ml-1 rounded bg-soft-pink/20 px-1.5 py-0.5 text-[10px] font-semibold text-soft-pink">
                        Admin
                      </span>
                    )}
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/account/" className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      {t("myOrders")}
                    </Link>
                  </DropdownMenuItem>
                  {userDoc?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
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
          </div>

          <MobileNav
            navLinks={navLinks}
            user={user}
            userDoc={userDoc}
            loading={loading}
            signOut={signOut}
            pathname={pathname}
            t={t}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />
        </div>
      </nav>
    </header>
  );
}
