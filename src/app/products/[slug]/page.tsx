"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, MessageCircle, Zap } from "lucide-react";
import type { Product, ApiResponse } from "@/types";
import { formatCurrency, getStockStatus, buildWhatsAppUrl } from "@/lib/utils";
import { useCart } from "@/components/cart/cart-context";
import { QuantityInput } from "@/components/products/quantity-input";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((res: ApiResponse<Product>) => {
        setProduct(res.data ?? null);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-lg bg-gray-200" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-gray-200" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-gray-200" />
            <div className="h-24 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center lg:px-8">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link href="/products" className="mt-4 inline-block text-[#F59E0B] hover:underline">
          Browse Products
        </Link>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stock, product.minimumStock);
  const waMessage = `Hi, I'm interested in ${product.name}${product.variant ? ` ${product.variant}` : ""}. Please share current price and availability.`;
  const waUrl = buildWhatsAppUrl("9025644746", waMessage);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
          <Image
            src={product.image || "/images/cement/ultratech.jpg"}
            alt={product.name}
            fill
            unoptimized
            className="object-cover"
            priority
          />
        </div>

        <div>
          <span className="rounded bg-[#F59E0B] px-2 py-0.5 text-xs font-bold text-[#111827]">
            {product.brand}
          </span>
          <h1 className="mt-2 text-3xl font-black text-[#111827]">{product.name}</h1>
          {product.variant && <p className="text-lg text-gray-500">{product.variant}</p>}
          <p className="mt-4 text-3xl font-bold text-[#DC2626]">
            {formatCurrency(product.price)}{" "}
            <span className="text-base font-normal text-gray-500">/ {product.unit}</span>
          </p>
          <p className="mt-2 text-sm font-semibold">
            {stockStatus === "OUT_OF_STOCK" ? (
              <span className="text-[#DC2626]">● Out of Stock</span>
            ) : stockStatus === "LOW_STOCK" ? (
              <span className="text-[#F59E0B]">● Low Stock ({product.stock} {product.unit}s left)</span>
            ) : (
              <span className="text-green-600">● In Stock ({product.stock} {product.unit}s available)</span>
            )}
          </p>

          {stockStatus !== "OUT_OF_STOCK" && (
            <>
              <div className="mt-6 flex items-center gap-4">
                <span className="text-sm font-semibold">Quantity:</span>
                <QuantityInput
                  value={quantity}
                  onChange={setQuantity}
                  max={product.stock}
                  inputClassName="text-lg"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Total: {formatCurrency(product.price * quantity)}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    addItem(
                      {
                        productId: product.id,
                        name: product.name,
                        brand: product.brand,
                        variant: product.variant,
                        price: product.price,
                        unit: product.unit,
                        image: product.image,
                        stock: product.stock,
                      },
                      quantity
                    )
                  }
                  className="flex items-center gap-2 rounded-lg bg-[#111827] px-6 py-3 text-sm font-bold text-white hover:bg-[#1f2937]"
                >
                  <ShoppingCart className="h-5 w-5" /> ADD TO CART
                </button>
                <Link
                  href={`/checkout?buy=${product.id}&qty=${quantity}`}
                  className="flex items-center gap-2 rounded-lg bg-[#F59E0B] px-6 py-3 text-sm font-bold text-[#111827] hover:bg-[#d97706]"
                >
                  <Zap className="h-5 w-5" /> BUY NOW
                </Link>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border-2 border-[#25D366] px-6 py-3 text-sm font-bold text-[#25D366] hover:bg-[#25D366]/10"
                >
                  <MessageCircle className="h-5 w-5" /> WHATSAPP ENQUIRY
                </a>
              </div>
            </>
          )}

          <div className="mt-8 space-y-4 border-t pt-8">
            <div>
              <h3 className="font-bold text-[#111827]">Description</h3>
              <p className="mt-2 text-sm text-gray-600">{product.description}</p>
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
              <h3 className="font-bold text-[#111827]">Delivery</h3>
              <p className="mt-2 text-sm text-gray-600">
                Delivery available across the region. Delivery charges apply based on location.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
