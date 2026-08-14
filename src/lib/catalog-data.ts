import { Product, Category } from "@/types";
import { prisma } from "./prisma";
import { serializeProduct } from "./settings";

export const STATIC_PRODUCTS: Product[] = [
  // CEMENT BRANDS
  {
    id: "cement-ultratech",
    name: "UltraTech Cement",
    slug: "ultratech-cement",
    description:
      "Premium UltraTech cement for strong and durable construction. Ideal for residential and commercial projects. High compressive strength and excellent workability.",
    category: "CEMENT" as Category,
    brand: "UltraTech",
    variant: null,
    price: 450,
    unit: "Bag",
    stock: 250,
    minimumStock: 50,
    image: "/images/cement/ultratech.jpg",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "cement-dalmia",
    name: "Dalmia Cement",
    slug: "dalmia-cement",
    description:
      "Premium Dalmia cement engineered with superior slag blend for maximum durability and moisture resistance. Trusted by builders across South India.",
    category: "CEMENT" as Category,
    brand: "Dalmia",
    variant: null,
    price: 440,
    unit: "Bag",
    stock: 200,
    minimumStock: 50,
    image: "/images/cement/dalmia.jpg",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "cement-ramco",
    name: "Ramco Cement",
    slug: "ramco-cement",
    description:
      "Ramco Supercrete & Supergrade cement. Renowned for consistent quality, high early strength, and crack resistance for foundations and slabs.",
    category: "CEMENT" as Category,
    brand: "Ramco",
    variant: null,
    price: 430,
    unit: "Bag",
    stock: 180,
    minimumStock: 50,
    image: "/images/cement/ramco.jpg",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "cement-maha",
    name: "Maha Cement",
    slug: "maha-cement",
    description:
      "Maha Solid HD Cement providing unmatched structural stability, low heat of hydration, and superior surface finishing for all construction works.",
    category: "CEMENT" as Category,
    brand: "Maha",
    variant: null,
    price: 420,
    unit: "Bag",
    stock: 150,
    minimumStock: 50,
    image: "/images/cement/maha.jpg",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "cement-penna",
    name: "Penna Cement",
    slug: "penna-cement",
    description:
      "High grade Penna cement manufactured with state-of-the-art technology for exceptional binding strength and long-lasting concrete structures.",
    category: "CEMENT" as Category,
    brand: "Penna",
    variant: null,
    price: 435,
    unit: "Bag",
    stock: 160,
    minimumStock: 50,
    image: "/images/cement/penna.jpg",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },

  // STEEL BRANDS & VARIANTS
  // Tata Tiscon
  {
    id: "steel-tata-tiscon-8mm",
    name: "Tata Tiscon 8mm",
    slug: "tata-tiscon-8mm",
    description:
      "Tata Tiscon 550D Super Ductile TMT steel bars 8mm. Primary steel with superior earthquake and corrosion resistance.",
    category: "STEEL" as Category,
    brand: "Tata Tiscon",
    variant: "8mm",
    price: 58,
    unit: "Kg",
    stock: 5000,
    minimumStock: 500,
    image: "/images/steel/tata-tiscon.jpg",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "steel-tata-tiscon-10mm",
    name: "Tata Tiscon 10mm",
    slug: "tata-tiscon-10mm",
    description:
      "Tata Tiscon 550D Super Ductile TMT steel bars 10mm. Ideal for beam and column reinforcement.",
    category: "STEEL" as Category,
    brand: "Tata Tiscon",
    variant: "10mm",
    price: 59,
    unit: "Kg",
    stock: 5000,
    minimumStock: 500,
    image: "/images/steel/tata-tiscon.jpg",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "steel-tata-tiscon-12mm",
    name: "Tata Tiscon 12mm",
    slug: "tata-tiscon-12mm",
    description:
      "Tata Tiscon 550D Super Ductile TMT steel bars 12mm. Heavy-duty load-bearing structural reinforcement.",
    category: "STEEL" as Category,
    brand: "Tata Tiscon",
    variant: "12mm",
    price: 60,
    unit: "Kg",
    stock: 5000,
    minimumStock: 500,
    image: "/images/steel/tata-tiscon.jpg",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "steel-tata-tiscon-16mm",
    name: "Tata Tiscon 16mm",
    slug: "tata-tiscon-16mm",
    description:
      "Tata Tiscon 550D Super Ductile TMT steel bars 16mm. Maximum strength for multi-story buildings and pillars.",
    category: "STEEL" as Category,
    brand: "Tata Tiscon",
    variant: "16mm",
    price: 62,
    unit: "Kg",
    stock: 5000,
    minimumStock: 500,
    image: "/images/steel/tata-tiscon.jpg",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "steel-tata-tiscon-20mm",
    name: "Tata Tiscon 20mm",
    slug: "tata-tiscon-20mm",
    description:
      "Tata Tiscon 550D Super Ductile TMT steel bars 20mm. Heavy industrial and bridge grade structural steel.",
    category: "STEEL" as Category,
    brand: "Tata Tiscon",
    variant: "20mm",
    price: 64,
    unit: "Kg",
    stock: 5000,
    minimumStock: 500,
    image: "/images/steel/tata-tiscon.jpg",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },

  // JSW Neosteel
  {
    id: "steel-jsw-neosteel-8mm",
    name: "JSW Neosteel 8mm",
    slug: "jsw-neosteel-8mm",
    description: "JSW Neosteel Fe 550D pure steel TMT bars 8mm with superior bendability and weldability.",
    category: "STEEL" as Category,
    brand: "JSW Neosteel",
    variant: "8mm",
    price: 58,
    unit: "Kg",
    stock: 5000,
    minimumStock: 500,
    image: "/images/steel/jsw-neosteel.jpg",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "steel-jsw-neosteel-10mm",
    name: "JSW Neosteel 10mm",
    slug: "jsw-neosteel-10mm",
    description: "JSW Neosteel Fe 550D pure steel TMT bars 10mm for dependable residential construction.",
    category: "STEEL" as Category,
    brand: "JSW Neosteel",
    variant: "10mm",
    price: 59,
    unit: "Kg",
    stock: 5000,
    minimumStock: 500,
    image: "/images/steel/jsw-neosteel.jpg",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "steel-jsw-neosteel-12mm",
    name: "JSW Neosteel 12mm",
    slug: "jsw-neosteel-12mm",
    description: "JSW Neosteel Fe 550D pure steel TMT bars 12mm for standard columns and slabs.",
    category: "STEEL" as Category,
    brand: "JSW Neosteel",
    variant: "12mm",
    price: 60,
    unit: "Kg",
    stock: 5000,
    minimumStock: 500,
    image: "/images/steel/jsw-neosteel.jpg",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "steel-jsw-neosteel-16mm",
    name: "JSW Neosteel 16mm",
    slug: "jsw-neosteel-16mm",
    description: "JSW Neosteel Fe 550D pure steel TMT bars 16mm with uniform rib pattern for maximum concrete bonding.",
    category: "STEEL" as Category,
    brand: "JSW Neosteel",
    variant: "16mm",
    price: 62,
    unit: "Kg",
    stock: 5000,
    minimumStock: 500,
    image: "/images/steel/jsw-neosteel.jpg",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "steel-jsw-neosteel-20mm",
    name: "JSW Neosteel 20mm",
    slug: "jsw-neosteel-20mm",
    description: "JSW Neosteel Fe 550D pure steel TMT bars 20mm for heavy foundation and commercial projects.",
    category: "STEEL" as Category,
    brand: "JSW Neosteel",
    variant: "20mm",
    price: 64,
    unit: "Kg",
    stock: 5000,
    minimumStock: 500,
    image: "/images/steel/jsw-neosteel.jpg",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },

  // Agni Steels
  {
    id: "steel-agni-steels-8mm",
    name: "Agni Steels 8mm",
    slug: "agni-steels-8mm",
    description: "Agni Steels 550D CRS TMT bars 8mm with high thermal resistance and corrosion protection.",
    category: "STEEL" as Category,
    brand: "Agni Steels",
    variant: "8mm",
    price: 58,
    unit: "Kg",
    stock: 5000,
    minimumStock: 500,
    image: "/images/steel/agni-steels.jpg",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "steel-agni-steels-10mm",
    name: "Agni Steels 10mm",
    slug: "agni-steels-10mm",
    description: "Agni Steels 550D CRS TMT bars 10mm for reliable building frameworks.",
    category: "STEEL" as Category,
    brand: "Agni Steels",
    variant: "10mm",
    price: 59,
    unit: "Kg",
    stock: 5000,
    minimumStock: 500,
    image: "/images/steel/agni-steels.jpg",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "steel-agni-steels-12mm",
    name: "Agni Steels 12mm",
    slug: "agni-steels-12mm",
    description: "Agni Steels 550D CRS TMT bars 12mm for standard columns and slabs.",
    category: "STEEL" as Category,
    brand: "Agni Steels",
    variant: "12mm",
    price: 60,
    unit: "Kg",
    stock: 5000,
    minimumStock: 500,
    image: "/images/steel/agni-steels.jpg",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "steel-agni-steels-16mm",
    name: "Agni Steels 16mm",
    slug: "agni-steels-16mm",
    description: "Agni Steels 550D CRS TMT bars 16mm for heavy structural pillars.",
    category: "STEEL" as Category,
    brand: "Agni Steels",
    variant: "16mm",
    price: 62,
    unit: "Kg",
    stock: 5000,
    minimumStock: 500,
    image: "/images/steel/agni-steels.jpg",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "steel-agni-steels-20mm",
    name: "Agni Steels 20mm",
    slug: "agni-steels-20mm",
    description: "Agni Steels 550D CRS TMT bars 20mm for foundation and load-bearing structures.",
    category: "STEEL" as Category,
    brand: "Agni Steels",
    variant: "20mm",
    price: 64,
    unit: "Kg",
    stock: 5000,
    minimumStock: 500,
    image: "/images/steel/agni-steels.jpg",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },

  // SSI TMT
  {
    id: "steel-ssi-tmt-8mm",
    name: "SSI TMT 8mm",
    slug: "ssi-tmt-8mm",
    description: "SSI TMT 550 grade high-yield bars 8mm, cost-effective and dependable.",
    category: "STEEL" as Category,
    brand: "SSI TMT",
    variant: "8mm",
    price: 58,
    unit: "Kg",
    stock: 5000,
    minimumStock: 500,
    image: "/images/steel/ssi-tmt.jpg",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "steel-ssi-tmt-10mm",
    name: "SSI TMT 10mm",
    slug: "ssi-tmt-10mm",
    description: "SSI TMT 550 grade high-yield bars 10mm for residential construction.",
    category: "STEEL" as Category,
    brand: "SSI TMT",
    variant: "10mm",
    price: 59,
    unit: "Kg",
    stock: 5000,
    minimumStock: 500,
    image: "/images/steel/ssi-tmt.jpg",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "steel-ssi-tmt-12mm",
    name: "SSI TMT 12mm",
    slug: "ssi-tmt-12mm",
    description: "SSI TMT 550 grade high-yield bars 12mm for standard reinforcement.",
    category: "STEEL" as Category,
    brand: "SSI TMT",
    variant: "12mm",
    price: 60,
    unit: "Kg",
    stock: 5000,
    minimumStock: 500,
    image: "/images/steel/ssi-tmt.jpg",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "steel-ssi-tmt-16mm",
    name: "SSI TMT 16mm",
    slug: "ssi-tmt-16mm",
    description: "SSI TMT 550 grade high-yield bars 16mm for structural columns.",
    category: "STEEL" as Category,
    brand: "SSI TMT",
    variant: "16mm",
    price: 62,
    unit: "Kg",
    stock: 5000,
    minimumStock: 500,
    image: "/images/steel/ssi-tmt.jpg",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "steel-ssi-tmt-20mm",
    name: "SSI TMT 20mm",
    slug: "ssi-tmt-20mm",
    description: "SSI TMT 550 grade high-yield bars 20mm for foundation work.",
    category: "STEEL" as Category,
    brand: "SSI TMT",
    variant: "20mm",
    price: 64,
    unit: "Kg",
    stock: 5000,
    minimumStock: 500,
    image: "/images/steel/ssi-tmt.jpg",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

/**
 * Robust data fetcher that queries Prisma with a fast timeout (2.5s)
 * and falls back to STATIC_PRODUCTS immediately if the DB is cold/starting up.
 */
export async function getCatalogProducts(): Promise<Product[]> {
  try {
    const dbPromise = prisma.product.findMany({
      where: { active: true },
      orderBy: [{ category: "asc" }, { brand: "asc" }, { variant: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        category: true,
        brand: true,
        variant: true,
        price: true,
        unit: true,
        stock: true,
        minimumStock: true,
        image: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const timeoutPromise = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), 1200)
    );

    const result = await Promise.race([dbPromise, timeoutPromise]);
    if (result && Array.isArray(result) && result.length > 0) {
      return result.map(serializeProduct);
    }
  } catch {
    // Database cold or error: gracefully fallback to static catalog
  }

  return STATIC_PRODUCTS;
}

export async function getCementProducts(): Promise<Product[]> {
  const products = await getCatalogProducts();
  return products.filter((p) => p.category === "CEMENT");
}

export async function getSteelProducts(): Promise<Product[]> {
  const products = await getCatalogProducts();
  return products.filter((p) => p.category === "STEEL");
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const dbPromise = prisma.product.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        active: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        category: true,
        brand: true,
        variant: true,
        price: true,
        unit: true,
        stock: true,
        minimumStock: true,
        image: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const timeoutPromise = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), 2000)
    );

    const result = await Promise.race([dbPromise, timeoutPromise]);
    if (result) {
      return serializeProduct(result);
    }
  } catch {
    // Database cold or error: gracefully search static catalog
  }

  const staticMatch = STATIC_PRODUCTS.find(
    (p) => p.slug === slug || p.id === slug
  );
  return staticMatch ?? null;
}
