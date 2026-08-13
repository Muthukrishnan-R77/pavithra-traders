"use client";

import useSWR from "swr";
import { NewOrderNotification } from "@/components/admin/new-order-notification";
import { formatCurrency } from "@/lib/utils";
import type { ApiResponse } from "@/types";
import {
  ShoppingBag,
  Package,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface DashboardStats {
  totalOrders: number;
  newOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalProducts: number;
  lowStock: number;
  todayOrders: number;
  todaySales: number;
}

export default function AdminDashboard() {
  const { data, isLoading } = useSWR<ApiResponse<DashboardStats>>(
    "/api/admin/dashboard",
    fetcher,
    { refreshInterval: 15000 }
  );

  const stats = data?.data;

  const cards = stats
    ? [
        { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "text-blue-600" },
        { label: "New Orders", value: stats.newOrders, icon: ShoppingBag, color: "text-[#F59E0B]" },
        { label: "Pending Orders", value: stats.pendingOrders, icon: AlertTriangle, color: "text-orange-600" },
        { label: "Completed Orders", value: stats.completedOrders, icon: CheckCircle, color: "text-green-600" },
        { label: "Total Products", value: stats.totalProducts, icon: Package, color: "text-purple-600" },
        { label: "Low Stock", value: stats.lowStock, icon: AlertTriangle, color: "text-[#DC2626]" },
        { label: "Today's Orders", value: stats.todayOrders, icon: ShoppingBag, color: "text-blue-600" },
        { label: "Today's Sales", value: formatCurrency(stats.todaySales), icon: TrendingUp, color: "text-green-600" },
      ]
    : [];

  return (
    <div className="w-full min-w-0 max-w-full">
      <h1 className="text-xl font-black break-words text-[#111827] md:text-2xl">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">Real-time store overview</p>

      <div className="mt-6">
        <NewOrderNotification />
      </div>

      {isLoading ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div key={card.label} className="w-full min-w-0 rounded-lg border bg-white p-4 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-500">{card.label}</p>
                <card.icon className={`h-5 w-5 shrink-0 ${card.color}`} />
              </div>
              <p className="mt-2 break-words text-xl font-black text-[#111827] sm:text-2xl">{card.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
