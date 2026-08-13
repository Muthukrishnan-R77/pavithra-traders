"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, User } from "lucide-react";
import { AdminSidebar } from "@/components/admin/sidebar";

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F3F4F6]">
      {/* Mobile header */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-white/10 bg-[#111827] px-3 md:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="rounded-lg p-2 text-white hover:bg-white/10"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/admin" className="min-w-0 flex-1 px-2 text-center">
          <Image
            src="/logo.png"
            alt="Pavithra Traders"
            width={120}
            height={40}
            className="mx-auto h-8 w-auto object-contain"
            priority
          />
        </Link>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F59E0B]/20 text-[#F59E0B]">
          <User className="h-4 w-4" aria-hidden="true" />
        </div>
      </header>

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <AdminSidebar variant="desktop" />
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[60] bg-black/50 md:hidden"
            onClick={closeDrawer}
            aria-label="Close menu overlay"
          />
          <div className="fixed left-0 top-0 z-[70] h-full md:hidden">
            <AdminSidebar
              variant="drawer"
              onNavigate={closeDrawer}
              onClose={closeDrawer}
            />
          </div>
        </>
      )}

      {/* Main content */}
      <main className="min-h-screen w-full min-w-0 max-w-full pt-14 md:ml-64 md:pt-0">
        <div className="box-border w-full min-w-0 max-w-full p-4 sm:p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
