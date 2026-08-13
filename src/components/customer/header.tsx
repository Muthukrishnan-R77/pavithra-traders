"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Search, MessageCircle, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-context";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "HOME" },
  { href: "/cement", label: "CEMENT" },
  { href: "/steel", label: "STEEL" },
  { href: "/products", label: "PRODUCTS" },
  { href: "/about", label: "ABOUT" },
  { href: "/contact", label: "CONTACT" },
];

export function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 bg-[#111827] shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Pavithra Traders"
            width={140}
            height={56}
            className="h-12 w-auto rounded-md bg-white/95 object-contain p-1"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-semibold tracking-wide transition-colors hover:text-[#F59E0B]",
                pathname === link.href ? "text-[#F59E0B]" : "text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="rounded-lg p-2 text-white transition hover:bg-white/10"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Link>
          <a
            href="https://wa.me/919025644746"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-lg p-2 text-[#F59E0B] transition hover:bg-white/10 sm:block"
            aria-label="WhatsApp"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
          <Link
            href="/cart"
            className="relative rounded-lg p-2 text-[#F59E0B] transition hover:bg-white/10"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#DC2626] text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-white lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-white/10 bg-[#111827] px-4 py-4 lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block py-2 text-sm font-semibold tracking-wide",
                pathname === link.href ? "text-[#F59E0B]" : "text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
