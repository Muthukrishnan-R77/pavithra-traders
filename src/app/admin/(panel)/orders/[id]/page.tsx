"use client";

import { use } from "react";
import useSWR from "swr";
import Link from "next/link";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import type { Order, ApiResponse } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const STATUSES = ["NEW", "CONFIRMED", "PROCESSING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"] as const;

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, mutate, isLoading } = useSWR<ApiResponse<Order>>(
    `/api/admin/orders/${id}`,
    fetcher
  );

  const order = data?.data;

  const updateStatus = async (status: string) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    mutate();
  };

  if (isLoading) {
    return <div className="h-96 animate-pulse rounded-lg bg-gray-200" />;
  }

  if (!order) {
    return (
      <div className="w-full min-w-0">
        <p>Order not found.</p>
        <Link href="/admin/orders" className="text-[#F59E0B] hover:underline">Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full">
      <Link href="/admin/orders" className="text-sm text-[#F59E0B] hover:underline">← Back to Orders</Link>
      <h1 className="mt-4 break-all text-xl font-black text-[#F59E0B] md:text-2xl">{order.orderNumber}</h1>
      <span className="mt-2 inline-block rounded-full bg-[#F59E0B]/20 px-3 py-1 text-xs font-bold">
        {order.status}
      </span>

      <div className="mt-6 space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
        <div className="w-full min-w-0 rounded-lg border bg-white p-4 sm:p-6">
          <h2 className="font-bold">Customer Information</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div><dt className="text-gray-500">Name</dt><dd className="break-words font-semibold">{order.customerName}</dd></div>
            <div><dt className="text-gray-500">Phone</dt><dd className="break-all">{order.phone}</dd></div>
            <div><dt className="text-gray-500">WhatsApp</dt><dd className="break-all">{order.whatsapp}</dd></div>
          </dl>
        </div>

        <div className="w-full min-w-0 rounded-lg border bg-white p-4 sm:p-6">
          <h2 className="font-bold">Delivery Address</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div><dt className="text-gray-500">Address</dt><dd className="break-words">{order.deliveryAddress}</dd></div>
            <div><dt className="text-gray-500">City</dt><dd>{order.city}</dd></div>
            <div><dt className="text-gray-500">State</dt><dd>{order.state}</dd></div>
            <div><dt className="text-gray-500">Pincode</dt><dd>{order.pincode}</dd></div>
            {order.additionalInstructions && (
              <div><dt className="text-gray-500">Instructions</dt><dd className="break-words">{order.additionalInstructions}</dd></div>
            )}
          </dl>
        </div>
      </div>

      <div className="mt-6 w-full min-w-0 rounded-lg border bg-white p-4 sm:p-6">
        <h2 className="font-bold">Products</h2>

        {/* Desktop table */}
        <div className="mt-4 hidden md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-2">Product</th>
                <th className="pb-2">Brand</th>
                <th className="pb-2">Qty</th>
                <th className="pb-2">Unit Price</th>
                <th className="pb-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2">{item.productName}</td>
                  <td>{item.brand}{item.variant ? ` ${item.variant}` : ""}</td>
                  <td>{item.quantity} {item.unit}</td>
                  <td>{formatCurrency(item.unitPrice)}</td>
                  <td className="text-right font-semibold">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="mt-4 space-y-3 md:hidden">
          {order.items?.map((item) => (
            <div key={item.id} className="rounded-lg border bg-gray-50 p-3">
              <p className="font-semibold break-words">{item.productName}</p>
              <p className="text-sm text-gray-500">{item.brand}{item.variant ? ` · ${item.variant}` : ""}</p>
              <dl className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-gray-500">Quantity</dt>
                  <dd>{item.quantity} {item.unit}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-gray-500">Unit Price</dt>
                  <dd>{formatCurrency(item.unitPrice)}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-gray-500">Total</dt>
                  <dd className="font-bold text-[#DC2626]">{formatCurrency(item.total)}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-1 text-sm sm:text-right">
          <p>Subtotal: {formatCurrency(order.subtotal)}</p>
          <p>Delivery: {formatCurrency(order.deliveryCharge)}</p>
          <p className="text-base font-bold text-[#DC2626] sm:text-lg">Total: {formatCurrency(order.total)}</p>
        </div>
        <p className="mt-2 text-xs text-gray-500 sm:text-right">
          {formatDate(order.createdAt)} · {formatTime(order.createdAt)}
        </p>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-sm font-bold text-gray-500 md:hidden">Order Status</h2>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => updateStatus(status)}
              disabled={order.status === status}
              className="rounded border px-3 py-2 text-xs font-bold disabled:border-[#F59E0B] disabled:bg-[#F59E0B] disabled:text-[#111827] sm:px-4"
            >
              {status.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
