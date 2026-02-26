"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X, LogOut, Package, LogIn, Shield, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

function getLoginMethod(providerData: { providerId: string }[]): string {
  const providerId = providerData[0]?.providerId;
  if (providerId === "google.com") return "Google";
  if (providerId === "password") return "Email";
  return providerId ?? "Unknown";
}

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
            <SheetContent side="right">
              <SheetHeader className="border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <Image
                    src="/icon.png"
                    alt="Cosy Loops logo"
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                  <SheetTitle className="font-heading text-lg text-cocoa">
                    Cosy Loops
                  </SheetTitle>
                </div>
              </SheetHeader>

              <nav className="flex flex-col gap-1 px-2">
                {navLinks.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "rounded-xl px-3 py-3 text-lg font-medium transition-colors",
                        active
                          ? "bg-blush text-cocoa"
                          : "text-warm-gray hover:bg-blush/50 hover:text-cocoa"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <Separator className="my-2 mx-2" />

              <nav className="flex flex-col gap-1 px-2">
                {!loading && user ? (
                  <>
                    <div className="flex items-center gap-3 rounded-xl bg-blush/30 px-3 py-3">
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt=""
                          width={36}
                          height={36}
                          className="rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-soft-pink text-sm font-bold text-white">
                          {(user.displayName ?? user.email ?? "?")[0].toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-cocoa">
                          {user.displayName ?? "User"}
                        </p>
                        <p className="truncate text-xs text-warm-gray">
                          {user.email}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5">
                          {user.providerData[0]?.providerId === "google.com" ? (
                            <svg className="h-3 w-3" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                          ) : (
                            <Mail className="h-3 w-3 text-warm-gray" />
                          )}
                          <span className="text-[10px] text-warm-gray">
                            {getLoginMethod(user.providerData)}
                          </span>
                          {userDoc?.role === "admin" && (
                            <span className="ml-auto rounded bg-soft-pink/20 px-1.5 py-0.5 text-[10px] font-semibold text-soft-pink">
                              Admin
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/account/"
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                        pathname === "/account/"
                          ? "bg-blush text-cocoa"
                          : "text-warm-gray hover:bg-blush/50 hover:text-cocoa"
                      )}
                    >
                      <Package className="h-4 w-4" />
                      {t("myOrders")}
                    </Link>
                    {userDoc?.role === "admin" && (
                      <Link
                        href="/admin/"
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                          pathname.startsWith("/admin")
                            ? "bg-blush text-cocoa"
                            : "text-warm-gray hover:bg-blush/50 hover:text-cocoa"
                        )}
                      >
                        <Shield className="h-4 w-4" />
                        {t("admin")}
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        signOut();
                        setMobileOpen(false);
                      }}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-warm-gray transition-colors hover:bg-blush/50 hover:text-cocoa"
                    >
                      <LogOut className="h-4 w-4" />
                      {t("signOut")}
                    </button>
                  </>
                ) : !loading ? (
                  <Link
                    href="/account/login/"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-warm-gray transition-colors hover:bg-blush/50 hover:text-cocoa"
                  >
                    <LogIn className="h-4 w-4" />
                    {t("signIn")}
                  </Link>
                ) : null}
              </nav>

              <SheetFooter>
                <LocaleSwitcher />
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
