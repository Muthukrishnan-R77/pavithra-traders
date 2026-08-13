import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { serializeProduct } from "@/lib/settings";
import { productSchema } from "@/lib/validations";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError("Unauthorized", 403);

    const { id } = await params;
    const body = await request.json();
    const parsed = productSchema.partial().safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message ?? "Invalid product data.", 400);
    }

    const product = await prisma.product.update({
      where: { id },
      data: parsed.data,
    });

    return apiSuccess(serializeProduct(product));
  } catch (err) {
    return handleApiError(err, "Unable to update product.");
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError("Unauthorized", 403);

    const { id } = await params;

    await prisma.product.delete({ where: { id } });

    return apiSuccess({ deleted: true });
  } catch (err) {
    return handleApiError(err, "Unable to delete product.");
  }
}
