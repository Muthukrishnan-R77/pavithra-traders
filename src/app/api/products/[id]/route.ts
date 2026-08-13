import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { serializeProduct } from "@/lib/settings";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        active: true,
      },
    });

    if (!product) {
      return apiError("Product not found.", 404);
    }

    return apiSuccess(serializeProduct(product));
  } catch (err) {
    return handleApiError(err, "Unable to load product. Please try again.");
  }
}
