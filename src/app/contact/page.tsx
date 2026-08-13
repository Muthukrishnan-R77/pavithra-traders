import { MapPin, Phone, MessageCircle, Navigation } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact PAVITHRA TRADERS for cement and steel construction materials. Call, WhatsApp or get directions to our location.",
};

const PHONE = "9677706725";
const WHATSAPP_PHONE = "919677706725";
const MAPS_URL = "https://maps.app.goo.gl/X9qH5DrNyUrrwpyh6";
const WHATSAPP_MESSAGE =
  "Hello PAVITHRA TRADERS, I would like to enquire about your cement and steel products.";

export default function ContactPage() {
  const whatsappUrl = buildWhatsAppUrl(WHATSAPP_PHONE.replace("91", ""), WHATSAPP_MESSAGE);

  return (
    <>
      {/* Hero */}
      <section className="bg-[#111827] px-4 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold tracking-[0.2em] text-[#F59E0B]">PAVITHRA TRADERS</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">
            CONTACT{" "}
            <span className="text-[#F59E0B]">PAVITHRA TRADERS</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
            Have questions about cement, steel or your construction material requirements?
            Get in touch with us.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="bg-[#F3F4F6] px-4 py-16 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {/* Call Us */}
          <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition hover:border-[#F59E0B] hover:shadow-lg">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#111827]">
              <Phone className="h-7 w-7 text-[#F59E0B]" />
            </div>
            <h2 className="mt-6 text-xl font-black text-[#111827]">CALL US</h2>
            <p className="mt-2 text-sm text-gray-500">Phone</p>
            <a
              href={`tel:${PHONE}`}
              className="mt-1 text-2xl font-bold text-[#111827] hover:text-[#F59E0B]"
            >
              {PHONE}
            </a>
            <a
              href={`tel:${PHONE}`}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#111827] px-6 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-[#1f2937]"
            >
              CALL NOW
            </a>
          </div>

          {/* WhatsApp */}
          <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition hover:border-[#F59E0B] hover:shadow-lg">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#25D366]">
              <MessageCircle className="h-7 w-7 text-white" />
            </div>
            <h2 className="mt-6 text-xl font-black text-[#111827]">WHATSAPP</h2>
            <p className="mt-2 text-sm text-gray-500">WhatsApp</p>
            <p className="mt-1 text-2xl font-bold text-[#111827]">{PHONE}</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#25D366] px-6 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-[#1da851]"
            >
              CHAT ON WHATSAPP
            </a>
          </div>

          {/* Location */}
          <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition hover:border-[#F59E0B] hover:shadow-lg">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#111827]">
              <MapPin className="h-7 w-7 text-[#F59E0B]" />
            </div>
            <h2 className="mt-6 text-xl font-black text-[#111827]">OUR LOCATION</h2>
            <p className="mt-4 text-lg font-bold text-[#111827]">PAVITHRA TRADERS</p>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#F59E0B] bg-[#F59E0B] px-6 py-3 text-sm font-bold tracking-wide text-[#111827] transition hover:bg-[#d97706]"
            >
              <Navigation className="h-4 w-4" />
              GET DIRECTIONS
            </a>
          </div>
        </div>
      </section>

      {/* Find Us */}
      <section className="bg-white px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-black text-[#111827]">FIND US</h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-600">
            Visit PAVITHRA TRADERS for your construction material requirements.
          </p>

          <div className="mt-10 overflow-hidden rounded-xl border border-gray-200 bg-[#F3F4F6] shadow-sm">
            <div className="flex flex-col items-center justify-center px-6 py-16 md:py-24">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#111827]">
                <MapPin className="h-10 w-10 text-[#F59E0B]" />
              </div>
              <h3 className="mt-6 text-2xl font-black text-[#111827]">PAVITHRA TRADERS</h3>
              <p className="mt-2 text-gray-500">
                Tap below to open our location in Google Maps
              </p>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-[#111827] px-10 py-4 text-sm font-bold tracking-wide text-white transition hover:bg-[#1f2937]"
              >
                <MapPin className="h-5 w-5 text-[#F59E0B]" />
                GET DIRECTIONS
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#111827] px-4 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">
            READY TO <span className="text-[#F59E0B]">BUILD?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            Contact PAVITHRA TRADERS for cement and steel construction materials.
          </p>
          <div className="mt-10 flex flex-col flex-wrap justify-center gap-4 sm:flex-row">
            <a
              href={`tel:${PHONE}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F59E0B] px-8 py-4 text-sm font-bold tracking-wide text-[#111827] transition hover:bg-[#d97706]"
            >
              <Phone className="h-5 w-5" />
              CALL NOW
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-8 py-4 text-sm font-bold tracking-wide text-white transition hover:bg-[#1da851]"
            >
              <MessageCircle className="h-5 w-5" />
              WHATSAPP US
            </a>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#F59E0B] px-8 py-4 text-sm font-bold tracking-wide text-[#F59E0B] transition hover:bg-[#F59E0B]/10"
            >
              <Navigation className="h-5 w-5" />
              GET DIRECTIONS
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
