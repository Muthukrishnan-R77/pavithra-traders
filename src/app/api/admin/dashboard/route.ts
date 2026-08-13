import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { decimalToNumber } from "@/lib/utils";

export async function GET() {
  try {
    const session = await requireAdmin();
    if (!session) return apiError("Unauthorized", 403);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalOrders,
      newOrders,
      pendingOrders,
      completedOrders,
      totalProducts,
      todayOrders,
      todaySalesAgg,
      allProducts,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "NEW" } }),
      prisma.order.count({
        where: {
          status: { in: ["NEW", "CONFIRMED", "PROCESSING", "OUT_FOR_DELIVERY"] },
        },
      }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.product.count({ where: { active: true } }),
      prisma.order.count({
        where: { createdAt: { gte: today, lt: tomorrow } },
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: today, lt: tomorrow } },
        _sum: { total: true },
      }),
      prisma.product.findMany({
        where: { active: true },
        select: { stock: true, minimumStock: true },
      }),
    ]);

    const lowStock = allProducts.filter((p) => p.stock > 0 && p.stock <= p.minimumStock).length;
    const outOfStock = allProducts.filter((p) => p.stock <= 0).length;

    return apiSuccess({
      totalOrders,
      newOrders,
      pendingOrders,
      completedOrders,
      totalProducts,
      lowStock: lowStock + outOfStock,
      todayOrders,
      todaySales: decimalToNumber(todaySalesAgg._sum.total ?? 0),
    });
  } catch (err) {
    return handleApiError(err, "Unable to load dashboard stats.");
  }
}
