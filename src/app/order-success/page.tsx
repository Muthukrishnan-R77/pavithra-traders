"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/utils";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") ?? "";

  const waMessage = `PAVITHRA TRADERS\nNew Order\n\nOrder Number: ${orderNumber}\n\nPlease confirm my order. Thank you!`;
  const waUrl = buildWhatsAppUrl("9025644746", waMessage);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center lg:px-8">
      <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
      <h1 className="mt-6 text-3xl font-black text-[#111827]">ORDER PLACED SUCCESSFULLY!</h1>
      <p className="mt-4 text-gray-600">Thank you for your order. We will contact you shortly.</p>

      <div className="mt-8 rounded-lg border bg-white p-6">
        <p className="text-sm text-gray-500">Order Number</p>
        <p className="mt-1 text-2xl font-black text-[#F59E0B]">{orderNumber}</p>
      </div>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-8 py-4 text-sm font-bold text-white hover:bg-[#1da851]"
      >
        <MessageCircle className="h-5 w-5" />
        SEND ORDER ON WHATSAPP
      </a>

      <Link href="/" className="mt-4 block text-sm text-[#F59E0B] hover:underline">
        Continue Shopping
      </Link>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <OrderSuccessContent />
    </Suspense>
  );
}
