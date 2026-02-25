"use client";

import { AdminGuard } from "@/components/layout/AdminGuard";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-[calc(100vh-8rem)]">
        <AdminSidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </AdminGuard>
  );
}
