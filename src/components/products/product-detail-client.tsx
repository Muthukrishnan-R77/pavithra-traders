"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, MessageCircle, Zap } from "lucide-react";
import type { Product } from "@/types";
import { formatCurrency, getStockStatus, buildWhatsAppUrl } from "@/lib/utils";
import { useCart } from "@/components/cart/cart-context";
import { QuantityInput } from "@/components/products/quantity-input";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const stockStatus = getStockStatus(product.stock, product.minimumStock);

  const waMessage = `Hi, I'm interested in ${product.name}${
    product.variant ? ` ${product.variant}` : ""
  }. Please share current price and availability.`;
  const waUrl = buildWhatsAppUrl("9025644746", waMessage);

  return (
    <div>
      <p className="mt-2 text-sm font-semibold">
        {stockStatus === "OUT_OF_STOCK" ? (
          <span className="text-[#DC2626]">● Out of Stock</span>
        ) : stockStatus === "LOW_STOCK" ? (
          <span className="text-[#F59E0B]">
            ● Low Stock ({product.stock} {product.unit}s left)
          </span>
        ) : (
          <span className="text-green-600">
            ● In Stock ({product.stock} {product.unit}s available)
          </span>
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
              className="flex items-center gap-2 rounded-lg bg-[#111827] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1f2937]"
            >
              <ShoppingCart className="h-5 w-5" /> ADD TO CART
            </button>
            <Link
              href={`/checkout?buy=${product.id}&qty=${quantity}`}
              className="flex items-center gap-2 rounded-lg bg-[#F59E0B] px-6 py-3 text-sm font-bold text-[#111827] transition hover:bg-[#d97706]"
            >
              <Zap className="h-5 w-5" /> BUY NOW
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border-2 border-[#25D366] px-6 py-3 text-sm font-bold text-[#25D366] transition hover:bg-[#25D366]/10"
            >
              <MessageCircle className="h-5 w-5" /> WHATSAPP ENQUIRY
            </a>
          </div>
        </>
      )}
    </div>
  );
}
