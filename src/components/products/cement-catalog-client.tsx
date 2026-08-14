"use client";

import { useState } from "react";
import { ProductCard } from "@/components/products/product-card";
import type { Product } from "@/types";

const BRANDS = ["UltraTech", "Dalmia", "Ramco", "Maha", "Penna"];

interface CementCatalogClientProps {
  initialProducts: Product[];
}

export function CementCatalogClient({ initialProducts }: CementCatalogClientProps) {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [sort, setSort] = useState("default");
  const [inStockOnly, setInStockOnly] = useState(false);

  let filtered = initialProducts.filter((p) => {
    if (
      search &&
      !p.name.toLowerCase().includes(search.toLowerCase()) &&
      !p.brand.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    if (brand && p.brand !== brand) return false;
    if (inStockOnly && p.stock <= 0) return false;
    return true;
  });

  if (sort === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);

  return (
    <div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Search cement..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-[#F59E0B] focus:outline-none"
        />
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
        >
          <option value="">All Brands</option>
          {BRANDS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
        >
          <option value="default">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="rounded text-[#F59E0B] focus:ring-[#F59E0B]"
          />
          In Stock Only
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-gray-500">No products found matching your filters.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, idx) => (
            <ProductCard key={p.id} product={p} priority={idx < 3} />
          ))}
        </div>
      )}
    </div>
  );
}
