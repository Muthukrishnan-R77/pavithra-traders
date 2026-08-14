import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/settings";
import { STATIC_PRODUCTS } from "@/lib/catalog-data";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const dbPromise = prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
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

    const product = await Promise.race([dbPromise, timeoutPromise]);

    if (product) {
      return NextResponse.json(
        { success: true, data: serializeProduct(product) },
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

  const staticMatch = STATIC_PRODUCTS.find((p) => p.id === id || p.slug === id);
  if (staticMatch) {
    return NextResponse.json(
      { success: true, data: staticMatch },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  }

  return NextResponse.json(
    { success: false, error: "Product not found." },
    { status: 404 }
  );
}
