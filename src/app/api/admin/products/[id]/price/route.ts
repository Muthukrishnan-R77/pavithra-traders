import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { serializeProduct } from "@/lib/settings";
import { updatePriceSchema } from "@/lib/validations";
import { decimalToNumber } from "@/lib/utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError("Unauthorized", 403);

    const { id } = await params;
    const body = await request.json();
    const parsed = updatePriceSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message ?? "Invalid price.", 400);
    }

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return apiError("Product not found.", 404);

    const oldPrice = decimalToNumber(product.price);
    const newPrice = parsed.data.price;

    if (oldPrice === newPrice) {
      return apiSuccess(serializeProduct(product));
    }

    const [updated] = await prisma.$transaction([
      prisma.product.update({
        where: { id },
        data: { price: newPrice },
      }),
      prisma.priceHistory.create({
        data: {
          productId: id,
          oldPrice,
          newPrice,
          changedBy: session.user.id,
        },
      }),
    ]);

    // Invalidate customer page caches so new price is reflected immediately
    try {
      revalidatePath("/");
      revalidatePath("/cement");
      revalidatePath("/steel");
      revalidatePath("/products");
      if (product.slug) {
        revalidatePath(`/products/${product.slug}`);
      }
    } catch {
      // Ignore cache revalidation errors if outside request context
    }

    return apiSuccess(serializeProduct(updated));
  } catch (err) {
    return handleApiError(err, "Unable to update price.");
  }
}
