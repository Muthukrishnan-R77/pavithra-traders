import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { serializeProduct } from "@/lib/settings";
import { productSchema } from "@/lib/validations";

export async function GET() {
  try {
    const session = await requireAdmin();
    if (!session) return apiError("Unauthorized", 403);

    const products = await prisma.product.findMany({
      orderBy: [{ category: "asc" }, { brand: "asc" }, { variant: "asc" }],
    });

    return apiSuccess(products.map(serializeProduct));
  } catch (err) {
    return handleApiError(err, "Unable to load products.");
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError("Unauthorized", 403);

    const body = await request.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message ?? "Invalid product data.", 400);
    }

    const existing = await prisma.product.findUnique({
      where: { slug: parsed.data.slug },
    });

    if (existing) {
      return apiError("A product with this slug already exists.", 400);
    }

    const product = await prisma.product.create({ data: parsed.data });

    return apiSuccess(serializeProduct(product), 201);
  } catch (err) {
    return handleApiError(err, "Unable to create product.");
  }
}
