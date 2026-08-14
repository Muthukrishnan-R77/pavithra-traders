import { getCementProducts } from "@/lib/catalog-data";
import { CementCatalogClient } from "@/components/products/cement-catalog-client";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Cement Products",
  description:
    "Buy premium cement from trusted brands like UltraTech, Dalmia, Ramco, Maha, and Penna with daily updated pricing and site delivery.",
};

export default async function CementPage() {
  const cementProducts = await getCementProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="text-3xl font-black text-[#111827]">CEMENT</h1>
      <p className="mt-2 text-gray-600">
        Premium 53 Grade and PPC/PSC cement from India&apos;s most trusted manufacturers.
      </p>

      <CementCatalogClient initialProducts={cementProducts} />
    </div>
  );
}
