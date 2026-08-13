"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { ProductCard } from "@/components/products/product-card";
import type { Product, ApiResponse } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const { data, isLoading } = useSWR<ApiResponse<Product[]>>(
    q ? `/api/products?search=${encodeURIComponent(q)}` : null,
    fetcher
  );

  const products = q ? (data?.data ?? []) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="text-3xl font-black text-[#111827]">
        Search Results {q && `for "${q}"`}
      </h1>

      {!q ? (
        <p className="mt-12 text-center text-gray-500">Enter a search term above.</p>
      ) : isLoading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="mt-12 text-center text-gray-500">No products found.</p>
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

export default function SearchPage() {
  return (
    <Suspense>
      <SearchForm />
      <SearchResults />
    </Suspense>
  );
}

function SearchForm() {
  return (
    <div className="border-b bg-white py-6">
      <form action="/search" method="GET" className="mx-auto flex max-w-xl gap-2 px-4">
        <input
          name="q"
          type="text"
          placeholder="Search cement, steel, brands..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#F59E0B] focus:outline-none"
        />
        <button type="submit" className="rounded-lg bg-[#111827] px-6 py-2 text-sm font-bold text-white">
          SEARCH
        </button>
      </form>
    </div>
  );
}
