"use client";

import useSWR from "swr";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import type { Product, ApiResponse } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminPricesPage() {
  const { data, mutate, isLoading } = useSWR<ApiResponse<Product[]>>(
    "/api/admin/products",
    fetcher
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState("");

  const products = data?.data ?? [];

  const savePrice = async (id: string) => {
    const price = parseFloat(newPrice);
    if (isNaN(price) || price <= 0) return;

    await fetch(`/api/admin/products/${id}/price`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price }),
    });

    setEditingId(null);
    setNewPrice("");
    mutate();
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-[#111827]">Price Management</h1>
      <p className="mt-1 text-sm text-gray-500">Update daily prices — changes reflect on customer website immediately</p>

      {isLoading ? (
        <div className="mt-6 h-64 animate-pulse rounded-lg bg-gray-200" />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="rounded-lg border bg-white p-6">
              <h3 className="font-bold">{p.name}</h3>
              <p className="text-sm text-gray-500">{p.brand}{p.variant ? ` · ${p.variant}` : ""}</p>
              <p className="mt-2 text-lg font-bold text-[#DC2626]">
                Current: {formatCurrency(p.price)} / {p.unit}
              </p>

              {editingId === p.id ? (
                <div className="mt-4 flex gap-2">
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="New price"
                    className="flex-1 rounded border px-3 py-1.5 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => savePrice(p.id)}
                    className="rounded bg-[#F59E0B] px-3 py-1.5 text-xs font-bold text-[#111827]"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="rounded border px-3 py-1.5 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(p.id);
                    setNewPrice(String(p.price));
                  }}
                  className="mt-4 rounded bg-[#111827] px-4 py-2 text-xs font-bold text-white"
                >
                  Edit Price
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
