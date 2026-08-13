"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/products/product-card";
import type { Product, ApiResponse } from "@/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((res: ApiResponse<Product[]>) => {
        setProducts(res.data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="text-3xl font-black text-[#111827]">ALL PRODUCTS</h1>
      <p className="mt-2 text-gray-600">Browse our complete range of cement and steel products.</p>

      {loading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="mt-12 text-center text-gray-500">No products are currently available.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
