"use client";

import useSWR from "next/navigation";
import { usePathname } from "next/navigation";
import useSWRHook from "swr";
import type { Product, ApiResponse } from "@/types";
import { formatCurrency } from "@/lib/utils";

const DEFAULT_TICKER_TEXT =
  "UltraTech Cement ₹450/Bag   •   Dalmia Cement ₹440/Bag   •   Ramco Cement ₹430/Bag   •   Maha Cement ₹420/Bag   •   Tata Tiscon 12mm ₹60/Kg   •   JSW Neosteel 12mm ₹60/Kg   •   Agni Steels 12mm ₹60/Kg   •   SSI TMT 12mm ₹60/Kg";

const fetcher = (url: string) =>
  fetch(url, { headers: { Accept: "application/json" } }).then((r) => r.json());

export function PriceTicker() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  const { data } = useSWRHook<ApiResponse<Product[]>>(
    isAdmin ? null : "/api/products",
    fetcher,
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  if (isAdmin) return null;

  const products = data?.data;

  let tickerText = DEFAULT_TICKER_TEXT;
  if (products && products.length > 0) {
    const tickerItems = products
      .filter((p) => !p.variant || p.variant === "12mm")
      .slice(0, 8);

    if (tickerItems.length > 0) {
      tickerText = tickerItems
        .map(
          (p) =>
            `${p.brand}${p.variant ? ` ${p.variant}` : ""} ${formatCurrency(p.price)}/${p.unit}`
        )
        .join("   •   ");
    }
  }

  return (
    <div className="overflow-hidden bg-[#F59E0B] py-2 text-[#111827]">
      <div className="flex animate-marquee whitespace-nowrap">
        <span className="mx-4 text-xs font-black tracking-wider uppercase">
          LIVE PRICES
        </span>
        <span className="mx-8 text-xs font-semibold sm:text-sm">
          {tickerText}
        </span>
        <span className="mx-8 text-xs font-semibold sm:text-sm">
          {tickerText}
        </span>
      </div>
    </div>
  );
}
