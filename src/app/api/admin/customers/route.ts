import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { decimalToNumber } from "@/lib/utils";

export async function GET() {
  try {
    const session = await requireAdmin();
    if (!session) return apiError("Unauthorized", 403);

    const orders = await prisma.order.findMany({
      select: {
        customerName: true,
        phone: true,
        whatsapp: true,
        total: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const customerMap = new Map<
      string,
      {
        customerName: string;
        phone: string;
        whatsapp: string | null;
        orderCount: number;
        lastOrder: Date;
        totalValue: number;
      }
    >();

    for (const order of orders) {
      const key = order.phone;
      const existing = customerMap.get(key);
      const total = decimalToNumber(order.total);

      if (existing) {
        existing.orderCount += 1;
        existing.totalValue += total;
        if (order.createdAt > existing.lastOrder) {
          existing.lastOrder = order.createdAt;
          existing.customerName = order.customerName;
          existing.whatsapp = order.whatsapp;
        }
      } else {
        customerMap.set(key, {
          customerName: order.customerName,
          phone: order.phone,
          whatsapp: order.whatsapp,
          orderCount: 1,
          lastOrder: order.createdAt,
          totalValue: total,
        });
      }
    }

    const customers = Array.from(customerMap.values()).sort(
      (a, b) => b.lastOrder.getTime() - a.lastOrder.getTime()
    );

    return apiSuccess(customers);
  } catch (err) {
    return handleApiError(err, "Unable to load customers.");
  }
}
