"use client";

import useSWR from "swr";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ApiResponse } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface Customer {
  customerName: string;
  phone: string;
  whatsapp: string | null;
  orderCount: number;
  lastOrder: string;
  totalValue: number;
}

export default function AdminCustomersPage() {
  const { data, isLoading } = useSWR<ApiResponse<Customer[]>>(
    "/api/admin/customers",
    fetcher
  );

  const customers = data?.data ?? [];

  return (
    <div>
      <h1 className="text-2xl font-black text-[#111827]">Customers</h1>
      <p className="mt-1 text-sm text-gray-500">Customers from real orders</p>

      {isLoading ? (
        <div className="mt-6 h-64 animate-pulse rounded-lg bg-gray-200" />
      ) : customers.length === 0 ? (
        <p className="mt-12 text-center text-gray-500">No customers yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">WhatsApp</th>
                <th className="px-4 py-3 text-left">Orders</th>
                <th className="px-4 py-3 text-left">Last Order</th>
                <th className="px-4 py-3 text-left">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.phone} className="border-b">
                  <td className="px-4 py-3 font-semibold">{c.customerName}</td>
                  <td className="px-4 py-3">{c.phone}</td>
                  <td className="px-4 py-3">{c.whatsapp ?? "—"}</td>
                  <td className="px-4 py-3">{c.orderCount}</td>
                  <td className="px-4 py-3">{formatDate(c.lastOrder)}</td>
                  <td className="px-4 py-3 font-bold">{formatCurrency(c.totalValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
