"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "@/components/cart/cart-context";
import { formatCurrency } from "@/lib/utils";
import type { Product, ApiResponse } from "@/types";
import { ShoppingBag, User, Phone, MapPin } from "lucide-react";

const checkoutFormSchema = z.object({
  customerName: z.string().min(2, "Please enter your name"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
  deliveryAddress: z.string().min(10, "Please enter your complete delivery address"),
});

type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, subtotal, clearCart, addItem } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
  });

  useEffect(() => {
    const buyId = searchParams.get("buy");
    const qty = parseInt(searchParams.get("qty") ?? "1", 10);

    Promise.all([
      buyId ? fetch(`/api/products/${buyId}`).then((r) => r.json()) : Promise.resolve(null),
    ]).then(([productRes]: [ApiResponse<Product> | null]) => {
      if (buyId && productRes?.data) {
        const p = productRes.data;
        addItem(
          {
            productId: p.id,
            name: p.name,
            brand: p.brand,
            variant: p.variant,
            price: p.price,
            unit: p.unit,
            image: p.image,
            stock: p.stock,
          },
          qty
        );
      }
      setReady(true);
    });
  }, [searchParams, addItem]);

  const checkoutItems = items;
  const total = subtotal;

  const onSubmit = async (data: CheckoutFormData) => {
    if (checkoutItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    setError("");

    const addressLines = data.deliveryAddress.split("\n").map((l) => l.trim()).filter(Boolean);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: data.customerName,
          phone: data.phone,
          whatsapp: data.phone,
          deliveryAddress: data.deliveryAddress,
          area: addressLines[0] ?? data.deliveryAddress,
          city: addressLines[1] ?? addressLines[0] ?? data.deliveryAddress,
          state: addressLines[2] ?? "Tamil Nadu",
          pincode: "000000",
          items: checkoutItems.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });

      const result = await res.json();

      if (!result.success) {
        setError(result.error || "Unable to place your order right now. Please try again.");
        setSubmitting(false);
        return;
      }

      clearCart();
      router.push(
        `/order-success?orderNumber=${result.data.orderNumber}&orderId=${result.data.orderId}`
      );
    } catch {
      setError("Unable to place your order right now. Please try again.");
      setSubmitting(false);
    }
  };

  if (!ready) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
        <div className="h-96 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center lg:px-8">
        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
        <h1 className="mt-4 text-2xl font-black text-[#111827]">Your cart is empty</h1>
        <p className="mt-2 text-gray-600">Add products to your cart before checkout.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-black text-[#111827]">CHECKOUT</h1>
        <p className="mt-2 text-gray-600">Complete your order in a few simple steps.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-8 lg:grid-cols-5">
          {/* Left — Customer & Address */}
          <div className="space-y-6 lg:col-span-3">
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#111827]">
                <User className="h-5 w-5 text-[#F59E0B]" />
                Customer Details
              </h2>

              <div className="mt-5 space-y-4">
                <div>
                  <label htmlFor="customerName" className="text-sm font-semibold text-[#111827]">
                    Customer Name *
                  </label>
                  <input
                    id="customerName"
                    {...register("customerName")}
                    placeholder="Enter your full name"
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#F59E0B] focus:outline-none focus:ring-1 focus:ring-[#F59E0B]"
                  />
                  {errors.customerName && (
                    <p className="mt-1 text-xs text-[#DC2626]">{errors.customerName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="flex items-center gap-1 text-sm font-semibold text-[#111827]">
                    <Phone className="h-4 w-4 text-[#F59E0B]" />
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    {...register("phone")}
                    placeholder="10-digit mobile number"
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#F59E0B] focus:outline-none focus:ring-1 focus:ring-[#F59E0B]"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-[#DC2626]">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="deliveryAddress" className="flex items-center gap-1 text-sm font-semibold text-[#111827]">
                    <MapPin className="h-4 w-4 text-[#F59E0B]" />
                    Delivery Address *
                  </label>
                  <textarea
                    id="deliveryAddress"
                    {...register("deliveryAddress")}
                    rows={4}
                    placeholder="House no, street, area, city"
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#F59E0B] focus:outline-none focus:ring-1 focus:ring-[#F59E0B]"
                  />
                  {errors.deliveryAddress && (
                    <p className="mt-1 text-xs text-[#DC2626]">{errors.deliveryAddress.message}</p>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Right — Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#111827]">Order Summary</h2>

              <div className="mt-4 space-y-4">
                {checkoutItems.map((item) => (
                  <div key={item.productId} className="border-b border-gray-100 pb-4 last:border-0">
                    <p className="font-semibold text-[#111827]">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.brand}{item.variant ? ` · ${item.variant}` : ""}</p>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {formatCurrency(item.price)} × {item.quantity} {item.unit}
                      </span>
                      <span className="font-bold text-[#111827]">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2 border-t border-gray-200 pt-4 text-sm">
                <div className="flex justify-between text-base">
                  <span className="font-bold text-[#111827]">Estimated Total</span>
                  <span className="text-xl font-black text-[#DC2626]">{formatCurrency(total)}</span>
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                Final price confirmed by PAVITHRA TRADERS at delivery.
              </p>

              {error && (
                <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-[#DC2626]">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 w-full rounded-lg bg-[#111827] py-4 text-sm font-bold tracking-wide text-white transition hover:bg-[#1f2937] disabled:opacity-50"
              >
                {submitting ? "PLACING ORDER..." : "PLACE ORDER"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-16">
          <div className="h-96 animate-pulse rounded-xl bg-gray-200" />
        </div>
      }
    >
      <CheckoutForm />
    </Suspense>
  );
}
