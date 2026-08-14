import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { STATIC_PRODUCTS, getProductBySlug } from "@/lib/catalog-data";
import { ProductDetailClient } from "@/components/products/product-detail-client";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  return STATIC_PRODUCTS.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} | PAVITHRA TRADERS`,
    description: product.description || `Buy ${product.name} from Pavithra Traders.`,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 shadow-sm border border-gray-200">
          <Image
            src={product.image || "/images/cement/ultratech.jpg"}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div>
          <span className="rounded bg-[#F59E0B] px-2.5 py-1 text-xs font-bold text-[#111827]">
            {product.brand}
          </span>
          <h1 className="mt-3 text-3xl font-black text-[#111827]">{product.name}</h1>
          {product.variant && <p className="text-lg text-gray-500">{product.variant}</p>}
          <p className="mt-4 text-3xl font-bold text-[#DC2626]">
            {formatCurrency(product.price)}{" "}
            <span className="text-base font-normal text-gray-500">/ {product.unit}</span>
          </p>

          <ProductDetailClient product={product} />

          <div className="mt-8 space-y-4 border-t border-gray-200 pt-8">
            <div>
              <h3 className="font-bold text-[#111827]">Description</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
            <div>
              <h3 className="font-bold text-[#111827]">Specifications</h3>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                <li>Brand: {product.brand}</li>
                <li>Category: {product.category}</li>
                {product.variant && <li>Variant: {product.variant}</li>}
                <li>Unit: {product.unit}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-[#111827]">Delivery Information</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Direct site delivery available across the region. Fast dispatch and on-site offloading support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
