"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingCart, Zap } from "lucide-react";
import type { Product } from "@/types";
import { formatCurrency, getStockStatus } from "@/lib/utils";
import { useCart } from "@/components/cart/cart-context";
import { QuantityInput } from "@/components/products/quantity-input";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const stockStatus = getStockStatus(product.stock, product.minimumStock);

  const handleAddToCart = () => {
    if (stockStatus === "OUT_OF_STOCK") return;
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
    );
  };

  const statusLabel =
    stockStatus === "OUT_OF_STOCK"
      ? "Out of Stock"
      : stockStatus === "LOW_STOCK"
        ? "Low Stock"
        : "In Stock";

  const statusColor =
    stockStatus === "OUT_OF_STOCK"
      ? "text-[#DC2626]"
      : stockStatus === "LOW_STOCK"
        ? "text-[#F59E0B]"
        : "text-green-600";

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#F59E0B] hover:shadow-xl">
      <Link href={`/products/${product.slug}`} className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={product.image || "/images/cement/ultratech.jpg"}
          alt={product.name}
          fill
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
        <span className="absolute left-3 top-3 rounded bg-[#F59E0B] px-2 py-0.5 text-xs font-bold text-[#111827]">
          {product.brand}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-bold text-[#111827] transition hover:text-[#F59E0B]">
            {product.name}
          </h3>
        </Link>
        {product.variant && (
          <p className="text-sm text-gray-500">{product.variant}</p>
        )}
        <p className="mt-2 text-xl font-bold text-[#DC2626]">
          {formatCurrency(product.price)}{" "}
          <span className="text-sm font-normal text-gray-500">/ {product.unit}</span>
        </p>
        <p className={cn("mt-1 text-xs font-semibold", statusColor)}>● {statusLabel}</p>

        {stockStatus !== "OUT_OF_STOCK" && (
          <>
            <QuantityInput
              value={quantity}
              onChange={setQuantity}
              max={product.stock}
              className="mt-3"
            />

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center gap-1 rounded bg-[#111827] py-2.5 text-xs font-bold text-white transition hover:bg-[#1f2937]"
              >
                <ShoppingCart className="h-4 w-4" />
                ADD TO CART
              </button>
              <Link
                href={`/checkout?buy=${product.id}&qty=${quantity}`}
                className="flex flex-1 items-center justify-center gap-1 rounded bg-[#F59E0B] py-2.5 text-xs font-bold text-[#111827] transition hover:bg-[#d97706]"
              >
                <Zap className="h-4 w-4" />
                BUY NOW
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
