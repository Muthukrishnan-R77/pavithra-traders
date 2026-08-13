"use client";

import useSWR from "swr";
import Link from "next/link";
import { formatCurrency, formatDate, formatTime, buildWhatsAppUrl } from "@/lib/utils";
import type { Order, ApiResponse } from "@/types";
import { Phone, MessageCircle, Eye } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-[#F59E0B]/20 text-[#92400e]",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  OUT_FOR_DELIVERY: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function AdminOrdersPage() {
  const { data, mutate, isLoading } = useSWR<ApiResponse<{ orders: Order[] }>>(
    "/api/admin/orders?limit=50",
    fetcher,
    { refreshInterval: 10000 }
  );

  const orders = data?.data?.orders ?? [];

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    mutate();
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-[#111827]">Orders</h1>
      <p className="mt-1 text-sm text-gray-500">All customer orders from PostgreSQL</p>

      {isLoading ? (
        <div className="mt-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <p className="mt-12 text-center text-gray-500">No customer orders yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-black text-[#F59E0B]">{order.orderNumber}</p>
                  <p className="mt-1 font-semibold">{order.customerName}</p>
                  <p className="text-sm text-gray-500">{order.phone}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLORS[order.status] ?? ""}`}>
                  {order.status}
                </span>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500">PRODUCTS</p>
                  {order.items?.map((item) => (
                    <p key={item.id} className="text-sm">
                      {item.productName} × {item.quantity} {item.unit}
                    </p>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">DELIVERY</p>
                  <p className="text-sm">{order.city}, {order.state}</p>
                  <p className="text-sm text-gray-500">{order.deliveryAddress}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">TOTAL</p>
                  <p className="text-lg font-bold text-[#DC2626]">{formatCurrency(order.total)}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(order.createdAt)} · {formatTime(order.createdAt)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center gap-1 rounded bg-[#111827] px-3 py-1.5 text-xs font-bold text-white"
                >
                  <Eye className="h-3 w-3" /> View Order
                </Link>
                {order.status === "NEW" && (
                  <button
                    type="button"
                    onClick={() => updateStatus(order.id, "CONFIRMED")}
                    className="rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white"
                  >
                    Confirm
                  </button>
                )}
                <a
                  href={buildWhatsAppUrl(order.whatsapp ?? order.phone, `Order ${order.orderNumber}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white"
                >
                  <MessageCircle className="h-3 w-3" /> WhatsApp
                </a>
                <a
                  href={`tel:${order.phone}`}
                  className="flex items-center gap-1 rounded border px-3 py-1.5 text-xs font-bold"
                >
                  <Phone className="h-3 w-3" /> Call
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
