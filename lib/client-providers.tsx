"use client";

import { AuthProvider } from "@/lib/auth-context";
import { useCartSync } from "@/lib/cart-sync";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/sonner";

function CartSync() {
  useCartSync();
  return null;
}

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartSync />
      <Navbar />
      {children}
      <Toaster position="top-right" />
    </AuthProvider>
  );
}
