"use client";

import { useState } from "react";
import { ProductCard } from "@/components/products/product-card";
import type { Product } from "@/types";

interface ProductsCatalogClientProps {
  initialProducts: Product[];
}

export function ProductsCatalogClient({ initialProducts }: ProductsCatalogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const filtered = initialProducts.filter((p) => {
    if (selectedCategory !== "ALL" && p.category !== selectedCategory) {
      return false;
    }
    if (search) {
      const q = search.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchVariant = p.variant ? p.variant.toLowerCase().includes(q) : false;
      if (!matchName && !matchBrand && !matchVariant) return false;
    }
    return true;
  });

  return (
    <div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-[#F59E0B] focus:outline-none"
        />

        <div className="flex gap-2">
          {["ALL", "CEMENT", "STEEL"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                selectedCategory === cat
                  ? "bg-[#111827] text-[#F59E0B]"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {cat === "ALL" ? "All Products" : cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-gray-500">No products found matching your search.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p, idx) => (
            <ProductCard key={p.id} product={p} priority={idx < 4} />
          ))}
        </div>
      )}
    </div>
  );
}
