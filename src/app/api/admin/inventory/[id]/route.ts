import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { updateInventorySchema } from "@/lib/validations";
import { serializeProduct } from "@/lib/settings";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError("Unauthorized", 403);

    const { id } = await params;
    const body = await request.json();
    const parsed = updateInventorySchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message ?? "Invalid inventory data.", 400);
    }

    const product = await prisma.product.update({
      where: { id },
      data: parsed.data,
    });

    return apiSuccess(serializeProduct(product));
  } catch (err) {
    return handleApiError(err, "Unable to update inventory.");
  }
}
