"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";

export function Footer() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <footer className="bg-[#111827] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3 lg:px-8">
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Pavithra Traders"
                width={160}
                height={64}
                className="h-14 w-auto rounded-md bg-white/95 object-contain p-1"
              />
            </Link>
            <p className="mt-3 text-sm text-gray-400">
              Quality Materials. Reliable Prices. Trusted Supply.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-[#F59E0B]">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/" className="hover:text-[#F59E0B]">Home</Link></li>
              <li><Link href="/cement" className="hover:text-[#F59E0B]">Cement</Link></li>
              <li><Link href="/steel" className="hover:text-[#F59E0B]">Steel</Link></li>
              <li><Link href="/products" className="hover:text-[#F59E0B]">Products</Link></li>
              <li><Link href="/about" className="hover:text-[#F59E0B]">About</Link></li>
              <li><Link href="/contact" className="hover:text-[#F59E0B]">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-[#F59E0B]">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                Phone:{" "}
                <a href="tel:9677706725" className="hover:text-[#F59E0B]">
                  9677706725
                </a>
              </li>
              <li>
                WhatsApp:{" "}
                <a
                  href="https://wa.me/919677706725"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#F59E0B]"
                >
                  9677706725
                </a>
              </li>
              <li>
                Location:{" "}
                <a
                  href="https://maps.app.goo.gl/X9qH5DrNyUrrwpyh6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#F59E0B]"
                >
                  Get Directions
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-gray-500">
          © 2026 PAVITHRA TRADERS. All rights reserved.
        </div>
      </footer>

      <div className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-[#F59E0B]/30 bg-[#111827] p-2 md:hidden">
        <a
          href="https://wa.me/919677706725"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#25D366] py-3 text-sm font-bold text-white"
        >
          <MessageCircle className="h-5 w-5" />
          WHATSAPP
        </a>
        <Link
          href="/cart"
          className="relative ml-2 flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#F59E0B] py-3 text-sm font-bold text-[#111827]"
        >
          <ShoppingCart className="h-5 w-5" />
          CART
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#DC2626] text-xs text-white">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </>
  );
}
