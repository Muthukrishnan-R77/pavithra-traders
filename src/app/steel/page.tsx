import { getSteelProducts } from "@/lib/catalog-data";
import { SteelCatalogClient } from "@/components/products/steel-catalog-client";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Steel & TMT Bars",
  description:
    "Order Fe 550D TMT steel bars from Tata Tiscon, JSW Neosteel, Agni Steels, and SSI TMT. Available in 8mm, 10mm, 12mm, 16mm, and 20mm with direct delivery.",
};

export default async function SteelPage() {
  const steelProducts = await getSteelProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="text-3xl font-black text-[#111827]">STEEL & TMT</h1>
      <p className="mt-2 text-gray-600">
        High-strength 550D TMT bars for durable and earthquake-resistant construction.
      </p>

      <SteelCatalogClient initialProducts={steelProducts} />
    </div>
  );
}
