import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/settings";
import { ProductCard } from "@/components/products/product-card";
import {
  Shield,
  TrendingDown,
  Truck,
  ShoppingBag,
  Award,
  Clock,
  Headphones,
  MapPin,
} from "lucide-react";

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      orderBy: [{ category: "asc" }, { brand: "asc" }],
    });
    return products.map(serializeProduct);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const products = await getProducts();
  const cementProducts = products.filter((p) => p.category === "CEMENT").slice(0, 5);
  const steelProducts = products
    .filter((p) => p.category === "STEEL" && p.variant === "12mm")
    .slice(0, 4);

  const cementBrands = [...new Set(products.filter((p) => p.category === "CEMENT").map((p) => p.brand))];
  const steelBrands = [...new Set(products.filter((p) => p.category === "STEEL").map((p) => p.brand))];

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-[#111827]">
        <Image
          src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&q=80"
          alt="Construction site"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-[#111827]/80 to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 lg:px-8">
          <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
            QUALITY MATERIALS.
            <br />
            STRONGER{" "}
            <span className="text-[#F59E0B]">CONSTRUCTION.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-gray-300">
            Shop quality cement and steel from trusted brands for residential and commercial construction.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/cement"
              className="rounded-lg bg-[#F59E0B] px-8 py-3 text-sm font-bold tracking-wide text-[#111827] transition hover:bg-[#d97706]"
            >
              SHOP CEMENT
            </Link>
            <Link
              href="/steel"
              className="rounded-lg border-2 border-[#F59E0B] px-8 py-3 text-sm font-bold tracking-wide text-[#F59E0B] transition hover:bg-[#F59E0B]/10"
            >
              SHOP STEEL
            </Link>
            <a
              href="https://wa.me/919025644746"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[#25D366] px-8 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-[#1da851]"
            >
              WHATSAPP US
            </a>
          </div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {[
            { icon: Shield, title: "Trusted Brands", desc: "UltraTech, Dalmia, Tata Tiscon & more" },
            { icon: TrendingDown, title: "Competitive Prices", desc: "Daily updated rates from our store" },
            { icon: Truck, title: "Reliable Supply", desc: "On-time delivery across the region" },
            { icon: ShoppingBag, title: "Easy Ordering", desc: "Order online, pay on delivery" },
          ].map((f) => (
            <div key={f.title} className="rounded-lg border border-gray-200 p-6 text-center transition hover:border-[#F59E0B] hover:shadow-lg">
              <f.icon className="mx-auto h-10 w-10 text-[#F59E0B]" />
              <h3 className="mt-4 font-bold text-[#111827]">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="mb-8 text-center text-3xl font-black text-[#111827]">SHOP BY CATEGORY</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Link href="/cement" className="group relative overflow-hidden rounded-xl bg-[#111827] p-8 transition hover:ring-2 hover:ring-[#F59E0B]">
              <div className="absolute inset-0 opacity-30">
                <Image src="/images/cement/ultratech.jpg" alt="Cement" fill unoptimized className="object-cover" />
              </div>
              <div className="relative z-10">
                <div className="mb-2 h-1 w-12 bg-[#F59E0B]" />
                <h3 className="text-3xl font-black text-white">CEMENT</h3>
                <p className="mt-2 text-gray-300">Quality cement from trusted brands.</p>
                <span className="mt-4 inline-block text-sm font-bold text-[#F59E0B] group-hover:underline">
                  SHOP CEMENT →
                </span>
              </div>
            </Link>
            <Link href="/steel" className="group relative overflow-hidden rounded-xl bg-[#111827] p-8 transition hover:ring-2 hover:ring-[#F59E0B]">
              <div className="absolute inset-0 opacity-30">
                <Image src="/images/steel/tata-tiscon.jpg" alt="Steel" fill unoptimized className="object-cover" />
              </div>
              <div className="relative z-10">
                <div className="mb-2 h-1 w-12 bg-[#F59E0B]" />
                <h3 className="text-3xl font-black text-white">STEEL & TMT</h3>
                <p className="mt-2 text-gray-300">Reliable steel for strong construction.</p>
                <span className="mt-4 inline-block text-sm font-bold text-[#F59E0B] group-hover:underline">
                  SHOP STEEL →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Cement */}
      {cementProducts.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-black text-[#111827]">POPULAR CEMENT</h2>
              <Link href="/cement" className="text-sm font-bold text-[#F59E0B] hover:underline">View All →</Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {cementProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Steel */}
      {steelProducts.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-black text-[#111827]">POPULAR STEEL</h2>
              <Link href="/steel" className="text-sm font-bold text-[#F59E0B] hover:underline">View All →</Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steelProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brands */}
      <section className="bg-[#111827] py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="mb-8 text-center text-3xl font-black text-white">
            TRUSTED <span className="text-[#F59E0B]">BRANDS</span>
          </h2>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 md:grid-cols-9">
            {[...cementBrands, ...steelBrands].map((brand) => (
              <div
                key={brand}
                className="rounded-lg bg-white/10 px-3 py-4 text-center text-sm font-bold text-white transition hover:bg-white/20 hover:ring-1 hover:ring-[#F59E0B]"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="mb-8 text-center text-3xl font-black text-[#111827]">
            WHY CHOOSE PAVITHRA TRADERS
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Award, title: "Quality", desc: "Genuine branded materials only" },
              { icon: TrendingDown, title: "Pricing", desc: "Transparent daily rate updates" },
              { icon: Truck, title: "Supply", desc: "Consistent stock availability" },
              { icon: Headphones, title: "Service", desc: "Dedicated support via WhatsApp" },
            ].map((f) => (
              <div key={f.title} className="rounded-lg bg-[#111827] p-6 text-center text-white">
                <f.icon className="mx-auto h-10 w-10 text-[#F59E0B]" />
                <h3 className="mt-4 font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery */}
      <section className="bg-white py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 md:flex-row lg:px-8">
          <Truck className="h-24 w-24 shrink-0 text-[#F59E0B]" />
          <div>
            <h2 className="text-3xl font-black text-[#111827]">DELIVERY AVAILABLE</h2>
            <p className="mt-4 text-gray-600">
              We deliver cement and steel directly to your construction site. Enter your delivery address during checkout and our team will confirm delivery details.
            </p>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="bg-[#111827] py-16 text-center">
        <h2 className="text-3xl font-black text-white">
          READY TO BUILD WITH{" "}
          <span className="text-[#F59E0B]">PAVITHRA TRADERS</span>?
        </h2>
        <p className="mt-4 text-gray-400">Get instant quotes and place orders via WhatsApp</p>
        <a
          href="https://wa.me/919025644746"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-lg bg-[#25D366] px-10 py-4 text-sm font-bold tracking-wide text-white transition hover:bg-[#1da851]"
        >
          WHATSAPP US
        </a>
      </section>

      {/* About snippet */}
      <section id="about" className="py-16">
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
          <h2 className="text-3xl font-black text-[#111827]">ABOUT US</h2>
          <p className="mt-4 text-gray-600">
            PAVITHRA TRADERS is a trusted construction materials supplier specializing in premium cement and TMT steel. We serve builders, contractors, and homeowners with quality products at competitive prices.
          </p>
          <Link href="/about" className="mt-4 inline-block text-sm font-bold text-[#F59E0B] hover:underline">
            Learn More →
          </Link>
        </div>
      </section>

      {/* Contact snippet */}
      <section id="contact" className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
          <MapPin className="mx-auto h-10 w-10 text-[#F59E0B]" />
          <h2 className="mt-4 text-3xl font-black text-[#111827]">CONTACT US</h2>
          <p className="mt-4 text-gray-600">
            Phone: 9025644746 | WhatsApp: 9025644746 | Location: AAA
          </p>
          <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            Mon–Sat: 8:00 AM – 7:00 PM
          </div>
          <Link href="/contact" className="mt-4 inline-block text-sm font-bold text-[#F59E0B] hover:underline">
            Contact Page →
          </Link>
        </div>
      </section>
    </>
  );
}
