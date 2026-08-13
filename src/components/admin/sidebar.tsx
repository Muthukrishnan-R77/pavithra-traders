"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  DollarSign,
  History,
  Warehouse,
  Users,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

export const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/prices", label: "Price Management", icon: DollarSign },
  { href: "/admin/price-history", label: "Price History", icon: History },
  { href: "/admin/inventory", label: "Inventory", icon: Warehouse },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface AdminSidebarProps {
  variant?: "desktop" | "drawer";
  onNavigate?: () => void;
  onClose?: () => void;
  className?: string;
}

export function AdminSidebar({
  variant = "desktop",
  onNavigate,
  onClose,
  className,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const isDrawer = variant === "drawer";

  return (
    <aside
      className={cn(
        "flex h-full flex-col bg-[#111827] text-white",
        isDrawer ? "w-64 max-w-[85vw]" : "fixed left-0 top-0 z-40 h-screen w-64",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <Link href="/admin" className="block min-w-0" onClick={onNavigate}>
          <Image
            src="/logo.png"
            alt="Pavithra Traders"
            width={160}
            height={64}
            className={cn(
              "w-auto rounded-md bg-white/95 object-contain p-1",
              isDrawer ? "h-10" : "h-12"
            )}
          />
        </Link>
        {isDrawer && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-300 hover:bg-white/10 hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {sidebarLinks.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition",
                active
                  ? "bg-[#F59E0B] text-[#111827]"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            signOut({ callbackUrl: "/admin/login" });
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-300 hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}
