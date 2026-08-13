import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-response";
import { serializeOrder } from "@/lib/settings";
import { updateOrderStatusSchema } from "@/lib/validations";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError("Unauthorized", 403);

    const { id } = await params;

    const order = await prisma.order.findFirst({
      where: { OR: [{ id }, { orderNumber: id }] },
      include: { items: true },
    });

    if (!order) return apiError("Order not found.", 404);

    return apiSuccess(serializeOrder(order));
  } catch (err) {
    return handleApiError(err, "Unable to load order.");
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError("Unauthorized", 403);

    const { id } = await params;
    const body = await request.json();
    const parsed = updateOrderStatusSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message ?? "Invalid status.", 400);
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status: parsed.data.status },
      include: { items: true },
    });

    return apiSuccess(serializeOrder(order));
  } catch (err) {
    return handleApiError(err, "Unable to update order status.");
  }
}
