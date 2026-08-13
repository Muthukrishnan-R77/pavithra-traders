"use client";

import useSWR from "swr";
import { Bell } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Order, ApiResponse } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function NewOrderNotification() {
  const { data } = useSWR<ApiResponse<{ orders: Order[] }>>(
    "/api/admin/orders?limit=5",
    fetcher,
    { refreshInterval: 10000 }
  );

  const newOrders = data?.data?.orders?.filter((o) => o.status === "NEW") ?? [];
  const latest = newOrders[0];

  if (!latest) return null;

  return (
    <div className="mb-6 flex w-full min-w-0 items-start gap-3 rounded-lg border border-[#F59E0B] bg-[#F59E0B]/10 p-4">
      <Bell className="mt-0.5 h-5 w-5 shrink-0 text-[#F59E0B]" />
      <div className="min-w-0">
        <p className="font-bold text-[#111827]">🔔 NEW ORDER RECEIVED</p>
        <p className="mt-1 break-words text-sm">
          <span className="font-semibold">{latest.orderNumber}</span>
          {" · "}
          {latest.customerName}
          {" · "}
          {formatCurrency(latest.total)}
        </p>
      </div>
    </div>
  );
}
