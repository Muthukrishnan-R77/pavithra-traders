"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/products/product-card";
import type { Product, ApiResponse } from "@/types";

const BRANDS = ["Tata Tiscon", "JSW Neosteel", "Agni Steels", "SSI TMT"];
const VARIANTS = ["8mm", "10mm", "12mm", "16mm", "20mm"];

export default function SteelPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [variant, setVariant] = useState("");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    fetch("/api/products?category=steel")
      .then((r) => r.json())
      .then((res: ApiResponse<Product[]>) => {
        setProducts(res.data ?? []);
        setLoading(false);
      });
  }, []);

  let filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (brand && p.brand !== brand) return false;
    if (variant && p.variant !== variant) return false;
    return true;
  });

  if (sort === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="text-3xl font-black text-[#111827]">STEEL & TMT</h1>
      <p className="mt-2 text-gray-600">High-strength TMT bars for durable construction.</p>

      <div className="mt-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search steel..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#F59E0B] focus:outline-none"
        />
        <select value={brand} onChange={(e) => setBrand(e.target.value)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm">
          <option value="">All Brands</option>
          {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={variant} onChange={(e) => setVariant(e.target.value)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm">
          <option value="">All Sizes</option>
          {VARIANTS.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm">
          <option value="default">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="mt-12 text-center text-gray-500">No products found.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
