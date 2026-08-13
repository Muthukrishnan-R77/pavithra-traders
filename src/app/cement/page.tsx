"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/products/product-card";
import type { Product, ApiResponse } from "@/types";

const BRANDS = ["UltraTech", "Dalmia", "Ramco", "Maha", "Penna"];

export default function CementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [sort, setSort] = useState("default");
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    fetch("/api/products?category=cement")
      .then((r) => r.json())
      .then((res: ApiResponse<Product[]>) => {
        setProducts(res.data ?? []);
        setLoading(false);
      });
  }, []);

  let filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.brand.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (brand && p.brand !== brand) return false;
    if (inStockOnly && p.stock <= 0) return false;
    return true;
  });

  if (sort === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="text-3xl font-black text-[#111827]">CEMENT</h1>
      <p className="mt-2 text-gray-600">Premium cement from India&apos;s most trusted brands.</p>

      <div className="mt-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search cement..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#F59E0B] focus:outline-none"
        />
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
        >
          <option value="">All Brands</option>
          {BRANDS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
        >
          <option value="default">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
          In Stock Only
        </label>
      </div>

      {loading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="mt-12 text-center text-gray-500">No products found.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
