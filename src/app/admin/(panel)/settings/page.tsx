"use client";

import useSWR from "swr";
import { useState } from "react";
import type { Settings, ApiResponse } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminSettingsPage() {
  const { data, mutate, isLoading } = useSWR<ApiResponse<Settings>>(
    "/api/admin/settings",
    fetcher
  );

  const settings = data?.data;
  const [form, setForm] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const current = form ?? settings;

  const handleSave = async () => {
    if (!current) return;
    setSaving(true);
    setMessage("");

    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessName: current.businessName,
        phone: current.phone,
        whatsapp: current.whatsapp,
        location: current.location,
        address: current.address,
        openingHours: current.openingHours,
        deliveryCharge: current.deliveryCharge,
        minimumOrderValue: current.minimumOrderValue,
      }),
    });

    const result = await res.json();
    if (result.success) {
      setMessage("Settings saved successfully.");
      mutate();
    } else {
      setMessage(result.error || "Failed to save settings.");
    }
    setSaving(false);
  };

  if (isLoading || !current) {
    return <div className="h-96 animate-pulse rounded-lg bg-gray-200" />;
  }

  const update = (field: keyof Settings, value: string | number) => {
    setForm({ ...current, [field]: value });
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-[#111827]">Settings</h1>
      <p className="mt-1 text-sm text-gray-500">Business information stored in PostgreSQL</p>

      <div className="mt-6 max-w-xl space-y-4 rounded-lg border bg-white p-6">
        {[
          { key: "businessName" as const, label: "Business Name" },
          { key: "phone" as const, label: "Phone" },
          { key: "whatsapp" as const, label: "WhatsApp" },
          { key: "location" as const, label: "Location" },
          { key: "address" as const, label: "Address" },
          { key: "openingHours" as const, label: "Opening Hours" },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="text-sm font-semibold">{label}</label>
            <input
              value={current[key] ?? ""}
              onChange={(e) => update(key, e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2 text-sm"
            />
          </div>
        ))}
        <div>
          <label className="text-sm font-semibold">Delivery Charge (₹)</label>
          <input
            type="number"
            value={current.deliveryCharge}
            onChange={(e) => update("deliveryCharge", parseFloat(e.target.value) || 0)}
            className="mt-1 w-full rounded border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Minimum Order Value (₹)</label>
          <input
            type="number"
            value={current.minimumOrderValue}
            onChange={(e) => update("minimumOrderValue", parseFloat(e.target.value) || 0)}
            className="mt-1 w-full rounded border px-3 py-2 text-sm"
          />
        </div>

        {message && <p className="text-sm text-green-600">{message}</p>}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-[#F59E0B] px-6 py-2 text-sm font-bold text-[#111827] disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
