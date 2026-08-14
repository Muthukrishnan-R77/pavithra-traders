import { getCatalogProducts } from "@/lib/catalog-data";
import { ProductsCatalogClient } from "@/components/products/products-catalog-client";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Explore our complete range of cement and steel materials from UltraTech, Dalmia, Ramco, Tata Tiscon, JSW Neosteel, and more.",
};

export default async function ProductsPage() {
  const products = await getCatalogProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="text-3xl font-black text-[#111827]">ALL PRODUCTS</h1>
      <p className="mt-2 text-gray-600">Browse our complete range of cement and steel products.</p>

      <ProductsCatalogClient initialProducts={products} />
    </div>
  );
}
