import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { decimalToNumber } from "@/lib/utils";

export async function GET() {
  try {
    const session = await requireAdmin();
    if (!session) return apiError("Unauthorized", 403);

    const history = await prisma.priceHistory.findMany({
      include: {
        product: { select: { name: true, brand: true, unit: true } },
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return apiSuccess(
      history.map((h) => ({
        id: h.id,
        productId: h.productId,
        productName: h.product.name,
        brand: h.product.brand,
        unit: h.product.unit,
        oldPrice: decimalToNumber(h.oldPrice),
        newPrice: decimalToNumber(h.newPrice),
        changedBy: h.user.name,
        createdAt: h.createdAt,
      }))
    );
  } catch (err) {
    return handleApiError(err, "Unable to load price history.");
  }
}
