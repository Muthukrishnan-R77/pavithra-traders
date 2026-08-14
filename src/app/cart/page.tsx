"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { QuantityInput } from "@/components/products/quantity-input";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center lg:px-8">
        <h1 className="text-2xl font-black text-[#111827]">Your Cart is Empty</h1>
        <p className="mt-2 text-gray-600">Add products to get started.</p>
        <Link href="/products" className="mt-6 inline-block rounded-lg bg-[#F59E0B] px-8 py-3 text-sm font-bold text-[#111827]">
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="text-3xl font-black text-[#111827]">SHOPPING CART</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 rounded-lg border bg-white p-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded bg-gray-100">
                <Image
                  src={item.image || "/images/cement/ultratech.jpg"}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <h3 className="font-bold text-[#111827]">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.brand}{item.variant ? ` · ${item.variant}` : ""}</p>
                <p className="text-sm font-semibold text-[#DC2626]">
                  {formatCurrency(item.price)} / {item.unit}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <QuantityInput
                    value={item.quantity}
                    onChange={(qty) => updateQuantity(item.productId, qty)}
                    max={item.stock}
                  />
                  <div className="flex items-center gap-4">
                    <span className="font-bold">{formatCurrency(item.price * item.quantity)}</span>
                    <button type="button" onClick={() => removeItem(item.productId)} className="text-[#DC2626] hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-lg border bg-white p-6">
          <h2 className="text-lg font-bold text-[#111827]">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between border-t pt-2 text-lg font-bold">
              <span>Estimated Total</span>
              <span className="text-[#DC2626]">{formatCurrency(subtotal)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block w-full rounded-lg bg-[#F59E0B] py-3 text-center text-sm font-bold text-[#111827] hover:bg-[#d97706]"
          >
            PROCEED TO CHECKOUT
          </Link>
          <Link href="/products" className="mt-3 block text-center text-sm text-[#F59E0B] hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
