import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { serializeProduct } from "@/lib/settings";
import { Category, Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const search = searchParams.get("search");
    const activeOnly = searchParams.get("active") !== "false";

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

    const products = await prisma.product.findMany({
      where,
      orderBy: [{ category: "asc" }, { brand: "asc" }, { variant: "asc" }],
    });

    return apiSuccess(products.map(serializeProduct));
  } catch (err) {
    return handleApiError(err, "Unable to load products. Please try again.");
  }
}
