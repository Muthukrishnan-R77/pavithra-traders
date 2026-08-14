import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/settings";
import { STATIC_PRODUCTS } from "@/lib/catalog-data";
import { Category, Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const search = searchParams.get("search");
  const activeOnly = searchParams.get("active") !== "false";

  try {
    const where: Prisma.ProductWhereInput = {};

    if (activeOnly) where.active = true;

    if (category) {
      where.category = category.toUpperCase() as Category;
    }

    if (brand) {
      where.brand = { contains: brand, mode: "insensitive" };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
        { variant: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const dbPromise = prisma.product.findMany({
      where,
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

    const products = await Promise.race([dbPromise, timeoutPromise]);

    if (products && Array.isArray(products) && products.length > 0) {
      return NextResponse.json(
        { success: true, data: products.map(serializeProduct) },
        {
          status: 200,
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          },
        }
      );
    }
  } catch {
    // Graceful fallback below
  }

  // Static fallback if DB is cold or unavailable
  let filtered = STATIC_PRODUCTS;
  if (category) {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }
  if (brand) {
    filtered = filtered.filter((p) =>
      p.brand.toLowerCase().includes(brand.toLowerCase())
    );
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.variant && p.variant.toLowerCase().includes(q))
    );
  }

  return NextResponse.json(
    { success: true, data: filtered },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
