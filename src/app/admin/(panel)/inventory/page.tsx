"use client";

import useSWR from "swr";
import { getStockStatus } from "@/lib/utils";
import type { Product, ApiResponse } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminInventoryPage() {
  const { data, mutate, isLoading } = useSWR<ApiResponse<Product[]>>(
    "/api/admin/products",
    fetcher
  );

  const products = data?.data ?? [];

  const updateStock = async (id: string, currentStock: number) => {
    const stockStr = prompt("Enter new stock:", String(currentStock));
    if (stockStr === null) return;
    const stock = parseInt(stockStr, 10);
    if (isNaN(stock) || stock < 0) return;

    await fetch(`/api/admin/inventory/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock }),
    });
    mutate();
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-[#111827]">Inventory</h1>
      <p className="mt-1 text-sm text-gray-500">Monitor and update stock levels</p>

      {isLoading ? (
        <div className="mt-6 h-64 animate-pulse rounded-lg bg-gray-200" />
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Brand</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Unit</th>
                <th className="px-4 py-3 text-left">Minimum</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const status = getStockStatus(p.stock, p.minimumStock);
                const statusLabel =
                  status === "OUT_OF_STOCK" ? "OUT OF STOCK" : status === "LOW_STOCK" ? "LOW STOCK" : "IN STOCK";
                const statusColor =
                  status === "OUT_OF_STOCK" ? "text-[#DC2626]" : status === "LOW_STOCK" ? "text-[#F59E0B]" : "text-green-600";

                return (
                  <tr key={p.id} className="border-b">
                    <td className="px-4 py-3 font-semibold">{p.name}</td>
                    <td className="px-4 py-3">{p.brand}</td>
                    <td className="px-4 py-3">{p.stock}</td>
                    <td className="px-4 py-3">{p.unit}</td>
                    <td className="px-4 py-3">{p.minimumStock}</td>
                    <td className={`px-4 py-3 font-bold ${statusColor}`}>{statusLabel}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => updateStock(p.id, p.stock)}
                        className="text-xs font-bold text-[#F59E0B] hover:underline"
                      >
                        Update Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
