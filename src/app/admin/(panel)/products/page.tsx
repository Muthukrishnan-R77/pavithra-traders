"use client";

import useSWR from "swr";
import { formatCurrency, slugify } from "@/lib/utils";
import type { Product, ApiResponse } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminProductsPage() {
  const { data, mutate, isLoading } = useSWR<ApiResponse<Product[]>>(
    "/api/admin/products",
    fetcher
  );

  const products = data?.data ?? [];

  const toggleActive = async (id: string, active: boolean) => {
    await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    mutate();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    mutate();
  };

  const addProduct = async () => {
    const name = prompt("Product name:");
    if (!name) return;
    const brand = prompt("Brand:");
    if (!brand) return;
    const category = prompt("Category (CEMENT or STEEL):", "CEMENT") as "CEMENT" | "STEEL";
    const price = parseFloat(prompt("Price:", "450") ?? "0");
    const unit = prompt("Unit (Bag or Kg):", category === "CEMENT" ? "Bag" : "Kg") ?? "Bag";
    const variant = category === "STEEL" ? prompt("Variant (e.g. 12mm):") : undefined;

    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug: slugify(name),
        brand,
        category,
        price,
        unit,
        variant: variant || undefined,
        stock: 100,
        minimumStock: 10,
        active: true,
      }),
    });
    mutate();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#111827]">Products</h1>
          <p className="mt-1 text-sm text-gray-500">Manage product catalog</p>
        </div>
        <button
          type="button"
          onClick={addProduct}
          className="rounded-lg bg-[#F59E0B] px-4 py-2 text-sm font-bold text-[#111827]"
        >
          Add Product
        </button>
      </div>

      {isLoading ? (
        <div className="mt-6 h-64 animate-pulse rounded-lg bg-gray-200" />
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Brand</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="px-4 py-3 font-semibold">{p.name}</td>
                  <td className="px-4 py-3">{p.brand}</td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3">{formatCurrency(p.price)}/{p.unit}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className={p.active ? "text-green-600" : "text-[#DC2626]"}>
                      {p.active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleActive(p.id, p.active)}
                      className="mr-2 text-xs font-bold text-[#F59E0B] hover:underline"
                    >
                      {p.active ? "Disable" : "Enable"}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProduct(p.id)}
                      className="text-xs font-bold text-[#DC2626] hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
