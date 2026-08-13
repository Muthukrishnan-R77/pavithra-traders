"use client";

import useSWR from "swr";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import type { ApiResponse } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface PriceHistoryEntry {
  id: string;
  productName: string;
  brand: string;
  unit: string;
  oldPrice: number;
  newPrice: number;
  changedBy: string;
  createdAt: string;
}

export default function PriceHistoryPage() {
  const { data, isLoading } = useSWR<ApiResponse<PriceHistoryEntry[]>>(
    "/api/admin/price-history",
    fetcher
  );

  const history = data?.data ?? [];

  return (
    <div>
      <h1 className="text-2xl font-black text-[#111827]">Price History</h1>
      <p className="mt-1 text-sm text-gray-500">Complete record of all price changes</p>

      {isLoading ? (
        <div className="mt-6 h-64 animate-pulse rounded-lg bg-gray-200" />
      ) : history.length === 0 ? (
        <p className="mt-12 text-center text-gray-500">No price changes recorded yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Old Price</th>
                <th className="px-4 py-3 text-left">New Price</th>
                <th className="px-4 py-3 text-left">Changed By</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id} className="border-b">
                  <td className="px-4 py-3 font-semibold">{h.productName}</td>
                  <td className="px-4 py-3">{formatCurrency(h.oldPrice)}/{h.unit}</td>
                  <td className="px-4 py-3 font-bold text-[#DC2626]">{formatCurrency(h.newPrice)}/{h.unit}</td>
                  <td className="px-4 py-3">{h.changedBy}</td>
                  <td className="px-4 py-3">{formatDate(h.createdAt)} · {formatTime(h.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
