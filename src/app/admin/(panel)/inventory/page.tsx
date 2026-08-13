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
    <div className="w-full min-w-0 max-w-full">
      <h1 className="text-xl font-black break-words text-[#111827] md:text-2xl">Inventory</h1>
      <p className="mt-1 text-sm text-gray-500">Monitor and update stock levels</p>

      {isLoading ? (
        <div className="mt-6 h-64 animate-pulse rounded-lg bg-gray-200" />
      ) : (
        <>
          <div className="mt-6 hidden overflow-hidden rounded-lg border bg-white md:block">
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

          <div className="mt-4 space-y-4 md:hidden">
            {products.map((p) => {
              const status = getStockStatus(p.stock, p.minimumStock);
              const statusLabel =
                status === "OUT_OF_STOCK" ? "OUT OF STOCK" : status === "LOW_STOCK" ? "LOW STOCK" : "IN STOCK";
              const statusColor =
                status === "OUT_OF_STOCK" ? "text-[#DC2626]" : status === "LOW_STOCK" ? "text-[#F59E0B]" : "text-green-600";

              return (
                <div
                  key={p.id}
                  className="w-full min-w-0 max-w-full rounded-lg border bg-white p-4 shadow-sm"
                >
                  <h3 className="text-base font-bold break-words text-[#111827]">{p.name}</h3>
                  <p className="text-sm text-gray-500">{p.brand}</p>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between gap-2">
                      <dt className="text-gray-500">Stock</dt>
                      <dd className="font-medium">{p.stock} {p.unit}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-gray-500">Minimum Stock</dt>
                      <dd className="font-medium">{p.minimumStock}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-gray-500">Status</dt>
                      <dd className={`font-bold ${statusColor}`}>{statusLabel}</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={() => updateStock(p.id, p.stock)}
                    className="mt-4 w-full rounded-lg bg-[#111827] px-3 py-2.5 text-xs font-bold text-white"
                  >
                    Update Stock
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
