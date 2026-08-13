"use client";

import useSWR from "swr";
import { usePathname } from "next/navigation";
import type { Product, ApiResponse } from "@/types";
import { formatCurrency } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function PriceTicker() {
  const pathname = usePathname();
  const { data } = useSWR<ApiResponse<Product[]>>(
    pathname.startsWith("/admin") ? null : "/api/products",
    fetcher,
    { refreshInterval: 30000 }
  );

  if (pathname.startsWith("/admin")) return null;

  const products = data?.data ?? [];

  const tickerItems = products
    .filter((p) => !p.variant || p.variant === "12mm")
    .slice(0, 8);

  if (tickerItems.length === 0) return null;

  const items = tickerItems.map(
    (p) => `${p.brand}${p.variant ? ` ${p.variant}` : ""} ${formatCurrency(p.price)}/${p.unit}`
  );

  const text = items.join("   •   ");

  return (
    <div className="overflow-hidden bg-[#F59E0B] py-2">
      <div className="flex animate-marquee whitespace-nowrap">
        <span className="mx-4 text-sm font-bold tracking-wide text-[#111827]">
          LIVE PRICES
        </span>
        {[...Array(2)].map((_, i) => (
          <span key={i} className="mx-8 text-sm font-semibold text-[#111827]">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
